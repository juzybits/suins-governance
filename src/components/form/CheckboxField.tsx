import { type ComponentProps, forwardRef, type ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/Checkbox";

type CheckboxFieldProps = {
  name: string;
  label: ReactNode;
} & Omit<ComponentProps<"button">, "ref">;

export const CheckboxField = forwardRef<HTMLButtonElement, CheckboxFieldProps>(
  ({ label, name, ...props }, forwardedRef) => {
    const { control } = useFormContext();
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, name, value } }) => (
          <Checkbox
            id={name}
            label={label}
            onCheckedChange={onChange}
            name={name}
            checked={value as boolean}
            ref={forwardedRef}
            {...props}
          />
        )}
      />
    );
  },
);

CheckboxField.displayName = "CheckboxField";
