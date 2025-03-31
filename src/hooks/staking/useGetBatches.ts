import { client } from "@/app/SuinsClient";
import { useQuery } from "@tanstack/react-query";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { batchSchema } from "@/schemas/batchSchema";
import { enrichRawBatch } from "@/types/Batch";
import { type Batch } from "@/types/Batch";

export function useGetBatches(owner: string | undefined) {
  return useQuery({
    queryKey: ["owned-batches", owner],
    queryFn: async () => {
      if (!owner) return [];
      const paginatedObjects = await client.getOwnedObjects({
        owner,
        filter: {
          StructType: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::Batch`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });
      return paginatedObjects.data;
    },
    select: (suiObjResponses) => {
      const batches: Batch[] = [];

      for (const response of suiObjResponses) {
        try {
          if (!response.data?.content) {
            console.warn(
              "[useGetBatches] Invalid batch data:",
              response,
            );
            continue;
          }

          const parsedBatch = batchSchema.safeParse(response.data);

          if (!parsedBatch.success) {
            console.warn(
              "[useGetBatches] Failed to parse batch:",
              parsedBatch.error,
            );
            continue;
          }

          const enrichedBatch = enrichRawBatch(parsedBatch.data);
          batches.push(enrichedBatch);
        } catch (error) {
          console.warn(
            "[useGetBatches] Error processing batch:",
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
