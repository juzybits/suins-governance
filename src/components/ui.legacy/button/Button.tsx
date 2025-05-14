import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { type ReactNode } from "react";

import styles from "./styles.module.css";

import Loader from "@/components/ui.legacy/Loader";
import { GradientBorder } from "@/components/gradient-border"; // gradient-fill-buttons/orange_pink_blue
import React from "react";
import Link from "next/link";

const buttonStyles = cva(
  [
    styles.btn_base,
    "inline-flex items-center justify-center text-center relative px-4 text-sm transition-colors",
  ],
  {
    variants: {
      variant: {
        short: ["rounded-2024_S px-2024_L h-10"],
        tall: ["rounded-2024_M px-2024_L h-2024_3.5XL"],
      },
      gradient: {
        // fill style
        "fill/pink_green": [styles.btn_hover, styles.btn_pink_green],
        "fill/orange_pink_blue": [
          styles.btn_hover,
          styles.btn_orange_pink_blue,
        ],
        "fill/green_orange_pink": [
          styles.btn_hover,
          styles.btn_green_orange_pink,
        ],
        "fill/green_blue_pink": [styles.btn_hover, styles.btn_green_blue_pink],

        // stroke style
        "stroke/green": "",
        "stroke/pink": "",
        "stroke/orange": "",
        "stroke/blue": "",
        "stroke/pink_green": "",

        // solid color
        "solid/good": [styles.btn_hover, styles.btn_solid_good],
        "solid/brandBlue": "bg-2024_BRAND_COLORS-blue",
      },
    },
    defaultVariants: {
      variant: "short",
      gradient: "solid/brandBlue",
    },
  },
);

type ButtonStylesProps = VariantProps<typeof buttonStyles>;
function getGradientStyles(gradient: ButtonStylesProps["gradient"]) {
  if (!gradient) {
    return [];
  }
  return gradient.split("/");
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  asChild?: boolean;
  children: ReactNode;
  href?: string;
  loading?: boolean;
  before?: ReactNode;
  after?: ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      loading,
      gradient,
      children,
      before,
      after,
      href,
      disabled,
      className,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const [style] = getGradientStyles(gradient);

    const btnContent = (
      <>
        {loading && (
          <div className="absolute left-1/2 top-1/2 h-10 -translate-x-1/2 -translate-y-1/2">
            <Loader className="h-6 w-6" />
          </div>
        )}
        <div
          className={clsx(
            "inline-flex flex-nowrap items-center gap-2",
            loading && "text-transparent",
          )}
        >
          {before}
          {children}
          {after}
        </div>
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={clsx(buttonStyles({ variant, gradient, className }))}
          target="_blank"
        >
          {btnContent}
        </Link>
      );
    }
    if (!style || style === "fill" || style === "solid") {
      return (
        <Comp
          className={clsx(buttonStyles({ variant, gradient, className }))}
          {...props}
          disabled={disabled ?? loading}
          ref={ref}
        >
          {btnContent}
        </Comp>
      );
    }

    return (
      <GradientBorder
        colors={["#241D3D 20%", "#D34BFF", "#241D3D 80%"]}
        className={clsx("border-2", buttonStyles({ variant, className }))}
      >
        <Comp {...props} disabled={disabled ?? loading} ref={ref}>
          {btnContent}
        </Comp>
      </GradientBorder>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonStyles };
