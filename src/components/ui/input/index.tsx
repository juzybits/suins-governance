import { type FC } from "react";
import { type InputProps } from "./input.types";
import Typography from "../typography";
import InfoSVG from "@/icons/info";

const Input: FC<InputProps> = ({ value, suffix, setValue, info }) => (
  <div className="flex flex-col gap-s">
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
          <span className="whitespace-nowrap opacity-30">{suffix}</span>
        )}
      </label>
    </Typography>
    {info && (
      <div className="flex items-center gap-xs text-tertiary">
        <InfoSVG width="100%" className="max-w-[1rem]" />
        <Typography variant="paragraph/Small">{info}</Typography>
      </div>
    )}
  </div>
);

export default Input;
