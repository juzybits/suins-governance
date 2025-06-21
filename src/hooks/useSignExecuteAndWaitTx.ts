import { type SuiClient } from "@mysten/sui/client";
import { type Transaction } from "@mysten/sui/transactions";
import {
  type SuiTransactionBlockResponse,
  type SuiTransactionBlockResponseOptions,
} from "@mysten/sui/client";
import {
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";

const POLL_INTERVAL_MS = 200;

const RESPONSE_OPTIONS: SuiTransactionBlockResponseOptions = {
  showEffects: true,
  showObjectChanges: true,
};

export function useSignExecuteAndWaitTx() {
  const { mutateAsync: walletSignTx } = useSignTransaction();
  const currAcct = useCurrentAccount();
  const suiClient = useSuiClient();

  return async (tx: Transaction): Promise<SuiTransactionBlockResponse> => {
    if (!currAcct) {
      throw new Error("Wallet not connected");
    }

    tx.setSender(currAcct.address);

    await devInspectOnDev(suiClient, currAcct.address, tx);

    const signedTx = await walletSignTx({ transaction: tx });

    const resp = await suiClient.executeTransactionBlock({
      transactionBlock: signedTx.bytes,
      signature: signedTx.signature,
      options: RESPONSE_OPTIONS,
    });

    if (resp.effects?.status.status !== "success") {
      const err = JSON.stringify(resp.effects?.status.error, null, 2);
      throw new Error(`[useSignExecuteAndWaitTx] failed with error: ${err}`);
    }

    await suiClient.waitForTransaction({
      digest: resp.digest,
      pollInterval: POLL_INTERVAL_MS,
    });

    return resp;
  };
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
    const err = JSON.stringify(dryRunResult.effects.status.error, null, 2);
    throw new Error(`[devInspectOnDev] failed with error: ${err}`);
  }
}
