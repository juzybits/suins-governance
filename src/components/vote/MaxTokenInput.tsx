import clsx from "clsx";
import { type FocusEvent, forwardRef, type HTMLAttributes } from "react";

import { GradientBorder } from "@/components/gradient-border";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { Text } from "@/components/ui/legacy/Text";

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
          className="rounded-2024_20 text-2024_body1 placeholder:text-2024_fillContent-primary-inactive relative h-full w-full border-[3px] bg-amber-50 text-white transition-all focus:pl-16 focus:outline-none focus:placeholder:text-transparent"
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
              "rounded-2024_20 bg-2024_fillContent-primary-darker text-2024_body3 caret-2024_pink placeholder:text-2024_fillContent-primary-inactive sm:text-2024_body1 h-full w-full pr-28 text-white transition-all focus:outline-none focus:placeholder:text-transparent sm:pr-36",
              disabled ? "pl-10" : "pl-16",
            )}
          />

          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <button
              type="submit"
              className="bg-2024_fillBackground-good hover:shadow-2024_searchButton relative flex h-[56px] w-[56px] cursor-pointer items-center justify-center rounded-full transition-all sm:h-[76px] sm:w-[76px]"
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
