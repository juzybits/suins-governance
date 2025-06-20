import type { ReactNode } from "react";

export interface TableProps {
  minimalist?: boolean;
  header: ReadonlyArray<ReactNode>;
  content: ReadonlyArray<ReadonlyArray<ReactNode>>;
  columnStyles?: (index: number) => string;
}
