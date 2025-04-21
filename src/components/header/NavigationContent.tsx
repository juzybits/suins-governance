import { motion } from "framer-motion";
import { useState } from "react";

import { FooterLinks } from "@/components/footer/FooterLinks";
import { MENU_OVERLAY_ANIMATIONS_DURATION } from "@/components/ui/MobileMenuOverlay";
import { Text } from "@/components/ui/Text";
import { ButtonOrLink } from "@/components/ui/utils/ButtonOrLink";
import { cn } from "@/utils/cn";
import {
  CLAIM_AEON_URL,
  CLAIM_NS_URL,
  CONSTITUTION_URL,
  TOKENOMICS_URL,
} from "@/constants/urls";

const CONTENT_INITIAL_ANIMATIONS = {
  opacity: 0,
  y: -67,
};

const CONTENT_ANIMATIONS = {
  opacity: 1,
  y: 0,
};

interface MenuContentButtonProps {
  title: string;
  to?: string;
  href?: string;
  target?: string;
}

function MenuContentButton({
  title,
  to,
  href,
  target,
}: MenuContentButtonProps) {
  const [isClicked, setIsClicked] = useState(false);
  const handleStart = () => {
    setIsClicked(true);
  };

  const handleEnd = () => {
    setIsClicked(false);
  };

  return (
    <ButtonOrLink
      className={cn(
        "p-2024_L py-2024_M text-start transition-all hover:rounded-16 hover:bg-[#2d2743]",
        {
          "bg-transparent": !isClicked,
          "bg-[#2d2743]": isClicked,
        },
      )}
      to={to}
      href={href}
      target={target}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
    >
      <Text variant="Large/regular">{title}</Text>
    </ButtonOrLink>
  );
}

export function NavigationContent() {
  return (
    <div className="flex h-full flex-col items-end">
      <motion.section
        className="flex w-full flex-col gap-2024_S divide-y divide-2024_fillContent-tertiary/40 rounded-2024_R border-2 border-2024_fillContent-tertiary bg-2024_fillBackground-primary p-2024_M md:w-[280px]"
        initial={CONTENT_INITIAL_ANIMATIONS}
        exit={CONTENT_INITIAL_ANIMATIONS}
        animate={{
          ...CONTENT_ANIMATIONS,
          transition: {
            duration: MENU_OVERLAY_ANIMATIONS_DURATION,
            // delay for the overlay to finish animating
            delay: MENU_OVERLAY_ANIMATIONS_DURATION,
            ease: [0.65, 0, 0.35, 1],
          },
        }}
      >
        <div className="flex h-full flex-col gap-0">
          <MenuContentButton
            title="Claim Your $NS"
            href={CLAIM_NS_URL}
            target="_blank"
          />
          <MenuContentButton
            title="$NS Tokenomics"
            href={TOKENOMICS_URL}
            target="_blank"
          />
        </div>
        <div className="flex h-full flex-col gap-0 pt-2024_S">
          <MenuContentButton title="SuiNS Governance Voting" href="vote" />
          <MenuContentButton
            title="SuiNS Constitution"
            href={CONSTITUTION_URL}
            target="_blank"
          />
        </div>
        <div className="flex h-full flex-col gap-0 pt-2024_S">
          <MenuContentButton title="SuiNS Staking" href="stake" />
        </div>
        <div className="flex h-full flex-col gap-0 pt-2024_S">
          <MenuContentButton
            title="Claim Aeon NFT"
            href={CLAIM_AEON_URL}
            target="_blank"
          />
        </div>
      </motion.section>
      <motion.section
        className="mt-auto w-full sm:hidden"
        initial={CONTENT_INITIAL_ANIMATIONS}
        exit={CONTENT_INITIAL_ANIMATIONS}
        animate={{
          ...CONTENT_ANIMATIONS,
          transition: {
            duration: MENU_OVERLAY_ANIMATIONS_DURATION,
            // delay for the overlay to finish animating and half of the duration of the content to animate
            delay:
              MENU_OVERLAY_ANIMATIONS_DURATION +
              MENU_OVERLAY_ANIMATIONS_DURATION / 2,
            ease: [0.65, 0, 0.35, 1],
          },
        }}
      >
        <FooterLinks />
      </motion.section>
    </div>
  );
}
