import {
  DropdownMenuContent,
  DropdownMenuItem,
  Root,
  Trigger,
} from "@radix-ui/react-dropdown-menu";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import {
  useCurrentAccount,
  useCurrentWallet,
  useSwitchAccount,
} from "@mysten/dapp-kit";
import { ConnectWalletButton } from "./connect-wallet-button";
import { Button } from "@/components/ui/button";
import SvgChevronDown from "@/icons/legacy/ChevronDown";
import { motion } from "framer-motion";
import { AccountInfo } from "./account-info";
import { AccountContent } from "./account-content";
import { type FC } from "react";
import { GradientBorder } from "../gradient-border";

// TODO: Support expanding account without switching account
export const Wallet: FC<{ isNav?: boolean }> = ({ isNav }) => {
  const currentAccount = useCurrentAccount();
  const { currentWallet, isConnecting, isDisconnected } = useCurrentWallet();
  const { mutate: switchAccount } = useSwitchAccount();
  const isSmallOrAbove = useBreakpoint("sm");

  // we are using currentAccount and !isConnecting to determine if the wallet is connected,
  if ((!currentAccount && !isConnecting) || isDisconnected)
    return isNav && !isSmallOrAbove ? null : <ConnectWalletButton />;

  return (
    <Root>
      <Trigger asChild>
        <Button
          variant="outline/large"
          className="border-tertiary pb-2xs pl-2xs pr-s pt-2xs"
          after={<SvgChevronDown className="h-[1rem] w-[1rem]" />}
        >
          <AccountInfo
            nickName={currentAccount?.label}
            hideAccountPreview={!isSmallOrAbove}
            address={currentAccount?.address ?? ""}
          />
        </Button>
      </Trigger>
      <DropdownMenuContent
        asChild
        align="end"
        sideOffset={12}
        className="sm:mx-unset z-50 mx-l max-sm:w-[90vw]"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          <GradientBorder
            colors={["#565b77", "#565b77", "#4ca2ff", "#4ca2ff", "#565b77"]}
            className="flex h-full w-full flex-col gap-xs overflow-hidden rounded-m border-2 p-m transition-all placeholder:text-primary-inactive before:absolute before:inset-[2px] before:rounded-[22px] focus:pl-16 focus:outline-none focus:placeholder:text-transparent"
          >
            {currentWallet?.accounts.map((account) => (
              <DropdownMenuItem
                className="relative"
                key={account?.address}
                onClick={(e) => {
                  e.preventDefault();
                  switchAccount({ account });
                }}
                onSelect={(e) => {
                  e.preventDefault();
                  switchAccount({ account });
                }}
              >
                <AccountContent
                  address={account?.address}
                  nickName={account?.label}
                  isOpen={
                    !!(
                      currentAccount?.address &&
                      account.address === currentAccount?.address
                    )
                  }
                />
              </DropdownMenuItem>
            ))}
          </GradientBorder>
        </motion.div>
      </DropdownMenuContent>
    </Root>
  );
};
