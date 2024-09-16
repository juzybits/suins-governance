import { cva, type VariantProps } from "class-variance-authority";
import { type ReactNode } from "react";

import { parseVariant, type SizeAndWeightVariant } from "./utils/sizeAndWeight";

const textStyles = cva(["break-words"], {
  variants: {
    size: {
      B1: "text-2024_body1",
      B2: "text-2024_body2",
      B3: "text-2024_body3",
      B4: "text-2024_body4",
      B5: "text-2024_body5",
      B6: "text-2024_body6",
      B7: "text-2024_body7",
      C1: "text-2024_caption font-sans uppercase",
      P1: "text-2024_p1",
      P2: "text-2024_p2",
      P3: "text-2024_p3",
      XLarge: "text-2024_body3 md:text-2024_x-Large",
      LABEL: "text-2024_p2",
      Large: "",
      Small: "",
    },
    fontType: {
      sans: "font-sans",
      inter: "font-inter",
      mono: "font-mono",
    },
    weight: {
      medium: "font-medium",
      regular: "font-normal",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      "fillContent-primary": "text-2024_fillContent-primary",
      "fillContent-tertiary": "text-2024_fillContent-tertiary",
      "fillContent-primary-darker": "text-2024_fillContent-primary-darker",
      "fillContent-primary-inactive": "text-2024_fillContent-primary-inactive",
      "fillContent-orange": "text-2024_fillContent-orange",
      "fillContent-secondary": "text-2024_fillContent-secondary",
      "fillContent-purple-light": "text-2024_fillContent-purple-light",
      "fillContent-link": "text-2024_fillContent-link",
      "fillContent-issue": "text-2024_fillContent-issue",
      "fillContent-2024_temp_dark_purple": "text-2024_temp_dark_purple",
      "issue-dark": "text-issue-dark",
      good: "text-2024_fillContent-good",
      warning: "text-2024_fillContent-warning",
      pink: "text-2024_pink",
      cyan: "text-2024_fillContent-cyan",
    },
    truncate: {
      true: "truncate",
    },
    underline: {
      true: "underline",
    },
    mono: {
      true: "font-mono",
      false: "font-inter",
    },
  },
  compoundVariants: [
    {
      size: "Large",
      weight: "bold",
      class: "2024_large leading-2024_18 font-bold tracking-normal",
    },
    {
      size: "Large",
      weight: "medium",
      class: "2024_large leading-4 font-medium tracking-normal",
    },
    {
      size: "Large",
      weight: "regular",
      class: "2024_large leading-4 font-normal tracking-normal",
    },
    {
      size: "Small",
      weight: "bold",
      class: "text-2024_small leading-2024_14 font-bold tracking-2024_14",
    },
    {
      size: "Small",
      weight: "medium",
      class: "text-2024_small leading-2024_14 font-medium tracking-2024_14",
    },
    {
      size: "Small",
      weight: "medium",
      mono: true,
      class:
        "text-2024_small leading-2024_14 font-normal tracking-2024_1% font-mono",
    },
    {
      size: "Small",
      weight: "semibold",
      class: "text-2024_small-semibold font-semibold",
    },
  ],
  defaultVariants: {
    fontType: "inter",
    size: "B1",
    color: "fillContent-primary",
    weight: "medium",
  },
});

type TextStylesProps = VariantProps<typeof textStyles>;

export interface TextProps extends Omit<TextStylesProps, "size" | "weight"> {
  children: ReactNode;
  className?: string;
  variant: SizeAndWeightVariant<TextStylesProps>;
}

export function Text({
  children,
  className,
  color,
  variant = "B1/medium",
  ...styleProps
}: TextProps) {
  const [size, weight] = parseVariant<TextStylesProps>(variant);
  return (
    <div
      className={textStyles({ color, size, weight, className, ...styleProps })}
    >
      {children}
    </div>
  );
}
