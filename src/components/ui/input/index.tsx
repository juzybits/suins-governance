import { type FC } from "react";
import { type InputProps } from "./input.types";
import Typography from "../typography";
import InfoSVG from "@/icons/info";
import clsx from "clsx";

const Input: FC<InputProps> = ({
  info,
  error,
  value,
  suffix,
  setValue,
  suffixTitle,
}) => (
  <div className="flex flex-col gap-s">
    {suffix && (
      <div className="flex justify-between md:hidden">
        <Typography variant="paragraph/XSmall" className="text-tertiary">
          {suffixTitle}
        </Typography>
        <Typography
          variant="paragraph/XSmall"
          className="font-bold text-secondary"
        >
          {suffix}
        </Typography>
      </div>
    )}
    <Typography variant="display/XSmall">
      <label className="flex rounded-l-s rounded-r-s border-2 border-tertiary bg-bg-primary p-s">
        <input
          type="text"
          value={value}
          size={value.length || 1}
          className="bg-transparent outline-none"
          onChange={(e) => setValue(e.target.value)}
        />
        {suffix && (
          <span
            className="hidden whitespace-nowrap opacity-30 md:inline"
            title={suffixTitle}
          >
            /{suffix}
          </span>
        )}
      </label>
    </Typography>
    {info && (
      <div
        className={clsx(
          "flex items-center gap-xs",
          error ? "text-bg-error" : "text-tertiary",
        )}
      >
        <InfoSVG width="100%" className="max-w-[1rem]" />
        <Typography variant="paragraph/Small">{info}</Typography>
      </div>
    )}
  </div>
);

export default Input;
