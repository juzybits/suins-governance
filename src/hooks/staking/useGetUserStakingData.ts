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
import { IS_DEV } from "@/constants/common";

export type UserStakingData = {
  batches: Batch[];
  stats: UserStats;
};

export type UserStats = {
  lockedNS: bigint;
  lockedPower: bigint;
  stakedNS: bigint;
  stakedPower: bigint;
  cooldownNS: bigint;
  totalPower: bigint;
};

export function useGetUserStakingData(owner: string | undefined) {
  const suiClient = useSuiClient();

  return useQuery<UserStakingData>({
    queryKey: ["owned-batches", owner],
    queryFn: async () => {
      if (!owner) {
        return {
          batches: [],
          stats: {
            lockedNS: 0n,
            lockedPower: 0n,
            stakedNS: 0n,
            stakedPower: 0n,
            cooldownNS: 0n,
            totalPower: 0n,
          },
        };
      }

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

      // sort batches by voting power (highest first)
      batches.sort((a, b) => Number(b.votingPower - a.votingPower));

      // calculate user stats
      let lockedNS = 0n;
      let lockedPower = 0n;
      let stakedNS = 0n;
      let stakedPower = 0n;
      let cooldownNS = 0n;
      batches.forEach((batch) => {
        if (batch.isLocked) {
          lockedNS += batch.balanceNS;
          lockedPower += batch.votingPower;
        } else if (batch.isStaked) {
          if (batch.isCooldownRequested) {
            cooldownNS += batch.balanceNS;
          } else {
            stakedNS += batch.balanceNS;
            stakedPower += batch.votingPower;
          }
        }
      });

      return {
        batches,
        stats: {
          lockedNS,
          lockedPower,
          stakedNS,
          stakedPower,
          cooldownNS,
          totalPower: lockedPower + stakedPower,
        },
      };
    },
    refetchInterval: IS_DEV ? 10000 : false,
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
