import HamburgerSVG from "@/icons/Hamburguer";
import TimesSVG from "@/icons/times";
import clsx from "clsx";
import { type FC } from "react";

const Hamburguer: FC<{ isOpen: boolean; onClick: () => void }> = ({
  isOpen,
  onClick,
}) => {
  const Icon = isOpen ? TimesSVG : HamburgerSVG;

  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded-full border-2 hover:border-secondary hover:text-primary-main",
        isOpen
          ? "border-secondary text-primary-main"
          : "border-tertiary text-secondary",
      )}
    >
      <Icon width="100%" style={{ maxWidth: isOpen ? "0.75rem" : "1rem" }} />
    </button>
  );
};

export default Hamburguer;
