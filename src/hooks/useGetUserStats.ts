import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";
import { devInspectAndGetReturnValues } from "@polymedia/suitcase-core";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

export type UserStats = {
  totalReward: string;
  proposalStats: UserProposalStats[];
};

export type UserProposalStats = {
  proposalId: string;
  power: string;
  reward: string;
};

/**
 * Get a user's lifetime rewards and their participation in multiple proposals,
 * with a single RPC call.
 */
export function useGetUserStats({
  user,
  proposalIds,
}: {
  user: string | undefined;
  proposalIds: string[] | undefined;
}) {
  const suiClient = useSuiClient();
  return useQuery({
    queryKey: ["user-stats", user, proposalIds],
    queryFn: async () => {
      if (!user || !proposalIds) {
        throw new Error("User or proposal IDs are required");
      }

      const tx = new Transaction();

      tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::stats::user_rewards`,
        arguments: [
          tx.object(SUINS_PACKAGES[NETWORK].statsObjId),
          tx.pure.address(user),
        ],
      });

      for (const proposalId of proposalIds) {
        tx.moveCall({
          target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::stats::user_proposal_stats`,
          arguments: [
            tx.object(SUINS_PACKAGES[NETWORK].statsObjId),
            tx.pure.address(user),
            tx.pure.address(proposalId),
          ],
        });
      }

      const retVals = await devInspectAndGetReturnValues(suiClient, tx, [
        [bcs.u64()], // [total_reward]
        ...proposalIds.map(
          () => [bcs.u64(), bcs.u64()], // [power, reward]
        ),
      ]);

      const totalReward = retVals.shift()![0] as string;
      const proposalStats: UserProposalStats[] = proposalIds.map(
        (proposalId, idx) => ({
          proposalId,
          power: retVals[idx]![0] as string,
          reward: retVals[idx]![1] as string,
        }),
      );

      const userStats: UserStats = {
        totalReward,
        proposalStats,
      };

      return userStats;
    },
    enabled: !!user && !!proposalIds,
  });
}
