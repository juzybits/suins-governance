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
import { devInspectOnDev } from "@/utils/devInspectOnDev";

type UnstakeRequest = {
  batchId: string;
};

/**
 * Withdraw balance and destroy batch after cooldown period has ended.
 */
export function useUnstakeMutation(
  mutationOptions?: Omit<
    UseMutationOptions<string, Error, UnstakeRequest>,
    "mutationFn"
  >
): UseMutationResult<string, Error, UnstakeRequest> {
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const currAcct = useCurrentAccount();
  const suiClient = useSuiClient();
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
          tx.object.clock(),
        ],
      });

      const coin = tx.moveCall({
        target: "0x2::coin::from_balance",
        typeArguments: [ SUINS_PACKAGES[NETWORK].votingTokenType ],
        arguments: [
          balance,
        ],
      });

      tx.moveCall({
        target: "0x2::transfer::public_transfer",
        typeArguments: [ `0x2::coin::Coin<${SUINS_PACKAGES[NETWORK].votingTokenType}>` ],
        arguments: [
          coin,
          tx.pure.address(currAcct.address),
        ],
      });

      await devInspectOnDev(suiClient, currAcct.address, tx);

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
        queryClient.invalidateQueries({
          queryKey: [NETWORK, "getBalance"],
        }),
      ]);
    },
    ...mutationOptions,
  });
}
