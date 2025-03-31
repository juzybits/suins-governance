import { useQuery } from "@tanstack/react-query";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { batchSchema } from "@/schemas/batchSchema";
import { enrichRawBatch } from "@/types/Batch";
import { type Batch } from "@/types/Batch";
import { useSuiClient } from "@mysten/dapp-kit";
import { client } from "@/app/SuinsClient";
import { getNetworkTime } from "@/utils/getNetworkTime";

export function useGetBatches(owner: string | undefined) {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["owned-batches", owner],
    queryFn: async () => {
      if (!owner) return { objects: [], networkTime: 0 };

      const [networkTime, paginatedObjects] = await Promise.all([
        getNetworkTime(suiClient),
        client.getOwnedObjects({
          owner,
          filter: {
            StructType: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::Batch`,
          },
          options: {
            showContent: true,
            showType: true,
          },
        }),
      ]);

      return {
        objects: paginatedObjects.data,
        networkTime
      };
    },
    select: (data) => {
      const batches: Batch[] = [];
      const { objects, networkTime } = data;

      for (const response of objects) {
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

          const enrichedBatch = enrichRawBatch(parsedBatch.data, networkTime);
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
