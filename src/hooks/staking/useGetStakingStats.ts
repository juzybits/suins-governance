import { useQuery } from "@tanstack/react-query";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { useSuiClient } from "@mysten/dapp-kit";
import { stakingStatsSchema } from "@/schemas/stakingStatsSchema";

export function useGetStakingStats() {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["get-staking-stats"],
    queryFn: async () => {
      const suiObjResp = await suiClient.getObject({
        id: SUINS_PACKAGES[NETWORK].stakingStatsId,
        options: {
          showContent: true,
        },
      });

      if (suiObjResp.error) {
        return null;
      }

      return suiObjResp.data;
    },
    select: (data) => (data ? stakingStatsSchema.parse(data) : null),
  });
}
