import { type FC } from "react";
import { type CardProps } from "./card.types";
import Typography from "../typography";
import clsx from "clsx";

const Card: FC<CardProps> = ({ value, subValue, icon, title, withBorder }) => (
  <div
    className={clsx(
      "flex flex-col gap-m pl-xl text-secondary",
      withBorder && "border-l border-[#6E609F80]",
    )}
  >
    {icon}
    <div className="flex flex-col gap-xs">
      <Typography variant="label/Regular Bold">{title}</Typography>
      <Typography variant="display/Small" className="text-tertiary">
        {value}
      </Typography>
    </div>
    {subValue && (
      <Typography variant="label/Regular Bold" className="text-tertiary">
        {subValue}
      </Typography>
    )}
  </div>
);

export default Card;
