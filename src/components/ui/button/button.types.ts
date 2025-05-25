import type { VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { buttonVariants } from ".";

export interface ButtonWrapperProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  bg?: string;
  href?: string;
  asChild?: boolean;
}

export interface ButtonProps extends ButtonWrapperProps {
  loading?: boolean;
  after?: ReactNode;
  before?: ReactNode;
}
