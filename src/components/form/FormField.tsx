import clsx from "clsx";
import React, { type ReactNode } from "react";
import { useFormContext } from "react-hook-form";

import SvgOutlineExclamationCircle from "@/icons/OutlineExclamationCircle";

export function FormFieldError({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const { getFieldState, formState } = useFormContext();

  const state = getFieldState(name, formState);

  if (state.error && typeof state.error.message === "string") {
    return (
      <div
        className={clsx(
          "flex w-full items-center gap-2 self-center font-paragraph text-sm font-normal text-issue-dark",
          className,
        )}
      >
        <SvgOutlineExclamationCircle className="h-4 w-4" />
        <span>{state.error.message}</span>
      </div>
    );
  }

  return null;
}

type FormFieldProps = {
  name: string;
  children: ReactNode;
  className?: string;
  noErrorField?: boolean;
};

function FormField({
  children,
  name,
  className,
  noErrorField,
}: FormFieldProps) {
  return (
    <div className={clsx("relative flex flex-col gap-5", className)}>
      {children}

      {!noErrorField && <FormFieldError name={name} />}
    </div>
  );
}

export default FormField;
