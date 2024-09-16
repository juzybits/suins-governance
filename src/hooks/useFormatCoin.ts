import { type CoinMetadata } from "@mysten/sui/client";
import { type UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";

import { useCoinMetadata } from "@/hooks/useCoinMetadata";
import { CoinFormat, formatBalance } from "@/utils/coins";

export { CoinFormat };

type FormattedCoin = [
  formattedBalance: string,
  coinSymbol: string,
  queryResult: UseQueryResult<CoinMetadata | null>,
];

export function useFormatCoin(
  balance?: bigint | number | string | null,
  coinType?: string | null,
  format: CoinFormat = CoinFormat.ROUNDED,
): FormattedCoin {
  const queryResult = useCoinMetadata({ coinType });

  const { isFetched, data } = queryResult;
  const fallbackSymbol = useMemo(
    () => (coinType ? (data?.symbol ?? "") : ""),
    [coinType, data?.symbol],
  );

  const formatted = useMemo(() => {
    if (typeof balance === "undefined" || balance === null) return "";

    if (!isFetched) return "...";

    return formatBalance(balance, data?.decimals ?? 0, format);
  }, [data?.decimals, isFetched, balance, format]);

  return [
    formatted,
    isFetched ? (data?.symbol ?? fallbackSymbol) : "",
    queryResult,
  ];
}
