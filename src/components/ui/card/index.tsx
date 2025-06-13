import { type FC } from "react";
import { type CardProps } from "./card.types";
import Typography from "../typography";
import clsx from "clsx";

const Card: FC<CardProps> = ({
  icon,
  title,
  value,
  active,
  subValue,
  withBorder,
  valueSuffix,
  valueGradient,
  subValueSuffix,
  subValueGradient,
}) => (
  <div
    className={clsx(
      "flex flex-col items-start gap-m pl-xl text-secondary",
      withBorder && "border-l border-[#6E609F80]",
    )}
  >
    {icon}
    <div className="flex flex-col gap-xs">
      <Typography variant="label/Regular Bold">{title}</Typography>
      <div>
        <Typography
          variant="display/Small"
          className={clsx(
            active ? "text-primary-main" : "text-tertiary",
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
    {subValue && (
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
    )}
  </div>
);

export default Card;
