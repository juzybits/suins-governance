import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import {
  useMutation,
  type UseMutationResult,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

import { NETWORK } from "@/constants/env";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { useSignExecuteAndWaitTx } from "@/hooks/useSignExecuteAndWaitTx";

export type StakeRequest = {
  months: number;
  balance: bigint;
};

/**
 * Stake NS into a new batch, optionally locking it for a number of months
 */
export function useStakeOrLockMutation(
  mutationOptions?: Omit<
    UseMutationOptions<string, Error, StakeRequest>,
    "mutationFn" | "onSuccess"
  >,
): UseMutationResult<string, Error, StakeRequest> {
  const signExecuteAndWaitTx = useSignExecuteAndWaitTx();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ balance, months }: StakeRequest) => {
      const tx = new Transaction();

      const coin = coinWithBalance({
        balance,
        type: SUINS_PACKAGES[NETWORK].coinType,
      })(tx);

      const batch = tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::new`,
        arguments: [
          tx.object(SUINS_PACKAGES[NETWORK].stakingConfigObjId),
          tx.object(SUINS_PACKAGES[NETWORK].statsObjId),
          coin,
          tx.pure.u64(months),
          tx.object.clock(),
        ],
      });

      tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::keep`,
        arguments: [batch],
      });

      const resp = await signExecuteAndWaitTx(tx);

      return resp.digest;
    },

    onSuccess: async () => {
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["owned-batches"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["owned-ns-balance"],
        }),
      ]);
    },
    ...mutationOptions,
  });
}
