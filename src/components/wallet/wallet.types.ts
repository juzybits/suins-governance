import { type ReactNode } from "react";

export type AccountContentProps = {
  address: string;
  nickName?: string;
  isOpen?: boolean;
};

export interface AccountContentButtonProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}

export interface AccountInfoProps {
  address: string;
  nickName?: string;
  showAddress?: boolean;
  hideAccountPreview?: boolean;
}

export interface NameAvatarProps {
  name?: string;
}
