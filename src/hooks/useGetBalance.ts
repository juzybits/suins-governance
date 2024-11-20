import { useSuiClientQuery } from "@mysten/dapp-kit";

import { CoinFormat, formatBalance } from "@/utils/coins";

import { useCoinMetadata } from "@/hooks/useCoinMetadata";

export function useGetBalance({
  coinType,
  owner,
}: {
  coinType?: string;
  owner?: string;
}) {
  const { data: coinMetadata } = useCoinMetadata({ coinType });

  return useSuiClientQuery(
    "getBalance",
    {
      coinType,
      owner: owner!,
    },
    {
      select: (data) => {
        const formatted = formatBalance({
          balance: data.totalBalance,
          decimals: coinMetadata?.decimals ?? 0,
          format: CoinFormat.FULL,
        });
        return {
          ...data,
          formatted,
        };
      },
      refetchInterval: 5000,
      staleTime: 5_000,
      enabled: !!owner && !!coinType,
    },
  );
}
