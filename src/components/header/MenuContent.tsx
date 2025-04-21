import { createContext, Dispatch, SetStateAction, useContext } from 'react';

import { NavigationContent } from '@/components/header/NavigationContent';
import { MobileMenuOverlay } from '@/components/ui/MobileMenuOverlay';

type Content = 'navigation' | null;

export type MenuContentContextProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    content: Content;
    setContent: Dispatch<SetStateAction<Content>>;
};

export const MenuContentContext = createContext<MenuContentContextProps | null>(null);

export function useMenuContentContext() {
    const context = useContext(MenuContentContext);
    if (!context) {
        throw new Error('useMenuContext must be used within a MenuContentContext Provider');
    }
    return context;
}

export function MenuContent() {
    const { open, content } = useMenuContentContext();

    return <MobileMenuOverlay open={open}>{content === 'navigation' && <NavigationContent />}</MobileMenuOverlay>;
}
