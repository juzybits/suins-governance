import { forwardRef, type ReactNode, type ComponentProps } from "react";
import { Controller, useFormContext } from "react-hook-form";
import * as RadioGroup from "@radix-ui/react-radio-group";

type RadioOption = {
  value: string;
  label?: ReactNode;
  disabled?: boolean;
};

type RadioGroupFieldProps = {
  name: string;
  options: RadioOption[];
  renderOption: (option: RadioOption, selected: boolean) => ReactNode;
  disabled?: boolean;
} & Omit<
  ComponentProps<typeof RadioGroup.Root>,
  "onValueChange" | "value" | "defaultValue" | "ref" | "children"
>;

export const RadioGroupField = forwardRef<HTMLDivElement, RadioGroupFieldProps>(
  ({ name, options, renderOption, disabled, ...props }, forwardedRef) => {
    const { control } = useFormContext();

    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <RadioGroup.Root
            {...props}
            name={name}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value={value ?? ""}
            onValueChange={onChange}
            disabled={disabled}
            ref={forwardedRef}
          >
            {options.map((option) => (
              <RadioGroup.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="w-full"
              >
                {renderOption(option, option.value === value)}
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        )}
      />
    );
  },
);

RadioGroupField.displayName = "RadioGroupField";
