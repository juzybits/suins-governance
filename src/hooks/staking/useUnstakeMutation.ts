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
import { useCurrentAccount } from "@mysten/dapp-kit";

export type UnstakeRequest = {
  batchId: string;
};

/**
 * Withdraw balance and destroy batch after cooldown period has ended.
 */
export function useUnstakeMutation(
  mutationOptions?: Omit<
    UseMutationOptions<string, Error, UnstakeRequest>,
    "mutationFn" | "onSuccess"
  >,
): UseMutationResult<string, Error, UnstakeRequest> {
  const signExecuteAndWaitTx = useSignExecuteAndWaitTx();
  const currAcct = useCurrentAccount();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ batchId }: UnstakeRequest) => {
      if (!currAcct) {
        throw new Error("Wallet not connected");
      }

      const tx = new Transaction();
      tx.setSender(currAcct.address);

      const balance = tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::unstake`,
        arguments: [
          tx.object(batchId),
          tx.object(SUINS_PACKAGES[NETWORK].stakingStatsId),
          tx.object.clock(),
        ],
      });

      const coin = tx.moveCall({
        target: "0x2::coin::from_balance",
        typeArguments: [SUINS_PACKAGES[NETWORK].coinType],
        arguments: [balance],
      });

      tx.moveCall({
        target: "0x2::transfer::public_transfer",
        typeArguments: [`0x2::coin::Coin<${SUINS_PACKAGES[NETWORK].coinType}>`],
        arguments: [coin, tx.pure.address(currAcct.address)],
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
