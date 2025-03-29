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
import { executeAndWaitTx } from "@/utils/executeAndWaitTx";

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
  const { mutateAsync: signAndExecuteTx } = useSignAndExecuteTransaction();
  const currAcct = useCurrentAccount();
  const suiClient = useSuiClient();
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
      ]);
    },
    ...mutationOptions,
  });
}
