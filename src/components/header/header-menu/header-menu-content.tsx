import { useMenuContentContext } from "@/context/menu";
import { MobileMenuOverlay } from "../../ui/legacy/MobileMenuOverlay";
import { NavigationContent } from "./header-navigation-content";
import { type FC } from "react";

export const HeaderMenuContent: FC = () => {
  const { open, content } = useMenuContentContext();

  return (
    <MobileMenuOverlay open={open}>
      {content === "navigation" && <NavigationContent />}
    </MobileMenuOverlay>
  );
};
