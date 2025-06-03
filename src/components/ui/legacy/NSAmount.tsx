import { Text, type TextProps } from "@/components/ui/legacy/Text";
import NSToken from "@/icons/legacy/NSToken";
import { formatNSBalance } from "@/utils/coins";
import clsx from "clsx";

export function NSAmount({
  amount,
  isMedium,
  centerAlign,
  className,
  noTokenIcon,
  size,
}: {
  amount: number;
  isMedium?: boolean;
  size?: Extract<TextProps["variant"], "B4/bold" | "P3/medium" | "P3/bold">;
  centerAlign?: boolean;
  className?: string;
  noTokenIcon?: boolean;
}) {
  const amountFormatted = formatNSBalance(amount);

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
