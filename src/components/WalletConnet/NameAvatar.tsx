import { useGetNameAvatar } from "@/hooks/useGetNameAvatar";
import SvgSuinsFallbackAvatar from "@/icons/SuinsFallbackAvatar";
import { CustomImage } from "@/components/ui.legacy/CustomImage";

export function NameAvatar({ name }: { name?: string }) {
  const { data } = useGetNameAvatar(name);

  return (
    <CustomImage
      src={!data?.isAvatar ? undefined : data?.url}
      alt={name}
      className="h-full w-full rounded-full object-cover"
      fallback={
        <SvgSuinsFallbackAvatar className="h-2024_2XL w-2024_2XL rounded-full object-cover text-white sm:h-[48px] sm:w-[48px]" />
      }
    />
  );
}
