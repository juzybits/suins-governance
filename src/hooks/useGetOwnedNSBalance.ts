import { useQuery } from "@tanstack/react-query";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { useSuiClient } from "@mysten/dapp-kit";

import { CoinFormat, formatBalance } from "@/utils/coins";

import { NS_DECIMALS } from "@/constants/common";

export function useGetOwnedNSBalance(owner: string | undefined) {
  const suiClient = useSuiClient();
  return useQuery({
    queryKey: ["owned-ns-balance", owner],
    queryFn: async () => {
      const balance = suiClient.getBalance({
        owner: owner!,
        coinType: SUINS_PACKAGES[NETWORK].coinType,
      });
      return balance;
    },
    select: (data) => {
      const formatted = formatBalance({
        balance: data.totalBalance,
        decimals: NS_DECIMALS,
        format: CoinFormat.FULL,
      });
      return {
        ...data,
        formatted,
      };
    },
    refetchInterval: 10_000,
    staleTime: 10_000,
    enabled: !!owner,
  });
}
