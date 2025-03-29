import {
  ConnectModal,
  useCurrentAccount,
  useCurrentWallet,
  useDisconnectWallet,
  useSuiClientQuery,
  useSwitchAccount,
} from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  Root,
  Trigger,
} from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { type MouseEvent, type ReactNode, useState } from "react";
import Link from "next/link";

import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useExplorerLink } from "@/hooks/useExplorerLink";
import { formatName } from "@/utils/common";
import { NameAvatar } from "./NameAvatar";
import SvgArrowUpLeft16 from "@/icons/ArrowUpLeft16";
import SvgChevronDown from "@/icons/ChevronDown";
import SvgCopy from "@/icons/Copy";
import SvgDelete from "@/icons/Delete";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/button/Button";

// TODO: Support expanding account without switching account
export function ConnectWallet() {
  const currentAccount = useCurrentAccount();
  const { currentWallet, isConnecting, isDisconnected } = useCurrentWallet();
  const { mutate: switchAccount } = useSwitchAccount();
  const isSmallOrAbove = useBreakpoint("sm");

  // we are using currentAccount and !isConnecting to determine if the wallet is connected,
  if ((!currentAccount && !isConnecting) || isDisconnected)
    return <ConnectWalletButton />;

  return (
    <Root>
      <Trigger asChild>
        <button className='group relative flex w-full items-center justify-between rounded-2024_M bg-2024_fillContent-tertiary p-2024_XS pr-2024_R before:absolute before:inset-[2px] before:rounded-[99px] before:bg-[#2e2747] before:content-[""] hover:bg-2024_button-gradient focus:outline-none data-[state=open]:bg-[] data-[state="open"]:bg-2024_button-gradient before:data-[state=open]:bg-2024_gradient-active'>
          <AccountInfo
            address={currentAccount?.address ?? ""}
            nickName={currentAccount?.label}
            hideAccountPreview={!isSmallOrAbove}
          />
          <div className="h-2024_M w-2024_M">
            <SvgChevronDown className="relative h-2024_M w-2024_M text-2024_fillContent-tertiary group-hover:text-2024_fillContent-primary group-data-[state=open]:text-2024_fillContent-primary" />
          </div>
        </button>
      </Trigger>
      <DropdownMenuContent
        sideOffset={12}
        align="end"
        asChild
        className="z-50 w-2024_menuWidth max-sm:w-[90vw]"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          <div className='flex h-full w-full flex-col gap-2024_XS overflow-hidden rounded-2024_R bg-2024_gradient-dropdown-menu p-2024_M transition-all placeholder:text-2024_fillContent-primary-inactive before:absolute before:inset-[2px] before:rounded-[22px] before:bg-2024_fillContent-primary-darker before:content-[""] focus:pl-16 focus:outline-none focus:placeholder:text-transparent md:w-2024_menuWidth'>
            {currentWallet?.accounts.map((account) => {
              const onClick = (event: MouseEvent | Event) => {
                event.preventDefault();
                switchAccount({ account });
              };

              return (
                <DropdownMenuItem
                  key={account?.address}
                  onClick={onClick}
                  onSelect={onClick}
                  className="relative"
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
              );
            })}
          </div>
        </motion.div>
      </DropdownMenuContent>
    </Root>
  );
}

export function ConnectWalletButton() {
  const [open, setOpen] = useState(false);
  const isSmallOrAbove = useBreakpoint("sm");

  return (
    <ConnectModal
      open={open}
      trigger={
        <Button
          variant={isSmallOrAbove ? "tall" : "short"}
          gradient="fill/orange_pink_blue"
          className="w-full min-w-[160px]"
        >
          <Text variant="B5/bold" color="fillContent-primary-darker">
            Connect Wallet
          </Text>
        </Button>
      }
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
    />
  );
}

