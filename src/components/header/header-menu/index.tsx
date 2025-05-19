import { useMenuContentContext } from "@/context/menu";
import Hamburguer from "../../ui/hamburger";
import { type FC } from "react";

export const HeaderMenu: FC = () => {
  const { open, setOpen, content, setContent } = useMenuContentContext();

  const onClick = () => {
    setContent(content === "navigation" ? null : "navigation");
    setOpen((i) => !i);
  };

  return <Hamburguer isOpen={open} onClick={onClick} />;
};
