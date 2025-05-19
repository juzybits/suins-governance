import { useGetNameAvatar } from "@/hooks/useGetNameAvatar";
import SvgSuinsFallbackAvatar from "@/icons/legacy/SuinsFallbackAvatar";
import { CustomImage } from "@/components/ui/legacy/CustomImage";
import { type FC } from "react";
import { type NameAvatarProps } from "./wallet.types";

export const NameAvatar: FC<NameAvatarProps> = ({ name }) => {
  const { data } = useGetNameAvatar(name);

  return (
    <CustomImage
      alt={name}
      src={!data?.isAvatar ? undefined : data?.url}
      className="h-full w-full rounded-full object-cover"
      fallback={
        <SvgSuinsFallbackAvatar width="100%" style={{ maxWidth: "2rem" }} />
      }
    />
  );
};
