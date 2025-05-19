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
    </ButtonWrapper>
  ),
);

Button.displayName = "Button";

export { Button, buttonVariants };
