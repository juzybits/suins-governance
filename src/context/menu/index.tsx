import { createContext, useContext } from "react";
import type { MenuContentContextProps } from "./menu.types";

export const MenuContentContext = createContext<MenuContentContextProps | null>(
  null,
);

export const useMenuContentContext = () => {
  const context = useContext(MenuContentContext);
  if (!context) {
    throw new Error(
      "useMenuContext must be used within a MenuContentContext Provider",
    );
  }
  return context;
};

export * from "./menu.types";
