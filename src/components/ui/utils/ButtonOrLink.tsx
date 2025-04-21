import { Slot } from '@radix-ui/react-slot';
import { type ComponentProps, forwardRef, type Ref } from 'react';
import Link from "next/link";
import { LinkProps } from 'next/link';
export interface ButtonOrLinkProps
    extends Omit<Partial<LinkProps> & ComponentProps<'a'> & ComponentProps<'button'>, 'ref'> {
    to?: string;
    asChild?: boolean;
}

export const ButtonOrLink = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonOrLinkProps>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ href, to, asChild, ...props }, ref: any) => {
        // External link:
        if (href) {
            return (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a ref={ref} target='_blank' rel='noreferrer noopener' href={href} {...props} />
            );
        }

        if (to) {
            return <Link ref={ref} href={to} {...props} />;
        }
        const Comp = asChild ? Slot : 'button';
        return <Comp {...props} type={props.type || 'button'} ref={ref as Ref<HTMLButtonElement>} />;
    },
);

ButtonOrLink.displayName = 'ButtonOrLink';
