import { Slot } from "@radix-ui/react-slot";
import { type ComponentProps, forwardRef } from "react";
import Link from "next/link";
import { type LinkProps } from "next/link";
export interface ButtonOrLinkProps
  extends Omit<
    Partial<LinkProps> & ComponentProps<"a"> & ComponentProps<"button">,
    "ref"
  > {
  to?: string;
  asChild?: boolean;
}

export const ButtonOrLink = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  ButtonOrLinkProps
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ href, to, asChild, ...props }, ref: any) => {
    // External link:
    if (href) {
      return (
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        <a
          ref={ref} // eslint-disable-line @typescript-eslint/no-unsafe-assignment
          target="_blank"
          rel="noreferrer noopener"
          href={href}
          {...props}
        />
      );
    }

    if (to) {
      return <Link ref={ref} href={to} {...props} />; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    }
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        {...props}
        type={props.type ?? "button"}
        ref={ref} // eslint-disable-line @typescript-eslint/no-unsafe-assignment
      />
    );
  },
);

ButtonOrLink.displayName = "ButtonOrLink";
