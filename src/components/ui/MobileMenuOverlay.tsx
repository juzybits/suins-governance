import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { lock, unlock } from "tua-body-scroll-lock";

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
  useEffect(() => {
    if (open) {
      lock();
    } else {
      unlock();
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          className="fixed bottom-0 left-0 right-0 top-0 z-50 bg-purple-800 px-2024_L pb-2024_4XL pt-[92px]"
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
        >
          {children}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
