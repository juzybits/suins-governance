import { Transaction } from "@mysten/sui/transactions";
import {
  useMutation,
  type UseMutationResult,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

import { NETWORK } from "@/constants/env";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { useExecuteAndWaitTx } from "@/hooks/useExecuteAndWaitTx";

export type LockRequest = {
  batchId: string;
  months: number;
};

/**
 * Lock a staked batch, or extend the lock duration of a locked batch.
 */
export function useLockMutation(
  mutationOptions?: Omit<
    UseMutationOptions<string, Error, LockRequest>,
    "mutationFn" | "onSuccess"
  >,
): UseMutationResult<string, Error, LockRequest> {
  const executeAndWaitTx = useExecuteAndWaitTx();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ batchId, months }: LockRequest) => {
      const tx = new Transaction();

      tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::lock`,
        arguments: [
          tx.object(batchId),
          tx.object(SUINS_PACKAGES[NETWORK].stakingSystemId),
          tx.pure.u64(months),
          tx.object.clock(),
        ],
      });

      const resp = await executeAndWaitTx(tx);

      return resp.digest;
    },

    onSuccess: async () => {
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["owned-batches"],
        }),
      ]);
    },
    ...mutationOptions,
  });
}
