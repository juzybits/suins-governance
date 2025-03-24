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

type UnstakeRequest = {
  batchId: string;
};

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
        throw new Error("No account selected");
      }

      const tx = new Transaction();
      tx.setSender(currAcct.address);

      // Call the request_unstake function from the batch module
      tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::request_unstake`,
        arguments: [
          tx.object(batchId),
          tx.object(SUINS_PACKAGES[NETWORK].stakingConfigId),
          tx.object.clock(),
        ],
      });

      // TODO remove / enable only on dev
      const dryRunResult = await suiClient.devInspectTransactionBlock({
        sender: currAcct.address,
        transactionBlock: tx,
      });
      if (dryRunResult.effects?.status.status !== "success") {
        throw new Error("Transaction failed: " + JSON.stringify(dryRunResult, null, 2));
      }

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
        queryClient.invalidateQueries(),
        queryClient.invalidateQueries({
          queryKey: ["owned-staking-batches"],
        }),
      ]);
    },
    ...mutationOptions,
  });
}
