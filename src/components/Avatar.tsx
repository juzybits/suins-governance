import { cn } from "@/utils/cn";

import SvgSuinsFallbackAvatar from "@/icons/SuinsFallbackAvatar";
import { CustomImage } from "@/components/ui.legacy/CustomImage";
import { useGetAccountInfo } from "@/hooks/useGetAccountInfo";

export function Avatar({
  address,
  className,
}: {
  address?: string;
  className?: string;
}) {
  const { data } = useGetAccountInfo({ address });

  return (
    <CustomImage
      src={!data?.isAvatar ? undefined : data?.url}
      alt={data?.name ?? address}
      className={cn("h-full w-full rounded-full object-cover", className)}
      fallback={
        <SvgSuinsFallbackAvatar
          className={cn(
            "h-2024_2XL w-2024_2XL rounded-full object-cover text-white",
            className,
          )}
        />
      }
    />
  );
}
