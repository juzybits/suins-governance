import { type ReactNode } from "react";

export interface InputProps {
  info?: string;
  value: string;
  error?: boolean;
  suffix?: ReactNode;
  suffixTitle?: string;
  setValue: (amount: string) => void;
}