function AccountInfo({
  address,
  showAddress,
  nickName,
  hideAccountPreview,
}: {
  address: string;
  nickName?: string;
  showAddress?: boolean;
  hideAccountPreview?: boolean;
}) {
  const { data: resolveSuiNSName } = useSuiClientQuery(
    "resolveNameServiceNames",
    {
      address: address,
    },
  );

  const name = resolveSuiNSName?.data?.[0];

  return (
    <div className="relative flex items-center justify-start gap-2024_R">
      <div className="relative h-2024_2XL w-2024_2XL sm:h-[48px] sm:w-[48px]">
        <NameAvatar name={name} />
      </div>

      {!hideAccountPreview ? (
        showAddress ? (
          <div className="flex flex-col gap-2024_S whitespace-nowrap text-start">
            {name || nickName ? (
              <Text
                truncate
                variant={showAddress ? "B5/bold" : "B6/medium"}
                color="fillContent-primary"
                mono={!showAddress}
                className="max-w-[200px]"
              >
                {name
                  ? formatName(name, {
                      noTruncate: true,
                    })
                  : nickName}
              </Text>
            ) : null}
            <Text variant="B6/medium" color="fillContent-secondary">
              {formatAddress(address)}
            </Text>
          </div>
        ) : (
          <div className="flex w-[100px] flex-col gap-2024_S whitespace-nowrap text-start">
            {(nickName || name) && !showAddress ? (
              <Text
                truncate
                variant="B5/bold"
                color="fillContent-primary"
                className="max-w-[200px]"
              >
                {name
                  ? formatName(name, {
                      noTruncate: true,
                    })
                  : nickName}
              </Text>
            ) : (
              <Text
                variant={"B6/medium"}
                color="fillContent-secondary"
                mono={showAddress}
              >
                {formatAddress(address)}
              </Text>
            )}
          </div>
        )
      ) : null}
    </div>
  );
}

function AccountContentActionButton({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <DropdownMenuItem
      className="flex w-full justify-center rounded-2024_XS border border-[#6E609F] p-2024_M transition ease-in-out hover:border-2024_fillBackground-primary hover:bg-2024_fillBackground-primary"
      onSelect={onClick}
    >
      <Link
        href="#"
        className="flex flex-col items-center justify-center gap-2024_S"
        onClick={onClick}
      >
        {icon}
        <Text variant="B7/semibold" color="fillContent-secondary">
          {label}
        </Text>
      </Link>
    </DropdownMenuItem>
  );
}

type AccountContentProps = {
  address: string;
  nickName?: string;
  isOpen?: boolean;
};

function AccountContent({ address, isOpen, nickName }: AccountContentProps) {
  const { mutate: disconnect } = useDisconnectWallet();

  const explorerLink = useExplorerLink({
    type: "address",
    id: address,
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      console.debug("Copied!");
    } catch (err) {
      console.debug("Failed to copy!", err);
    }
  };
  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          key="content"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          className="overflow-hidden"
          variants={{
            open: { opacity: 1, height: "auto", overflow: "hidden" },
            collapsed: { opacity: 0, height: 0, overflow: "hidden" },
          }}
          transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] }}
        >
          <div className='relative flex h-full flex-col gap-2024_S overflow-hidden rounded-2024_S bg-transparent px-2024_L py-2024_M transition-colors before:absolute before:inset-[0] before:bg-2024_button-gradient before:content-[""] after:absolute after:inset-[2px] after:rounded-[18px] after:bg-[#2e2747] after:content-[""] focus:outline-none'>
            <div className="bg-2024_fill relative z-20 mb-2024_S flex cursor-pointer items-center justify-between rounded-2024_S focus:outline-none">
              <AccountInfo address={address} nickName={nickName} showAddress />
              <SvgChevronDown className="relative h-2024_M w-2024_M text-2024_fillContent-primary" />
            </div>
            <div className="relative z-20 flex flex-col items-start gap-2024_S">
              <div className="flex w-full flex-1 gap-[10px]">
                <AccountContentActionButton
                  onClick={copyToClipboard}
                  icon={
                    <SvgCopy className="h-2024_M w-2024_M text-2024_fillContent-primary" />
                  }
                  label="Copy"
                />
                <AccountContentActionButton
                  onClick={() => window.open(explorerLink, "_blank")}
                  icon={
                    <SvgArrowUpLeft16 className="h-2024_M w-2024_M text-2024_fillContent-primary" />
                  }
                  label="Explorer"
                />
                <AccountContentActionButton
                  onClick={() => {
                    disconnect();
                  }}
                  icon={
                    <SvgDelete className="h-2024_M w-2024_M text-2024_fillContent-secondary" />
                  }
                  label="Disconnect"
                />
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden"
        >
          <div className="bg-2024_fill flex cursor-pointer items-center justify-between rounded-2024_S px-2024_L py-2024_M hover:bg-2024_fillBackground-secondary">
            <AccountInfo address={address} showAddress nickName={nickName} />
            <SvgChevronDown className="relative h-2024_M w-2024_M -rotate-90 text-2024_fillContent-primary" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
