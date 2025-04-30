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
      if (!owner) {
        return {
          raw: 0n,
          formatted: "0",
        };
      }

      const balance = await suiClient.getBalance({
        owner: owner,
        coinType: SUINS_PACKAGES[NETWORK].coinType,
      });
      return {
        raw: BigInt(balance.totalBalance),
        formatted: formatBalance({
          balance: balance.totalBalance,
          decimals: NS_DECIMALS,
          format: CoinFormat.FULL,
        }),
      };
    },
    refetchInterval: 10_000,
    staleTime: 10_000,
  });
}
