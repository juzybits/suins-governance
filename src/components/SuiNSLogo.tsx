import { cva, type VariantProps } from "class-variance-authority";

import SvgSuinsLogoFill from "@/icons/SuinsLogoFill";
import SvgSuinsLogoOutline from "@/icons/SuinsLogoOutline";

const logoStyles = cva(["w-[104px]"], {
  variants: {
    variant: {
      fill: "text-2024_fillContent-primary",
      fillSecondary: "text-2024_fillContent-secondary",
      outline: "text-2024_fillContent-primary",
    },
  },
  defaultVariants: {
    variant: "fill",
  },
});

export interface SuiNSLogoProps extends VariantProps<typeof logoStyles> {
  className?: string;
  children?: never;
}

export function SuiNSLogo({ variant, className }: SuiNSLogoProps) {
  if (variant === "outline") {
    return (
      <SvgSuinsLogoOutline className={logoStyles({ variant, className })} />
    );
  }
  return (
    <SvgSuinsLogoFill
      className={logoStyles({ variant, className })}
      fill="#FFF"
    />
  );
}
