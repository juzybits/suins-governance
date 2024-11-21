import { type ReactNode } from "react";
import { Heading } from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";

export function SectionLayout({
  children,
  title,
  isLoading,
  isLarge,
}: {
  title: string;
  children: ReactNode;
  isLoading?: boolean;
  isLarge?: boolean;
}) {
  if (isLoading)
    return (
      <div className="relative flex w-full flex-col gap-2024_XL rounded-2024_S bg-2024_fillBackground-searchBg p-2024_XL">
        <Loader className="max-w-10" />
      </div>
    );
  return (
    <div className="relative flex w-full flex-col gap-2024_XL rounded-2024_S bg-2024_fillBackground-searchBg p-2024_XL md:min-w-[364px]">
      <Heading
        variant={isLarge ? "H5/super" : "H6/super"}
        className="font-[750]"
      >
        {title}
      </Heading>
      {children}
    </div>
  );
}
