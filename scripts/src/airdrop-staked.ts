import { existsSync, readFileSync, renameSync, writeFileSync } from "fs";
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
  .requiredOption(
    "-o, --output <path>",
    "Path to output log JSON file that will be updated after each transaction",
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
  output,
  yes,
}: {
  network: string;
  config: string;
  output: string;
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
  const owner = signer.toSuiAddress();
  const client = new SuiClient({ url: getFullnodeUrl(network) });
  const netCnf = SUINS_PACKAGES[network]; // SuiNS package and object IDs

  /* Load airdrop config */

  const airdrops = readAirdropConfigFromFile(config);

  /* Print airdrop summary */

  const dropsPerTx = chunkArray(airdrops, AIRDROPS_PER_TX);
  console.log(`Transactions required: ${dropsPerTx.length}`);

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

  /* Check user has enough NS balance */

  const userBalance = await getNsBalance({ client, owner, netCnf });
  console.log(
    `Your NS balance: ${formatBalance(userBalance, NS_DECIMALS, CoinFormat.ROUNDED)}`,
  );
  if (userBalance < totalAmount) {
    console.error(
      "Error: Your NS balance is lower than the total airdrop amount",
    );
    process.exit(1);
  }

  /* Fetch StakingAdminCap (aborts if not owned by `signer`) */

  const stakingAdminCapId = await getStakingAdminCapId({
    client,
    packageId: netCnf.votingPkgId,
    owner: signer.toSuiAddress(),
  });

  /* Initialize airdrop log */

  const log = writeInitialLog();

  /* Get user confirmation */

  if (!yes) {
    const proceed = await promptUser();
    if (!proceed) {
      console.log("Aborting.");
      process.exit(0);
    }
  }

  /* Execute airdrop */

  try {
    await executeAirdrop({
      dropsPerTx,
      client,
      signer,
      netCnf,
      stakingAdminCapId,
      output,
      log,
    });
    console.log("Airdrop completed successfully");
    await writeFinalLog(true);
  } catch (error) {
    console.error("Airdrop failed:", error);
    await writeFinalLog(false);
  }

  function writeInitialLog(): AirdropLog {
    const log: AirdropLog = {
      status: "in_progress",
      network,
      startTime: new Date().toISOString(),
      endTime: null,
      totalRecipients,
      totalAmount: totalAmount.toString(),
      txRequired: dropsPerTx.length,
      balanceBefore: userBalance.toString(),
      balanceAfter: null,
      balanceUsed: null,
      transactions: dropsPerTx.map((drops, index) => {
        let dropsTotalAmount = 0n;
        drops.forEach((drop) => (dropsTotalAmount += BigInt(drop.amount_raw)));

        return {
          txIndex: index,
          status: "not_started",
          digest: null,
          recipients: drops.length,
          totalAmount: dropsTotalAmount.toString(),
        };
      }),
    };
    writeLog(output, log);
    return log;
  }

  async function writeFinalLog(success: boolean) {
    log.status = success ? "success" : "failure";
    log.endTime = new Date().toISOString();
    writeLog(output, log);
    const finalBalance = await getNsBalance({ client, owner, netCnf });
    log.balanceAfter = finalBalance.toString();
    log.balanceUsed = (userBalance - finalBalance).toString();
    writeLog(output, log);
  };
}

async function executeAirdrop({
  dropsPerTx,
  client,
  signer,
  netCnf,
  stakingAdminCapId,
  output,
  log,
}: {
  dropsPerTx: AirdropConfig[][];
  client: SuiClient;
  signer: Keypair;
  netCnf: NetworkConfig;
  stakingAdminCapId: string;
  output: string;
  log: AirdropLog;
}) {
  for (let txIndex = 0; txIndex < dropsPerTx.length; txIndex++) {
    console.log(`Starting tx ${txIndex + 1} of ${dropsPerTx.length}`);
    try {
      const tx = new Transaction();
      tx.setSender(signer.toSuiAddress());

      const txDrops = dropsPerTx[txIndex]!;
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

      log.transactions[txIndex]!.status = "executing";
      writeLog(output, log);

      const resp = await signExecuteAndWaitTx({ client, tx, signer });
      log.transactions[txIndex]!.digest = resp.digest;

      if (resp.effects?.status.status === "success") {
        log.transactions[txIndex]!.status = "success";
        writeLog(output, log);
        console.log(
          `Transaction ${txIndex + 1} completed. Digest: ${resp.digest}`,
        );
      } else {
        const errorMessage =
          resp.effects?.status.error ??
          `Transaction status was '${resp.effects?.status.status}'`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      log.transactions[txIndex]!.status = "failure";
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      log.transactions[txIndex]!.errorMessage = errorMessage;
      writeLog(output, log);
      console.error(`Transaction ${txIndex + 1} failed:`, errorMessage);
      throw error; // abort the airdrop process
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

/**
 * Safely writes the airdrop log to the output file.
 * Uses a temporary file to avoid corrupting the log if the process crashes during writing.
 */
function writeLog(outputPath: string, log: AirdropLog): void {
  try {
    const tmpPath = `${outputPath}.tmp`;
    writeFileSync(tmpPath, JSON.stringify(log, null, 2), "utf8");
    renameSync(tmpPath, outputPath);
  } catch (error) {
    throw new Error("Failed to write log file");
  }
}

async function getNsBalance({
  client,
  owner,
  netCnf,
}: {
  client: SuiClient;
  owner: string;
  netCnf: NetworkConfig;
}): Promise<bigint> {
  const balance = await client.getBalance({
    owner,
    coinType: netCnf.coinType,
  });
  return BigInt(balance.totalBalance);
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

// === logging ===

type TxLog = {
  txIndex: number;
  status: "not_started" | "executing" | "success" | "failure";
  digest: string | null;
  errorMessage?: string;
  recipients: number;
  totalAmount: string;
};

type AirdropLog = {
  status: "in_progress" | "success" | "failure";
  network: string;
  startTime: string;
  endTime: string | null;
  totalRecipients: number;
  totalAmount: string;
  txRequired: number;
  balanceBefore: string;
  balanceAfter: string | null;
  balanceUsed: string | null;
  transactions: TxLog[];
};
