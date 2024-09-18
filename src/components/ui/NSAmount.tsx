import { Text } from "@/components/ui/Text";
import NSToken from "@/icons/NSToken";
import { useCoinMetadata } from "@/hooks/useCoinMetadata";
import { CoinFormat, formatBalance } from "@/utils/coins";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { NS_COINTYPE_DECIMAL_PLACES } from "@/constants/common";

export function NSAmount({
  amount,
  isMedium,
  roundedCoinFormat,
}: {
  amount: number;
  isMedium?: boolean;
  roundedCoinFormat?: boolean;
}) {
  const { data: coinMetadata } = useCoinMetadata({
    coinType: SUINS_PACKAGES[NETWORK].coinType,
  });

  const amountFormatted = formatBalance({
    balance: amount,
    decimals: coinMetadata?.decimals ?? NS_COINTYPE_DECIMAL_PLACES,
    format: roundedCoinFormat ? CoinFormat.ROUNDED : CoinFormat.FULL,
  });

  return (
    <div className="flex basis-1/5 items-center justify-end gap-1">
      <Text
        variant={isMedium ? "B4/bold" : "P3/medium"}
        color="fillContent-secondary"
      >
        {amountFormatted}
      </Text>
      <NSToken className={isMedium ? "h-4 w-4" : "h-3 w-3"} color="white" />
    </div>
  );
}
