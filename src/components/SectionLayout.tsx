import { type ReactNode } from "react";
import { Heading } from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";

export function SectionLayout({
  children,
  title,
  isLoading,
}: {
  title: string;
  children: ReactNode;
  isLoading?: boolean;
}) {
  if (isLoading)
    return (
      <div className="relative flex w-full flex-col gap-2024_XL rounded-2024_S bg-2024_fillBackground-searchBg p-2024_XL">
        <Loader className="max-w-10" />
      </div>
    );
  return (
    <div className="relative flex w-full flex-col gap-2024_XL rounded-2024_S bg-2024_fillBackground-searchBg p-2024_XL">
      <Heading variant="H6/super" className="font-[750]">
        {title}
      </Heading>
      {children}
    </div>
  );
}
