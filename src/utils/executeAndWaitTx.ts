import { type SuiClient } from "@mysten/sui/client";
import { type Transaction } from "@mysten/sui/transactions";
import { type SuiSignAndExecuteTransactionOutput } from "@mysten/wallet-standard";

type SignAndExecuteTx = (params: {
  transaction: Transaction | string;
}) => Promise<SuiSignAndExecuteTransactionOutput>;

export async function executeAndWaitTx({
  suiClient,
  tx,
  sender,
  signAndExecuteTx,
}: {
  suiClient: SuiClient;
  tx: Transaction;
  sender: string | undefined;
  signAndExecuteTx: SignAndExecuteTx;
}) {
  if (!sender) {
    throw new Error("Wallet not connected");
  }

  tx.setSender(sender);

  await devInspectOnDev(suiClient, sender, tx);

  const resp = await signAndExecuteTx({
    transaction: tx,
  });

  await suiClient.waitForTransaction({
    digest: resp.digest,
    pollInterval: 200,
  });

  return resp;
}

async function devInspectOnDev(
  suiClient: SuiClient,
  sender: string,
  tx: Transaction,
) {
  if (process.env.NODE_ENV !== "development") return;

  const dryRunResult = await suiClient.devInspectTransactionBlock({
    sender,
    transactionBlock: tx,
  });
  if (dryRunResult.effects?.status.status !== "success") {
    throw new Error(
      "[devInspectOnDev] failed: " + JSON.stringify(dryRunResult, null, 2),
    );
  }
}
