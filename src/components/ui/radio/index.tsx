import clsx from "clsx";
import { type FC } from "react";
import { type RadioProps } from "./radio.types";

const Radio: FC<RadioProps> = ({ value, toggle }) => (
  <div
    onClick={toggle}
    className={clsx(
      "flex h-l w-l cursor-pointer items-center justify-center rounded-full border-2",
      value ? "border-bg-good" : "border-primary opacity-60",
    )}
  >
    {value && (
      <div className="h-[0.625rem] w-[0.625rem] rounded-full bg-bg-good" />
    )}
  </div>
);

export default Radio;
