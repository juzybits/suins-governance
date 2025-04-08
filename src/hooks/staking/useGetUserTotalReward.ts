import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";
import { useGetStakingStats } from "@/hooks/staking/useGetStakingStats";
import { userTotalRewardSchema } from "@/schemas/userTotalRewardSchema";

export function useGetUserTotalReward(owner: string | undefined) {
  const suiClient = useSuiClient();
  const stats = useGetStakingStats();

  return useQuery({
    queryKey: ["get-user-total-reward", owner],
    queryFn: async () => {
      if (!owner || !stats.data) return null;

      const suiObjResp = await suiClient.getDynamicFieldObject({
        parentId: stats.data.content.fields.user_rewards.fields.id.id,
        name: {
          type: "address",
          value: owner,
        },
      });

      if (suiObjResp.error) {
        return null;
      }

      return suiObjResp.data;
    },
    select: (data) => {
      if (!data) return null;
      const parsed = userTotalRewardSchema.parse(data);
      return BigInt(parsed.content.fields.value);
    },
    enabled: !!owner && !!stats.data,
  });
}
