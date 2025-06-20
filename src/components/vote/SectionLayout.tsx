import { type ReactNode } from "react";

import Loader from "@/components/ui/legacy/Loader";
import Typography from "../ui/typography";

export function SectionLayout({
  aux,
  title,
  children,
  isLoading,
}: {
  aux?: ReactNode;
  title?: string;
  children: ReactNode;
  isLoading?: boolean;
}) {
  if (isLoading)
    return (
      <div className="relative flex w-full flex-col gap-xl rounded-l-s rounded-r-s bg-bg-modal p-xl">
        <Loader className="max-w-10" />
      </div>
    );

  return (
    <div className="relative flex w-full flex-col gap-xl rounded-l-s rounded-r-s bg-bg-modal p-xl md:min-w-[364px]">
      {title && (
        <div className="flex justify-between">
          <Typography
            variant="display/XXSmall Light"
            className="text-primary-main"
          >
            {title}
          </Typography>
          {aux}
        </div>
      )}
      {children}
    </div>
  );
}
