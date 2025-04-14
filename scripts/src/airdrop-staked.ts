import { existsSync, readFileSync } from "fs";
import {
  getFullnodeUrl,
  SuiClient,
  type SuiTransactionBlockResponse,
} from "@mysten/sui/client";
import { chunkArray, pairFromSecretKey } from "@polymedia/suitcase-core";
import {
  CoinFormat,
  formatBalance,
  NS_DECIMALS,
} from "../../src/utils/formatNumber";
import type { AirdropConfig } from "./generate-airdrop-config";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import {
  isSupportedNetwork,
  SUINS_PACKAGES,
  SUPPORTED_NETWORKS,
  type NetworkConfig,
} from "../../src/constants/endpoints";
import type { Keypair, Signer } from "@mysten/sui/cryptography";
import { createInterface } from "readline";
import { Command } from "commander";

/**
 * Maximum commands in a PTB is 1024, and each airdrop calls 3 commands:
 * SplitCoins + admin_new + admin_transfer
 */
const AIRDROPS_PER_TX = 341;

const command = new Command();

command
  .description(
    "A tool for the StakingAdminCap holder to create and transfer StakingBatch objects",
  )
  .requiredOption(
    "-n, --network <network>",
    `Sui network to use (${SUPPORTED_NETWORKS.join(" | ")})`,
  )
  .requiredOption(
    "-c, --config <path>",
    "Path to airdrop config JSON file (see `generate-airdrop-config.ts`)",
  )
  .option("-y, --yes", "Skip confirmation prompt")
  .action(async (options) => {
    try {
      await main(options);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

command.parse(process.argv);

async function main({
  network,
  config,
  yes,
}: {
  network: string;
  config: string;
  yes: boolean;
}) {
  /* Validate args and env vars */

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY must be set in your .env file");
  }

  if (!isSupportedNetwork(network)) {
    throw new Error(`Unsupported network: ${network}`);
  }

  if (!existsSync(config)) {
    throw new Error(`Config file does not exist: ${config}`);
  }

  /* Initialize signer and client */

  const signer = pairFromSecretKey(privateKey);
  const client = new SuiClient({ url: getFullnodeUrl(network) });
  const netCnf = SUINS_PACKAGES[network]; // SuiNS package and object IDs

  /* Load airdrop config */

  const airdrops = readAirdropConfigFromFile(config);

  /* Fetch StakingAdminCap (aborts if not owned by `signer`) */

  const stakingAdminCapId = await getStakingAdminCapId({
    client,
    packageId: netCnf.votingPkgId,
    owner: signer.toSuiAddress(),
  });

  /* Confirm user has enough NS balance */

  const userBalance = BigInt(
    (
      await client.getBalance({
        owner: signer.toSuiAddress(),
        coinType: netCnf.coinType,
      })
    ).totalBalance,
  );
  console.log(
    `Your NS balance: ${formatBalance(userBalance, NS_DECIMALS, CoinFormat.ROUNDED)}`,
  );

  let totalAmount = 0n;
  let totalRecipients = 0;
  airdrops.forEach((airdrop) => {
    totalAmount += BigInt(airdrop.amount_raw);
    totalRecipients++;
  });
  console.log(`Total airdrop recipients: ${totalRecipients}`);
  console.log(
    `Total airdrop amount: ${formatBalance(totalAmount, NS_DECIMALS, CoinFormat.ROUNDED)}`,
  );
  console.log(
    `Transactions required: ${Math.ceil(totalRecipients / AIRDROPS_PER_TX)}`,
  );
  if (userBalance < totalAmount) {
    console.log("Your NS balance is lower than the total airdrop amount");
    process.exit(0);
  }

  /* Get user confirmation */

  if (!yes) {
    const proceed = await promptUser();
    if (!proceed) {
      console.log("Aborting.");
      process.exit(0);
    }
  }

  /* Execute airdrop */

  await executeAirdrop({
    airdrops,
    client,
    signer,
    netCnf,
    stakingAdminCapId,
  });
}

async function executeAirdrop({
  airdrops,
  client,
  signer,
  netCnf,
  stakingAdminCapId,
}: {
  airdrops: AirdropConfig[];
  client: SuiClient;
  signer: Keypair;
  netCnf: NetworkConfig;
  stakingAdminCapId: string;
}) {
  const dropsPerTx = chunkArray(airdrops, AIRDROPS_PER_TX);

  let txNumber = 0;
  for (const txDrops of dropsPerTx) {
    console.log(`Starting tx ${txNumber} of ${dropsPerTx.length}`);
    txNumber++;

    const tx = new Transaction();
    tx.setSender(signer.toSuiAddress());
    for (const drop of txDrops) {
      const payCoin = coinWithBalance({
        type: netCnf.coinType,
        balance: BigInt(drop.amount_raw),
      });
      const batch = tx.moveCall({
        target: `${netCnf.votingPkgId}::staking_batch::admin_new`,
        typeArguments: [],
        arguments: [
          tx.object(stakingAdminCapId),
          tx.object(netCnf.stakingStatsId),
          payCoin,
          tx.pure.u64(drop.start_ms),
          tx.pure.u64(drop.unlock_ms),
        ],
      });
      tx.moveCall({
        target: `${netCnf.votingPkgId}::staking_batch::admin_transfer`,
        typeArguments: [],
        arguments: [
          tx.object(stakingAdminCapId),
          batch,
          tx.pure.address(drop.recipient),
        ],
      });
    }
    const resp = await signExecuteAndWaitTx({ client, tx, signer });
    if (resp.effects?.status.status !== "success") {
      throw new Error(
        `Transaction status was '${resp.effects?.status.status}': ${resp.digest}. Response: ${JSON.stringify(resp, null, 2)}`,
      );
    }
  }
}

// === utils ===

function readAirdropConfigFromFile(filePath: string): AirdropConfig[] {
  const data = readFileSync(filePath, "utf8");
  const airdrops: AirdropConfig[] = JSON.parse(data);

  if (!airdrops || !Array.isArray(airdrops) || airdrops.length === 0) {
    throw new Error("No valid voter data found in the file.");
  }

  return airdrops;
}

async function getStakingAdminCapId({
  client,
  packageId,
  owner,
}: {
  client: SuiClient;
  packageId: string;
  owner: string;
}): Promise<string> {
  const paginatedObjResp = await client.getOwnedObjects({
    owner,
    filter: {
      StructType: `${packageId}::staking_admin::StakingAdminCap`,
    },
    limit: 1,
  });

  let stakingAdminCapId: string | null = null;

  for (const resp of paginatedObjResp.data) {
    if (resp.data?.objectId) {
      stakingAdminCapId = resp.data.objectId;
      break;
    }
  }

  if (!stakingAdminCapId) {
    throw new Error(`StakingAdminCap is not owned by: ${owner}`);
  }

  return stakingAdminCapId;
}

export async function signExecuteAndWaitTx({
  client,
  tx,
  signer,
}: {
  client: SuiClient;
  tx: Transaction;
  signer: Signer;
}): Promise<SuiTransactionBlockResponse> {
  const resp = await client.signAndExecuteTransaction({
    signer,
    transaction: tx,
  });

  return await client.waitForTransaction({
    digest: resp.digest,
    options: { showEffects: true, showObjectChanges: true },
    timeout: 60_000,
    pollInterval: 250,
  });
}

/**
 * Display a query to the user and wait for their input. Return true if the user enters `y`.
 */
export async function promptUser(
  question: string = "\nDoes this look okay? (y/n) ",
): Promise<boolean> {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y");
    });
  });
}
