import { type SuiClient } from "@mysten/sui/client";
import { type Transaction } from "@mysten/sui/transactions";

export async function devInspectOnDev(
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
