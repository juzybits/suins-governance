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

type LockRequest = {
  batchId: string;
  months: number;
};

/**
 * Lock a staked batch, or extend the lock duration of a locked batch.
 */
export function useLockMutation(
  mutationOptions?: Omit<
    UseMutationOptions<string, Error, LockRequest>,
    "mutationFn"
  >,
): UseMutationResult<string, Error, LockRequest> {
  const { mutateAsync: signAndExecuteTx } = useSignAndExecuteTransaction();
  const currAcct = useCurrentAccount();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ batchId, months }: LockRequest) => {
      const tx = new Transaction();

      tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::lock`,
        arguments: [
          tx.object(batchId),
          tx.object(SUINS_PACKAGES[NETWORK].stakingConfigId),
          tx.pure.u64(months),
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
