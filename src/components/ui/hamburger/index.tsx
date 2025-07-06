import HamburgerSVG from "@/icons/hamburguer";
import clsx from "clsx";
import { type FC } from "react";

const Hamburguer: FC<{ isOpen: boolean; onClick: () => void }> = ({
  isOpen,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex h-[2.5rem] w-[3rem] items-center justify-center rounded-full border-2 border-tertiary text-primary-main",
      isOpen && "bg-fill_border_active",
    )}
  >
    <HamburgerSVG width="100%" style={{ maxWidth: "1rem" }} />
  </button>
);

export default Hamburguer;
