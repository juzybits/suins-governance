import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import {
  useMutation,
  type UseMutationResult,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

import { NETWORK } from "@/constants/env";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { parseNSAmount } from "@/utils/parseAmount";
import { useExecuteAndWaitTx } from "@/hooks/useExecuteAndWaitTx";

export type StakeRequest = {
  amount: string;
  months: number;
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
  const executeAndWaitTx = useExecuteAndWaitTx();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, months }: StakeRequest) => {
      const tx = new Transaction();

      const coin = coinWithBalance({
        balance: parseNSAmount(amount),
        type: SUINS_PACKAGES[NETWORK].votingTokenType,
      })(tx);

      const batch = tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::new`,
        arguments: [
          tx.object(SUINS_PACKAGES[NETWORK].stakingConfigId),
          coin,
          tx.pure.u64(months),
          tx.object.clock(),
        ],
      });

      tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::keep`,
        arguments: [batch],
      });

      const resp = await executeAndWaitTx(tx);

      return resp.digest;
    },

    onSuccess: async () => {
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["owned-batches"],
        }),
        queryClient.invalidateQueries({
          queryKey: [NETWORK, "getBalance"],
        }),
      ]);
    },
    ...mutationOptions,
  });
}
