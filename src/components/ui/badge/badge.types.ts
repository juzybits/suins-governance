import { type VariantProps } from "class-variance-authority";
import { type badgeVariants } from "./badge.variants";
import { type HTMLAttributes } from "react";

export type BadgeProps = VariantProps<typeof badgeVariants> &
  HTMLAttributes<HTMLDivElement>;
