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

// TODO: support pagination
export function useGetBatches(owner: string | undefined) {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["owned-batches", owner],
    queryFn: async () => {
      if (!owner) return [];

      const [networkTime, paginatedObjResp] = await Promise.all([
        getNetworkTime(suiClient),
        client.getOwnedObjects({
          owner,
          filter: {
            StructType: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::StakingBatch`,
          },
          options: {
            showContent: true,
            showType: true,
          },
        }),
      ]);

      const batches: Batch[] = [];
      for (const resp of paginatedObjResp.data) {
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
