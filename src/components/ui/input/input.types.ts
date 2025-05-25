import { type ReactNode } from "react";

export interface InputProps {
  info?: string;
  value: string;
  suffix?: ReactNode;
  setValue: (amount: string) => void;
}
