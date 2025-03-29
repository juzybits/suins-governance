import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
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
import { executeAndWaitTx } from "@/utils/executeAndWaitTx";

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
  const { mutateAsync: signAndExecuteTx } = useSignAndExecuteTransaction();
  const currAcct = useCurrentAccount();
  const suiClient = useSuiClient();
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

      const resp = await executeAndWaitTx({
        suiClient,
        tx,
        sender: currAcct?.address,
        signAndExecuteTx,
      });

      return resp.digest;
    },

    onSuccess: async () => {
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["owned-staking-batches"],
        }),
        queryClient.invalidateQueries({
          queryKey: [NETWORK, "getBalance"],
        }),
      ]);
    },
    ...mutationOptions,
  });
}
