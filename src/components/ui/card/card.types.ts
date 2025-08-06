import type { ReactNode } from "react";

export interface CardProps {
  title: string;
  value: string;
  icon: ReactNode;
  active?: boolean;
  subValue?: string;
  withBorder?: boolean;
  valueSuffix?: string;
  earnMoreVotes?: boolean;
  valueGradient?: boolean;
  subValueSuffix?: string;
  subValueGradient?: boolean;
  forceCompact?: boolean;
}
