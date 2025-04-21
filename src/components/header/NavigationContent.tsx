import { motion } from 'framer-motion';
import { useState } from 'react';

import { FooterLinks } from '@/components/footer/FooterLinks';
// import { MENU_NAVS } from '@/components/header/utils';
import { MENU_OVERLAY_ANIMATIONS_DURATION } from '@/components/ui/MobileMenuOverlay';
import { Text } from '@/components/ui/Text';
import { ButtonOrLink } from '@/components/ui/utils/ButtonOrLink';
import { cn } from '@/utils/cn';

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
    mobileTitle?: string;
    to?: string;
    href?: string;
    target?: string;
}

function MenuContentButton({ title, to, href, mobileTitle, target }: MenuContentButtonProps) {
    const [isClicked, setIsClicked] = useState(false);
    const handleStart = () => {
        setIsClicked(true);
    };

    const handleEnd = () => {
        setIsClicked(false);
    };

    return (
        <ButtonOrLink
            className={cn('p-2024_L py-2024_M text-start transition-all hover:rounded-16 hover:bg-[#2d2743]', {
                'bg-transparent': !isClicked,
                'bg-[#2d2743]': isClicked,
            })}
            to={to}
            href={href}
            target={target}
            onMouseDown={handleStart}
            onMouseUp={handleEnd}
            onTouchStart={handleStart}
            onTouchEnd={handleEnd}
        >
            <Text variant='Large/regular'>
                {mobileTitle || title}
            </Text>
        </ButtonOrLink>
    );
}

export function NavigationContent() {
    return (
        <div className='flex h-full flex-col items-end'>
            <motion.section
                className='flex w-full flex-col gap-2024_S divide-y divide-2024_fillContent-tertiary/40 rounded-2024_R border-2 border-2024_fillContent-tertiary bg-2024_fillBackground-primary p-2024_M md:w-[280px]'
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
                <div className='flex h-full flex-col gap-0'>
                    <MenuContentButton title='Claim Your $NS' href='https://claim.suins.io/' target='_blank' />
                    <MenuContentButton title='$NS Tokenomics' href='https://token.suins.io' target='_blank' />
                </div>
                <div className='flex h-full flex-col gap-0 pt-2024_S'>
                    <MenuContentButton title='SuiNS Governance Rules' href='https://docs.suins.io' target='_blank' />
                    <MenuContentButton title='SuiNS Governance Voting' href='https://vote.suins.io' target='_blank' />
                </div>
                <div className='flex h-full flex-col gap-2024_S pt-2024_S'>
                    <MenuContentButton title='Claim Aeon NFT' to='aeon' />
                </div>

                {/* {MENU_NAVS.map(({ title, to, href, mobileTitle }) => (
                    <MenuContentButton key={title} title={title} to={to} href={href} mobileTitle={mobileTitle} />
                ))} */}
            </motion.section>
            <motion.section
                className='mt-auto w-full sm:hidden'
                initial={CONTENT_INITIAL_ANIMATIONS}
                exit={CONTENT_INITIAL_ANIMATIONS}
                animate={{
                    ...CONTENT_ANIMATIONS,
                    transition: {
                        duration: MENU_OVERLAY_ANIMATIONS_DURATION,
                        // delay for the overlay to finish animating and half of the duration of the content to animate
                        delay: MENU_OVERLAY_ANIMATIONS_DURATION + MENU_OVERLAY_ANIMATIONS_DURATION / 2,
                        ease: [0.65, 0, 0.35, 1],
                    },
                }}
            >
                <FooterLinks />
            </motion.section>
        </div>
    );
}
