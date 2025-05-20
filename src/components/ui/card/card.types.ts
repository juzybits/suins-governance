import type { ReactNode } from "react";

export interface CardProps {
  icon: ReactNode;
  title: string;
  value: string;
  subValue?: string;
  withBorder?: boolean;
}
