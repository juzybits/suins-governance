import clsx from "clsx";
import { type FocusEvent, forwardRef, type HTMLAttributes } from "react";

import { GradientBorder } from "@/components/gradient-border";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { Text } from "@/components/ui/Text";

type SearchProps = HTMLAttributes<HTMLInputElement> & {
  clearable?: boolean;
  onClear?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export const MaxTokenInput = forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      onBlur,
      onFocus,
      // clearable,
      //onClear,
      disabled,
      // loading,
      ...props
    }: SearchProps,
    ref,
  ) => {
    const isSmallOrAbove = useBreakpoint("sm");

    return (
      <div className="relative h-[72px] w-full sm:h-[92px]">
        <GradientBorder
          animateOnHover
          animationSpeed={1}
          variant="green_blue_pink"
          className="relative h-full w-full rounded-2024_20 border-[3px] bg-amber-50 text-2024_body1 text-white transition-all placeholder:text-2024_fillContent-primary-inactive focus:pl-16 focus:outline-none focus:placeholder:text-transparent"
        >
          <input
            {...props}
            ref={ref}
            disabled={disabled}
            autoComplete="off"
            type="text"
            onBlur={(e: FocusEvent<HTMLInputElement>) => {
              onBlur?.(e);
            }}
            onFocus={(e: FocusEvent<HTMLInputElement>) => {
              onFocus?.(e);
            }}
            placeholder={
              disabled
                ? isSmallOrAbove
                  ? "Search for your Sui name"
                  : "Search"
                : undefined
            }
            className={clsx(
              "h-full w-full rounded-2024_20 bg-2024_fillContent-primary-darker pr-28 text-2024_body3 text-white caret-2024_pink transition-all placeholder:text-2024_fillContent-primary-inactive focus:outline-none focus:placeholder:text-transparent sm:pr-36 sm:text-2024_body1",
              disabled ? "pl-10" : "pl-16",
            )}
          />

          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <button
              type="submit"
              className="relative flex h-[56px] w-[56px] cursor-pointer items-center justify-center rounded-full bg-2024_fillBackground-good transition-all hover:shadow-2024_searchButton sm:h-[76px] sm:w-[76px]"
            >
              <Text
                variant="B7/medium"
                color="fillContent-secondary"
                className="m-w- text-start"
              >
                Max
              </Text>
            </button>
          </div>
        </GradientBorder>
      </div>
    );
  },
);

MaxTokenInput.displayName = "MaxTokenInput";
