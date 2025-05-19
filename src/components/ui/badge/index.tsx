import { type PropsWithChildren, type FC } from "react";
import { type BadgeProps } from "./badge.types";
import { badgeVariants } from "./badge.variants";
import clsx from "clsx";

const Badge: FC<PropsWithChildren<BadgeProps>> = ({
  variant,
  className,
  ...props
}) => (
  <div className={clsx(badgeVariants({ variant, className }))} {...props} />
);

export default Badge;
