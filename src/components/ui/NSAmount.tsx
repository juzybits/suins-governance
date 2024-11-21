import { Text } from "@/components/ui/Text";
import NSToken from "@/icons/NSToken";
import { useCoinMetadata } from "@/hooks/useCoinMetadata";
import { CoinFormat, formatBalance } from "@/utils/coins";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { NS_COINTYPE_DECIMAL_PLACES } from "@/constants/common";
import clsx from "clsx";

export function NSAmount({
  amount,
  isMedium,
  roundedCoinFormat,
  noFormat,
  centerAlign,
  className,
}: {
  amount: number;
  isMedium?: boolean;
  roundedCoinFormat?: boolean;
  noFormat?: boolean;
  centerAlign?: boolean;
  className?: string;
}) {
  const { data: coinMetadata } = useCoinMetadata({
    coinType: SUINS_PACKAGES[NETWORK].votingTokenType,
  });

  const amountFormatted = formatBalance({
    balance: amount,
    decimals: noFormat
      ? 0
      : (coinMetadata?.decimals ?? NS_COINTYPE_DECIMAL_PLACES),
    format: roundedCoinFormat ? CoinFormat.ROUNDED : CoinFormat.FULL,
  });

  return (
    <div
      className={clsx(
        "flex w-full items-center justify-end gap-1",
        centerAlign && "justify-center",
        className,
      )}
    >
      <Text
        variant={isMedium ? "B4/bold" : "P3/medium"}
        color="fillContent-secondary"
        className="w-fit"
      >
        {amountFormatted}
      </Text>
      <NSToken className={isMedium ? "h-4 w-4" : "h-3 w-3"} color="white" />
    </div>
  );
}
