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

export type VoteV2Request = {
  proposalId: string;
  batchIds: string[];
  vote: "Yes" | "No" | "Abstain";
};

export function useVoteV2Mutation(
  mutationOptions?: Omit<
    UseMutationOptions<string, Error, VoteV2Request>,
    "mutationFn" | "onSuccess"
  >,
): UseMutationResult<string, Error, VoteV2Request> {
  const { mutateAsync: signAndExecuteTx } = useSignAndExecuteTransaction();
  const currAcct = useCurrentAccount();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ proposalId, batchIds, vote }: VoteV2Request) => {
      const tx = new Transaction();

      for (const batchId of batchIds) {
        tx.moveCall({
          target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::proposal_v2::vote`,
          arguments: [
            tx.object(proposalId),
            tx.pure.string(vote),
            tx.object(batchId),
            tx.object(SUINS_PACKAGES[NETWORK].stakingConfigId),
            tx.object.clock(),
          ],
        });
      }

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
        queryClient.invalidateQueries(),
        queryClient.invalidateQueries({
          queryKey: ["get-vote-casted"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["proposal-detail-by-id"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["get-all-voter"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["vote-casted-by-id"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["owned-staking-batches"],
        }),
      ]);
    },
    ...mutationOptions,
  });
}
