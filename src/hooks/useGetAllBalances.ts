import { useFeatureValue } from "@growthbook/growthbook-react";
import { useSuiClientQuery } from "@mysten/dapp-kit";

export function useGetAllBalances(owner: string) {
  const refetchInterval = useFeatureValue(
    "wallet-balance-refetch-interval",
    20_000,
  );

  return useSuiClientQuery(
    "getAllBalances",
    { owner: owner },
    {
      enabled: !!owner,
      refetchInterval,
      staleTime: 5_000,
    },
  );
}
