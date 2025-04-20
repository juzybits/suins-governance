import { useQuery } from "@tanstack/react-query";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { useSuiClient } from "@mysten/dapp-kit";
import { statsSchema } from "@/schemas/statsSchema";

export function useGetStats() {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["staking-stats"],
    queryFn: async () => {
      const suiObjResp = await suiClient.getObject({
        id: SUINS_PACKAGES[NETWORK].statsId,
        options: {
          showContent: true,
        },
      });

      if (suiObjResp.error) {
        return null;
      }

      return suiObjResp.data;
    },
    select: (data) => (data ? statsSchema.parse(data) : null),
  });
}
