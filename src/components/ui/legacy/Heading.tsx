import { cva, type VariantProps } from "class-variance-authority";
import { type ReactNode } from "react";

import { parseVariant, type SizeAndWeightVariant } from "./utils/sizeAndWeight";

const headingStyles = cva(["font-sans"], {
  variants: {
    /**
     * The size of the heading that will be displayed.
     * The size is expressed in the desktop size, and will automatically adjust for mobile.
     * Set the `fixed` property to disable responsive sizing.
     */
    size: {
      H1: "md:text-2024_h1-super-88 text-2024_h3-super-48",
      // TODO: verify mobile size for h2
      H2: "md:text-2024_h2-super-76 text-2024_h3-super-48",
      H3: "md:text-2024_h3-super-48 text-2024_h5-extrabold-32",
      H4: "text-2024_h4-super-36",
      H5: "text-2024_h5-super-32",
      H6: "md:text-heading2 text-heading3",
    },
    weight: {
      extraBold: "font-extrabold",
      super: "font-[750]",
      medium: "font-medium",
      regular: "font-normal",
    },
    color: {
      "fillContent-primary": "text-2024_fillContent-primary",
    },
    truncate: {
      true: "truncate",
    },
    /** Fix the header size, and disable responsive sizing of the heading. */
    fixed: { true: "", false: "" },
  },
  defaultVariants: {
    size: "H1",
    color: "fillContent-primary",
    weight: "super",
  },
  // Use the empty `fixed` size to force text size to a set value:
  compoundVariants: [
    {
      fixed: true,
      size: "H1",
      weight: "super",
      class: "!text-2024_h1-super-88",
    },
    {
      fixed: true,
      size: "H2",
      weight: "super",
      class: "!text-2024_h2-super-78",
    },
  ],
});
type HeadingStylesProps = VariantProps<typeof headingStyles>;

export interface HeadingProps
  extends Omit<HeadingStylesProps, "size" | "weight"> {
  /**
   * The HTML element that will be rendered.
   * By default, we render a "div" in order to separate presentational styles from semantic markup.
   */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
  children: ReactNode;
  className?: string;
  variant: SizeAndWeightVariant<HeadingStylesProps>;
}

export function Heading({
  as: Tag = "div",
  children,
  variant,
  className,
  ...styleProps
}: HeadingProps) {
  const [size, weight] = parseVariant<HeadingStylesProps>(variant);
  return (
    <Tag className={headingStyles({ className, size, weight, ...styleProps })}>
      {children}
    </Tag>
  );
}
