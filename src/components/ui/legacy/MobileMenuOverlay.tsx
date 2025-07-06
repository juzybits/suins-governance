import { useMenuContentContext } from "@/context/menu";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

const easingValue = [0.65, 0, 0.35, 1];

interface MobileMenuOverlayProps {
  open: boolean;
  children: ReactNode;
}

const MENU_OVERLAY_INITIAL_ANIMATIONS = {
  y: "-100%",
  opacity: 0,
};

export const MENU_OVERLAY_ANIMATIONS_DURATION = 0.2;

export function MobileMenuOverlay({ open, children }: MobileMenuOverlayProps) {
  const { setOpen, setContent } = useMenuContentContext();

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          className="fixed inset-0 z-50 px-l pb-4xl pt-4xl"
          initial={MENU_OVERLAY_INITIAL_ANIMATIONS}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: MENU_OVERLAY_ANIMATIONS_DURATION,
              ease: easingValue,
            },
          }}
          exit={{
            ...MENU_OVERLAY_INITIAL_ANIMATIONS,
            transition: {
              duration: MENU_OVERLAY_ANIMATIONS_DURATION,
              ease: easingValue,
              delay: MENU_OVERLAY_ANIMATIONS_DURATION,
            },
          }}
          onClick={() => {
            setOpen(false);
            setContent(null);
          }}
        >
          {children}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
