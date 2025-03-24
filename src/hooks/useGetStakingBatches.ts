import { client } from "@/app/SuinsClient";
import { useQuery } from "@tanstack/react-query";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { stakingBatchSchema, stakingBatchHelpers, type StakingBatch } from "@/schemas/stakingBatchSchema";

export type StakingBatchWithVotingPower = StakingBatch & {
  // Derived data
  votingPower: number;
  amountNS: number;
  lockDurationDays: number;
  isLocked: boolean;
  isStaked: boolean;
  isInCooldown: boolean;
  isVoting: boolean;
  // Human-readable dates
  startDate: Date;
  unlockDate: Date;
  cooldownEndDate: Date | null;
}

export function useGetStakingBatches(
  owner: string | undefined,
) {
  return useQuery({
    queryKey: ["owned-staking-batches", owner],
    queryFn: async () => {
      if (!owner) return [];
      const paginatedObjects = await client.getOwnedObjects({
        owner,
        filter: {
          StructType: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::StakingBatch`
        },
        options: {
          showContent: true,
          showType: true,
        }
      });
      return paginatedObjects.data;
    },
    select: (suiObjResponses) => {
      const parsedBatches: StakingBatchWithVotingPower[] = [];

      for (const response of suiObjResponses) {
        try {
          if (!response.data || !response.data.content) {
            console.warn("Invalid staking batch data:", response);
            continue;
          }

          const batchData = {
            objectId: response.data.objectId,
            version: response.data.version,
            digest: response.data.digest,
            type: response.data.type,
            content: response.data.content
          };

          const result = stakingBatchSchema.safeParse(batchData);

          if (!result.success) {
            console.warn("Failed to parse staking batch:", result.error);
            continue;
          }

          const batch = result.data;

          // Calculate derived data
          const amountNS = stakingBatchHelpers.getAmountInNS(batch);
          const votingPower = stakingBatchHelpers.calculateVotingPower(batch);
          const lockDurationDays = stakingBatchHelpers.getLockDurationDays(batch);
          const isLocked = stakingBatchHelpers.isLocked(batch);
          const isStaked = !isLocked;
          const isInCooldown = stakingBatchHelpers.isInCooldown(batch);
          const isVoting = stakingBatchHelpers.isVoting(batch);

          // Convert timestamps to Date objects
          const startDate = new Date(Number(batch.content.fields.start_ms));
          const unlockDate = new Date(Number(batch.content.fields.unlock_ms));
          const cooldownEndMs = Number(batch.content.fields.cooldown_end_ms);
          const cooldownEndDate = cooldownEndMs > 0 ? new Date(cooldownEndMs) : null;

          parsedBatches.push({
            ...batch,
            votingPower,
            amountNS,
            lockDurationDays,
            isLocked,
            isStaked,
            isInCooldown,
            isVoting,
            startDate,
            unlockDate,
            cooldownEndDate,
          });
        } catch (error) {
          console.error("Error processing staking batch:", error);
        }
      }

      // Sort batches by voting power (highest first)
      return parsedBatches.sort((a, b) => b.votingPower - a.votingPower);
    },
    enabled: !!owner,
    refetchInterval: 15000, // Refresh every 15 seconds
  });
}
