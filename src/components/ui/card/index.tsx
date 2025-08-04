import { type FC } from "react";
import { type CardProps } from "./card.types";
import Typography from "../typography";
import clsx from "clsx";
import Link from "next/link";

const Card: FC<CardProps> = ({
  icon,
  title,
  value,
  active,
  subValue,
  withBorder,
  valueSuffix,
  valueGradient,
  earnMoreVotes,
  subValueSuffix,
  subValueGradient,
  forceCompact,
}) => (
  <div
    className={clsx(
      "flex items-start gap-2xl py-l text-secondary",
      !forceCompact && "md:flex-col md:items-center md:gap-xl md:p-xl md:text-center lg:items-start",
      withBorder && "border-b border-[#6E609F80]",
      withBorder && !forceCompact && "md:border-b-0 md:border-r",
    )}
  >
    {icon}
    <div className={clsx("flex flex-col gap-xs", !forceCompact && "md:items-center lg:items-start")}>
      <div className={clsx("flex flex-col gap-m", !forceCompact && "lg:items-start")}>
        <Typography variant="label/Regular Bold">{title}</Typography>
        <div className="whitespace-nowrap">
          <Typography
            variant="display/Small"
            className={clsx(
              "whitespace-nowrap",
              active ? "text-primary-main" : "text-tertiary",
              active &&
                valueGradient &&
                "bg-button_green_orange_pink bg-clip-text text-transparent",
            )}
          >
            {value}
          </Typography>{" "}
          {active && (
            <Typography
              variant="display/Small"
              className={clsx(
                "text-primary-main",
                valueGradient &&
                  "bg-button_green_orange_pink bg-clip-text text-transparent",
              )}
            >
              {valueSuffix}
            </Typography>
          )}
        </div>
      </div>
      {earnMoreVotes ? (
        <Link href="/stake">
          <Typography variant="label/Regular Bold" className="text-link">
            Earn More Votes
          </Typography>
        </Link>
      ) : (
        subValue && (
          <div>
            <Typography
              variant="label/Regular Bold"
              className={clsx(
                active ? "text-primary-main" : "text-tertiary",
                active &&
                  subValueGradient &&
                  "bg-button_green_orange_pink bg-clip-text text-transparent",
              )}
            >
              {subValue}
            </Typography>{" "}
            <Typography
              variant="label/Regular Bold"
              className={clsx(
                active ? "text-primary-main" : "text-tertiary",
                valueGradient &&
                  "bg-button_green_orange_pink bg-clip-text text-transparent",
              )}
            >
              {subValueSuffix}
            </Typography>
          </div>
        )
      )}
    </div>
  </div>
);

export default Card;
