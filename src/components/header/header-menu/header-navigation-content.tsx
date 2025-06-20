import { motion } from "framer-motion";

import { FooterLinks } from "@/components/footer/footer-links";
import { MENU_OVERLAY_ANIMATIONS_DURATION } from "@/components/ui/legacy/MobileMenuOverlay";
import { Text } from "@/components/ui/legacy/Text";
import { ButtonOrLink } from "@/components/ui/legacy/utils/ButtonOrLink";
import {
  CLAIM_AEON_URL,
  CLAIM_NS_URL,
  CONSTITUTION_URL,
  TOKENOMICS_URL,
} from "@/constants/urls";
import { type MenuContentButtonProps } from "../header.types";

const CONTENT_INITIAL_ANIMATIONS = {
  opacity: 0,
  y: -67,
};

const CONTENT_ANIMATIONS = {
  opacity: 1,
  y: 0,
};

function MenuContentButton({
  to,
  href,
  title,
  target,
}: MenuContentButtonProps) {
  return (
    <ButtonOrLink
      to={to}
      href={href}
      target={target}
      className={
        "rounded-xs px-l py-m text-start transition-all hover:bg-bg-secondary"
      }
    >
      <Text variant="Large/regular">{title}</Text>
    </ButtonOrLink>
  );
}

export function NavigationContent() {
  return (
    <div className="flex h-full flex-col items-end">
      <motion.section
        className="flex w-full flex-col gap-s divide-y divide-tertiary/40 rounded-m border-2 border-tertiary bg-bg-primary_dark p-m text-primary-main md:w-[280px]"
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
        <div className="flex h-full flex-col gap-0 pt-xs">
          <MenuContentButton title="SuiNS Governance Voting" to="/vote" />
          <MenuContentButton
            title="SuiNS Constitution"
            href={CONSTITUTION_URL}
            target="_blank"
          />
        </div>
        <div className="flex h-full flex-col gap-0 pt-xs">
          <MenuContentButton title="SuiNS Staking" to="/stake" />
        </div>
        <div className="flex h-full flex-col gap-0 pt-xs">
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
