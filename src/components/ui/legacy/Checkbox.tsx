import * as RadixCheckbox from "@radix-ui/react-checkbox";
import type { ComponentProps, ReactNode } from "react";
import { forwardRef } from "react";

import SvgCheckStroke16 from "@/icons/legacy/CheckStroke16";

type CheckboxProps = {
  id: string;
  label?: ReactNode;
} & Omit<ComponentProps<typeof RadixCheckbox.Root>, "className" | "ref" | "id">;

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ label, id, ...props }, forwardedRef) => (
    <div className="flex items-start gap-2">
      <RadixCheckbox.Root
        className="border-2024_fillBackground-primary-inactive group peer m-0 h-6 w-6 appearance-none rounded-lg border-2 bg-transparent p-0 data-[state='checked']:border-transparent data-[state='checked']:bg-2024_fillContent-good"
        ref={forwardedRef}
        id={id}
        {...props}
      >
        <RadixCheckbox.Indicator
          forceMount
          className="flex h-full w-full items-center justify-center text-2024_fillContent-primary-inactive data-[state='checked']:text-2024_fillBackground-primary"
        >
          <SvgCheckStroke16 className="h-2024_XL w-2024_XL" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {label && <label htmlFor={id}>{label}</label>}
    </div>
  ),
);

Checkbox.displayName = "Checkbox";
