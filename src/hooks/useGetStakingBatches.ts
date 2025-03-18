import { client } from "@/app/SuinsClient";
import { useQuery } from "@tanstack/react-query";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";

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
      return suiObjResponses;
    },
  });
}
