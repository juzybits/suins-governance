import { useQuery } from "@tanstack/react-query";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { batchSchema } from "@/schemas/batchSchema";
import { type BatchObjResp, enrichBatchObjResp } from "@/types/Batch";
import { type Batch } from "@/types/Batch";
import { useSuiClient } from "@mysten/dapp-kit";
import { client } from "@/app/SuinsClient";
import { getNetworkTime } from "@/utils/getNetworkTime";
import { type SuiObjectResponse } from "@mysten/sui/client";

export function useGetOwnedBatches(owner: string | undefined) {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["get-owned-batches", owner],
    queryFn: async () => {
      if (!owner) return [];

      const getAllOwnedBatches = async () => {
        const ownedBatches: SuiObjectResponse[] = [];
        let hasNextPage = true;
        let cursor: string | null | undefined = null;

        while (hasNextPage) {
          const response = await client.getOwnedObjects({
            owner,
            filter: {
              StructType: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::StakingBatch`,
            },
            options: {
              showContent: true,
              showType: true,
            },
            cursor,
          });

          ownedBatches.push(...response.data);
          hasNextPage = response.hasNextPage;
          cursor = response.nextCursor;
        }

        return ownedBatches;
      };

      const [networkTime, ownedBatches] = await Promise.all([
        getNetworkTime(suiClient),
        getAllOwnedBatches(),
      ]);

      const batches: Batch[] = [];
      for (const resp of ownedBatches) {
        const batchObj = parseBatchObjResp(resp);
        if (batchObj) {
          batches.push(enrichBatchObjResp(batchObj, networkTime));
        }
      }

      return batches;
    },
    select: (batches) => {
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
    refetchInterval: 30_000,
  });
}

function parseBatchObjResp(resp: SuiObjectResponse): BatchObjResp | null {
  try {
    if (!resp.data?.content) {
      console.warn("[parseBatchObjResp] Response has no content:", resp);
      return null;
    }
    const parsedBatch = batchSchema.safeParse(resp.data);
    if (!parsedBatch.success) {
      console.warn(
        "[parseBatchObjResp] Failed to parse batch from schema:",
        parsedBatch.error,
      );
      return null;
    }
    return parsedBatch.data;
  } catch (error) {
    console.warn(
      "[parseBatchObjResp] Unexpected error while parsing batch:",
      error,
    );
    return null;
  }
}
