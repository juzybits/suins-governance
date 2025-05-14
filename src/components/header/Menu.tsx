import { motion } from "framer-motion";
import { useState } from "react";

import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useMenuContentContext } from "@/components/header/MenuContent";
import HamburgerOpen24 from "@/icons/HamburgerOpen24";
import HamburgerRest24 from "@/icons/HamburgerRest24";
import { ButtonOrLink } from "@/components/ui.legacy/utils/ButtonOrLink";
import { cn } from "@/utils/cn";

const easingValue = [0.65, 0, 0.35, 1];

export function Menu() {
  const { open, setOpen, content, setContent } = useMenuContentContext();
  const [isClicked, setIsClicked] = useState(false);
  const isSmallOrAbove = useBreakpoint("sm");
  const handleStart = () => {
    setIsClicked(true);
  };

  const handleEnd = () => {
    setIsClicked(false);
  };

  return (
    <ButtonOrLink
      className={cn(
        "relative flex h-2024_3XL w-[48px] items-center rounded-2024_M border-2 border-2024_fillContent-tertiary px-2024_R transition-all",
        {
          "bg-transparent": !isClicked,
          "bg-2024_fillContent-tertiary": isClicked,
          "bg-2024_gradient-fill-border-active": open,
        },
      )}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onClick={() => {
        setContent(content === "navigation" ? null : "navigation");
        setOpen(!open);
      }}
    >
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 1 }}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.2, ease: easingValue }}
      >
        <HamburgerRest24 className="h-2024_XL w-2024_XL text-2024_fillContent-primary" />
      </motion.div>
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2, ease: easingValue }}
      >
        {isSmallOrAbove ? (
          <HamburgerRest24 className="h-2024_XL w-2024_XL text-2024_fillContent-primary" />
        ) : (
          <HamburgerOpen24 className="h-2024_XL w-2024_XL text-2024_fillContent-primary" />
        )}
      </motion.div>
    </ButtonOrLink>
  );
}
