"use client";

import { Slot } from "@radix-ui/react-slot";
import Link from "next/link";
import { forwardRef, type PropsWithChildren } from "react";
import { type ButtonWrapperProps } from "./button.types";
import { GradientBorder } from "@/components/gradient-border";
import clsx from "clsx";

const GRADIENT_BORDERS: ReadonlyArray<ButtonWrapperProps["variant"]> = [
  "tall/stroke",
  "short/outline",
];

const ButtonWrapper = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ButtonWrapperProps>
>(({ bg, href, asChild, children, className, disabled, ...props }, ref) => {
  if (href)
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );

  const Component = asChild ? Slot : "button";

  if (GRADIENT_BORDERS.some((word) => props.variant?.includes(String(word))))
    return (
      <GradientBorder
        bg={bg}
        className={clsx(className, "border-2")}
        colors={[
          "#D962FF",
          "#D962FF",
          "#4CA2FF",
          "#4CA2FF",
          "#D962FF",
          "#D962FF",
          "#FF794B",
          "#FF794B",
          "#D962FF",
          "#D962FF",
        ]}
        {...(!disabled && {
          colorsOnHover: [
            "#4CA2FF",
            "#4CA2FF",
            "#D962FF",
            "#D962FF",
            "#4CA2FF",
            "#4CA2FF",
            "#4BFFA6",
            "#4BFFA6",
            "#4CA2FF",
            "#4CA2FF",
          ],
        })}
      >
        <Component ref={ref} disabled={disabled} {...props}>
          {children}
        </Component>
      </GradientBorder>
    );

  return (
    <Component ref={ref} className={className} disabled={disabled} {...props}>
      {children}
    </Component>
  );
});

ButtonWrapper.displayName = ButtonWrapper.name;

export default ButtonWrapper;
