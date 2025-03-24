import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import {
  useMutation,
  type UseMutationResult,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

import { NETWORK } from "@/constants/env";
import { SUINS_PACKAGES } from "@/constants/endpoints";

type LockRequest = {
  batchId: string;
  months: number;
};

const NS_DECIMALS = 6;

export function useLockMutation(
  mutationOptions?: Omit<
    UseMutationOptions<string, Error, LockRequest>,
    "mutationFn"
  >
): UseMutationResult<string, Error, LockRequest> {
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const currAcct = useCurrentAccount();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ batchId, months }: LockRequest) => {
      if (!currAcct) {
        throw new Error("No account selected");
      }

      const tx = new Transaction();
      tx.setSender(currAcct.address);

      const batch = tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::lock`,
        arguments: [
          tx.object(batchId),
          tx.object(SUINS_PACKAGES[NETWORK].stakingConfigId),
          tx.pure.u64(months),
        ],
      });

      // TODO remove / enable only on dev
      const dryRunResult = await suiClient.devInspectTransactionBlock({
        sender: currAcct.address,
        transactionBlock: tx,
      });
      if (dryRunResult.effects?.status.status !== "success") {
        throw new Error("Transaction failed: " + JSON.stringify(dryRunResult, null, 2));
      }

      const resp = await signAndExecuteTransaction({
        transaction: tx,
      });

      await suiClient.waitForTransaction({
        digest: resp.digest,
        pollInterval: 200,
      });

      return resp.digest;
    },

    onSuccess: async () => {
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["owned-staking-batches"],
        }),
      ]);
    },
    ...mutationOptions,
  });
}
