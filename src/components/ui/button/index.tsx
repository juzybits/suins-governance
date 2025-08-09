import clsx from "clsx";
import { type PropsWithChildren } from "react";

import Loader from "@/components/ui/legacy/Loader";
import React from "react";
import { type ButtonProps } from "./button.types";
import { buttonVariants } from "./button.variants";
import ButtonWrapper from "./button-wrapper";

const Button = React.forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ButtonProps>
>(
  (
    {
      href,
      after,
      before,
      variant,
      loading,
      children,
      className,
      asChild = false,
      ...props
    },
    ref,
  ) => (
    <ButtonWrapper
      ref={ref}
      href={href}
      asChild={asChild}
      variant={variant}
      className={clsx(buttonVariants({ variant, className }))}
      {...props}
    >
      {loading && (
        <div className="pr-s">
          <Loader className="h-5 w-5" />
        </div>
      )}
      <div
        className={clsx(
          "inline-flex flex-nowrap items-center gap-2",
          // loading && "text-transparent",
        )}
      >
        {before}
        {children}
        {after}
      </div>
    </ButtonWrapper>
  ),
);

Button.displayName = "Button";

export { Button, buttonVariants };
