import { Text, type TextProps } from "@/components/ui/legacy/Text";
import NSToken from "@/icons/legacy/NSToken";
import { CoinFormat, formatBalance } from "@/utils/coins";
import { NS_DECIMALS } from "@/constants/common";
import clsx from "clsx";

export function NSAmount({
  amount,
  isMedium,
  roundedCoinFormat,
  noFormat,
  centerAlign,
  className,
  noTokenIcon,
  size,
}: {
  amount: number;
  isMedium?: boolean;
  size?: Extract<TextProps["variant"], "B4/bold" | "P3/medium" | "P3/bold">;
  roundedCoinFormat?: boolean;
  noFormat?: boolean;
  centerAlign?: boolean;
  className?: string;
  noTokenIcon?: boolean;
}) {
  const amountFormatted = formatBalance({
    balance: amount,
    decimals: noFormat ? 0 : NS_DECIMALS,
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
        variant={size ?? (isMedium ? "B4/bold" : "P3/medium")}
        color="fillContent-secondary"
        className="w-fit"
      >
        {amountFormatted}
      </Text>
      {!noTokenIcon && (
        <NSToken className={isMedium ? "h-4 w-4" : "h-3 w-3"} color="white" />
      )}
    </div>
  );
}
