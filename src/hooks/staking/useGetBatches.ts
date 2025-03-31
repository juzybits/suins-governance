import { useQuery } from "@tanstack/react-query";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { batchSchema } from "@/schemas/batchSchema";
import { type BatchObjResp, enrichBatchObjResp } from "@/types/Batch";
import { type Batch } from "@/types/Batch";
import { useSuiClient } from "@mysten/dapp-kit";
import { client } from "@/app/SuinsClient";
import { getNetworkTime } from "@/utils/getNetworkTime";
import { type SuiClient, type SuiObjectResponse } from "@mysten/sui/client";

export function useGetBatches(owner: string | undefined) {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["owned-batches", owner],
    queryFn: async () => {
      if (!owner) return [];

      const [networkTime, paginatedObjResp] = await Promise.all([
        getNetworkTime(suiClient), // probably overkill
        client.getOwnedObjects({
          // TODO: pagination
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

      const batchObjs: BatchObjResp[] = [];
      for (const resp of paginatedObjResp.data) {
        const batchObj = parseBatchObjResp(resp);
        if (batchObj) {
          batchObjs.push(batchObj);
        }
      }

      const rewardsPerBatch = await Promise.all(
        batchObjs.map((batchObj) => {
          return getBatchRewards(suiClient, batchObj.objectId);
        }),
      );

      const batches: Batch[] = [];
      for (let i = 0; i < batchObjs.length; i++) {
        const batchObj = batchObjs[i]!;
        const rewards = rewardsPerBatch[i]!; // TODO pass this to enrichBatchObjResp
        try {
          const enrichedBatch = enrichBatchObjResp(batchObj, networkTime);
          batches.push(enrichedBatch);
        } catch (error) {
          console.warn("[useGetBatches] Error processing batch:", error);
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

/**
 * Doesn't support pagination, but for pagination to be needed, a batch would
 * have to have 50+ unclaimed rewards from voting on 50+ proposals, and there
 * have only been 3 proposals in the past few months.
 */
async function getBatchRewards(suiClient: SuiClient, batchId: string) {
  const paginatedObjResp = await suiClient.getOwnedObjects({
    owner: batchId,
    filter: {
      StructType: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::Reward`,
    },
    options: {
      showContent: true,
    },
  });
  return paginatedObjResp.data.map((obj) => obj.data!.objectId);
}
