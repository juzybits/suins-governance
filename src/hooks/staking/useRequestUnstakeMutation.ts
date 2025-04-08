import { Transaction } from "@mysten/sui/transactions";
import {
  useMutation,
  type UseMutationResult,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

import { NETWORK } from "@/constants/env";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { useSignExecuteAndWaitTx } from "@/hooks/useSignExecuteAndWaitTx";

export type RequestUnstakeRequest = {
  batchId: string;
};

/**
 * Request to unstake a batch, initiating cooldown period.
 */
export function useRequestUnstakeMutation(
  mutationOptions?: Omit<
    UseMutationOptions<string, Error, RequestUnstakeRequest>,
    "mutationFn" | "onSuccess"
  >,
): UseMutationResult<string, Error, RequestUnstakeRequest> {
  const signExecuteAndWaitTx = useSignExecuteAndWaitTx();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ batchId }: RequestUnstakeRequest) => {
      const tx = new Transaction();

      tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::request_unstake`,
        arguments: [
          tx.object(batchId),
          tx.object(SUINS_PACKAGES[NETWORK].stakingConfigId),
          tx.object.clock(),
        ],
      });

      const resp = await signExecuteAndWaitTx(tx);

      return resp.digest;
    },

    onSuccess: async () => {
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["get-owned-batches"],
        }),
      ]);
    },
    ...mutationOptions,
  });
}
