import type { ReactNode } from "react";

export interface CardProps {
  title: string;
  value: string;
  icon: ReactNode;
  active?: boolean;
  subValue?: string;
  withBorder?: boolean;
  valueSuffix?: string;
  valueGradient?: boolean;
  subValueSuffix?: string;
  subValueGradient?: boolean;
}
