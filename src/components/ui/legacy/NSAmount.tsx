import NSToken from "@/icons/legacy/NSToken";
import { formatNSBalance } from "@/utils/coins";
import clsx from "clsx";
import Typography from "../typography";

export function NSAmount({
  color,
  amount,
  isSmall,
  isMedium,
  centerAlign,
  className,
  noTokenIcon,
}: {
  color?: string;
  amount: number;
  isSmall?: boolean;
  isMedium?: boolean;
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
      <Typography
        variant={
          isSmall
            ? "label/Small Bold"
            : isMedium
              ? "label/Large Bold"
              : "label/Small Medium"
        }
        className={clsx("w-fit", color ?? "text-secondary")}
      >
        {amountFormatted}
      </Typography>
      {!noTokenIcon && (
        <NSToken className={isMedium ? "h-4 w-4" : "h-3 w-3"} color="white" />
      )}
    </div>
  );
}
