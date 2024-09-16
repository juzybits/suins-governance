import { zodResolver } from "@hookform/resolvers/zod";
import type { UseFormProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { TypeOf, ZodSchema } from "zod";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface UseZodFormProps<T extends ZodSchema<any>>
  extends UseFormProps<TypeOf<T>> {
  schema: T;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useZodForm = <T extends ZodSchema<any>>({
  schema,
  ...formConfig
}: UseZodFormProps<T>) =>
  useForm({
    ...formConfig,
    resolver: zodResolver(schema),
  });
