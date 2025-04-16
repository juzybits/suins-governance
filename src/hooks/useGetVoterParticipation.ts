import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";
import { devInspectAndGetReturnValues } from "@polymedia/suitcase-core";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

export type UserProposalStats = {
  proposalId: string;
  power: bigint;
  reward: bigint;
}

/**
 * Get a user's lifetime rewards and their participation in multiple proposals,
 * with a single RPC call.
 */
export function useGetVoterParticipation({
  user,
  proposalIds,
}: {
  user: string | undefined;
  proposalIds: string[] | undefined;
}) {
  const suiClient = useSuiClient();
  return useQuery({
    queryKey: ["user-participation", user, proposalIds],
    queryFn: async () => {
      if (!user || !proposalIds) {
        throw new Error("User or proposal IDs are required");
      }

      const tx = new Transaction();

      tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_stats::user_total_reward`,
        arguments: [
          tx.object(SUINS_PACKAGES[NETWORK].stakingStatsId),
          tx.pure.address(user),
        ],
      });

      for (const proposalId of proposalIds) {
        tx.moveCall({
          target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_stats::user_proposal_stats`,
          arguments: [
            tx.object(SUINS_PACKAGES[NETWORK].stakingStatsId),
            tx.pure.address(user),
            tx.pure.address(proposalId),
          ],
        });
      }

      const retVals = await devInspectAndGetReturnValues(suiClient, tx, [
        [ bcs.u64() ], // [total_reward] (1st moveCall)
        ...proposalIds.map(() => // (one moveCall per proposal)
          [ bcs.u64(), bcs.u64() ] // [power, reward]
        ),
      ]);

      const totalReward = BigInt(retVals.shift()![0]!);
      const proposalStats: UserProposalStats[] = proposalIds.map((proposalId, idx) => ({
        proposalId,
        power: BigInt(retVals[idx]![0]!),
        reward: BigInt(retVals[idx]![1]!),
      }));

      return { totalReward, proposalStats };
    },
    enabled: !!user && !!proposalIds,
  });
}
