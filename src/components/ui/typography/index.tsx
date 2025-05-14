import { type FC, type PropsWithChildren } from "react";
import { type TypographyProps } from "./text.types";
import { textVariants } from "./text.variants";

const Typography: FC<
  PropsWithChildren<TypographyProps & Partial<Pick<HTMLElement, "className">>>
> = ({ children, variant, className }) => (
  <span className={textVariants({ variant, className })}>{children}</span>
);

export default Typography;
