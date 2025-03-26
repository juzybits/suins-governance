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

type LockRequest = {
  batchId: string;
  months: number;
};

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
      ]);
    },
    ...mutationOptions,
  });
}
