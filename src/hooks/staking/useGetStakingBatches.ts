import { client } from "@/app/SuinsClient";
import { useQuery } from "@tanstack/react-query";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { stakingBatchSchema } from "@/schemas/stakingBatchSchema";
import { enrichRawBatch, stakingBatchHelpers } from "@/schemas/StakingBatch";
import { StakingBatch } from "@/schemas/StakingBatch";

export function useGetStakingBatches(owner: string | undefined) {
  return useQuery({
    queryKey: ["owned-staking-batches", owner],
    queryFn: async () => {
      if (!owner) return [];
      const paginatedObjects = await client.getOwnedObjects({
        owner,
        filter: {
          StructType: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::StakingBatch`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });
      return paginatedObjects.data;
    },
    select: (suiObjResponses) => {
      const batches: StakingBatch[] = [];

      for (const response of suiObjResponses) {
        try {
          if (!response.data?.content) {
            console.warn(
              "[useGetStakingBatches] Invalid staking batch data:",
              response,
            );
            continue;
          }

          const parsedBatch = stakingBatchSchema.safeParse(response.data);

          if (!parsedBatch.success) {
            console.warn(
              "[useGetStakingBatches] Failed to parse staking batch:",
              parsedBatch.error,
            );
            continue;
          }

          const enrichedBatch = enrichRawBatch(parsedBatch.data);
          batches.push(enrichedBatch);

        } catch (error) {
          console.warn(
            "[useGetStakingBatches] Error processing staking batch:",
            error,
          );
        }
      }

      // Sort batches by voting power (highest first)
      return batches.sort((a, b) => {
        if (b.votingPower > a.votingPower) {
          return 1;
        }
        if (b.votingPower < a.votingPower) {
          return -1;
        }
        return 0;
      });
    },
    enabled: !!owner,
  });
}
