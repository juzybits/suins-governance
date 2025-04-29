/**
 * Airdrop staked NS to users according to given config.
 */

import { existsSync, readFileSync, renameSync, writeFileSync } from "fs";
import {
  getFullnodeUrl,
  SuiClient,
  type SuiTransactionBlockResponse,
} from "@mysten/sui/client";
import { chunkArray, pairFromSecretKey } from "@polymedia/suitcase-core";
import { formatNSBalance } from "../../src/utils/formatNumber";
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
 * Maximum commands in a PTB is 1023, and each airdrop calls 2 commands
 */
const AIRDROPS_PER_TX = 511;

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
    throw new Error("PRIVATE_KEY must be set in your .env.local file");
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
  const dropsPerTx = chunkArray(airdrops, AIRDROPS_PER_TX);

  /* Print airdrop summary */

  let totalAmount = 0n;
  let totalRecipients = 0;
  airdrops.forEach((airdrop) => {
    totalAmount += BigInt(airdrop.amount_raw);
    totalRecipients++;
  });
  console.log(`Transactions required: ${dropsPerTx.length}`);
  console.log(`Total airdropped batches: ${totalRecipients}`);
  console.log(`Total airdropped NS amount: ${formatNSBalance(totalAmount)}`);

  /* Check user has enough NS balance */

  const userNsBalance = await getNsBalance({ client, owner, netCnf });
  console.log(`Your NS balance: ${formatNSBalance(userNsBalance)}`);
  if (userNsBalance < totalAmount) {
    throw new Error("Your NS balance is lower than the total airdrop amount");
  }

  /* Fetch StakingAdminCap */

  const adminCapId = await getStakingAdminCapId({ client, netCnf, owner });
  if (!adminCapId) {
    throw new Error(`StakingAdminCap is not owned by: ${owner}`);
  }

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
      stakingAdminCapId: adminCapId,
      output,
      log,
    });
    console.log("Airdrop completed successfully");
    await writeFinalLog(true);
  } catch (error) {
    console.error("Airdrop failed:", error);
    await writeFinalLog(false);
  }

  /* logging helpers */

  function writeInitialLog(): AirdropLog {
    const log: AirdropLog = {
      status: AirdropStatus.IN_PROGRESS,
      network,
      startTime: new Date().toISOString(),
      endTime: null,
      totalRecipients,
      totalAmount: totalAmount.toString(),
      txRequired: dropsPerTx.length,
      nsBalanceBefore: userNsBalance.toString(),
      nsBalanceAfter: null,
      nsBalanceUsed: null,
      transactions: dropsPerTx.map((drops, index) => {
        let dropsTotalAmount = 0n;
        drops.forEach((drop) => (dropsTotalAmount += BigInt(drop.amount_raw)));

        return {
          txIndex: index,
          status: TxStatus.NOT_STARTED,
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
    log.status = success ? AirdropStatus.SUCCESS : AirdropStatus.FAILURE;
    log.endTime = new Date().toISOString();
    writeLog(output, log);
    try {
      const finalNsBalance = await getNsBalance({ client, owner, netCnf });
      log.nsBalanceAfter = finalNsBalance.toString();
      log.nsBalanceUsed = (userNsBalance - finalNsBalance).toString();
      writeLog(output, log);
    } catch (error) {
      // no big deal, we just lose the final balance logging
    }
  }
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
        })(tx);
        tx.moveCall({
          target: `${netCnf.votingPkgId}::staking_batch::admin_new`,
          typeArguments: [],
          arguments: [
            tx.object(stakingAdminCapId),
            tx.object(netCnf.stakingConfigObjId),
            tx.object(netCnf.statsObjId),
            payCoin,
            tx.pure.u64(drop.lock_months),
            tx.pure.u64(drop.start_ms),
            tx.pure.address(drop.recipient),
            tx.object.clock(),
          ],
        });
      }

      log.transactions[txIndex]!.status = TxStatus.EXECUTING;
      writeLog(output, log);

      const resp = await signExecuteAndWaitTx({ client, tx, signer });
      log.transactions[txIndex]!.digest = resp.digest;

      if (resp.effects?.status.status === "success") {
        log.transactions[txIndex]!.status = TxStatus.SUCCESS;
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
      log.transactions[txIndex]!.status = TxStatus.FAILURE;
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
  netCnf,
  owner,
}: {
  client: SuiClient;
  netCnf: NetworkConfig;
  owner: string;
}): Promise<string | null> {
  const paginatedObjResp = await client.getOwnedObjects({
    owner,
    filter: {
      StructType: `${netCnf.votingPkgId}::staking_admin::StakingAdminCap`,
    },
    limit: 1,
  });

  for (const resp of paginatedObjResp.data) {
    return resp.data?.objectId ?? null;
  }

  return null;
}

async function signExecuteAndWaitTx({
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
    pollInterval: 200,
  });
}

/**
 * Display a query to the user and wait for their input. Return true if the user enters `y`.
 */
async function promptUser(
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
  status: TxStatus;
  digest: string | null;
  errorMessage?: string;
  recipients: number;
  totalAmount: string;
};

type AirdropLog = {
  status: AirdropStatus;
  network: string;
  startTime: string;
  endTime: string | null;
  totalRecipients: number;
  totalAmount: string;
  txRequired: number;
  nsBalanceBefore: string;
  nsBalanceAfter: string | null;
  nsBalanceUsed: string | null;
  transactions: TxLog[];
};

const enum TxStatus {
  NOT_STARTED = "not_started",
  EXECUTING = "executing",
  SUCCESS = "success",
  FAILURE = "failure",
}

const enum AirdropStatus {
  IN_PROGRESS = "in_progress",
  SUCCESS = "success",
  FAILURE = "failure",
}
