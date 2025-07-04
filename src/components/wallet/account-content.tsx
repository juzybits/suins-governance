import { useExplorerLink } from "@/hooks/useExplorerLink";
import SvgArrowUpLeft16 from "@/icons/legacy/ArrowUpLeft16";
import SvgChevronDown from "@/icons/legacy/ChevronDown";
import SvgCopy from "@/icons/legacy/Copy";
import SvgDelete from "@/icons/legacy/Delete";
import { useDisconnectWallet } from "@mysten/dapp-kit";
import { AnimatePresence, motion } from "framer-motion";
import { AccountInfo } from "./account-info";
import { type FC } from "react";
import { type AccountContentProps } from "./wallet.types";
import { AccountContentButton } from "./account-content-button";
import { GradientBorder } from "../gradient-border";
import { useRouter } from "next/navigation";

export const AccountContent: FC<AccountContentProps> = ({
  isOpen,
  address,
  nickName,
}) => {
  const router = useRouter();
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
          animate="open"
          exit="collapsed"
          initial="collapsed"
          className="overflow-hidden"
          transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] }}
          variants={{
            open: { opacity: 1, height: "auto", overflow: "hidden" },
            collapsed: { opacity: 0, height: 0, overflow: "hidden" },
          }}
        >
          <GradientBorder
            bg="#332C4E"
            className="relative flex h-full flex-col gap-s overflow-hidden rounded-l-s rounded-r-s border-2 px-l py-m transition-colors hover:outline-none focus:outline-none"
            colors={[
              "#d34bff",
              "#d34bff",
              "#d34bff",
              "#4ca2ff",
              "#4ca2ff",
              "#4ca2ff",
              "#d34bff",
              "#d34bff",
              "#4bffa6",
              "#4bffa6",
              "#4bffa6",
              "#d34bff",
            ]}
          >
            <div className="bg-2024_fill relative z-20 mb-s flex cursor-pointer items-center justify-between rounded-s focus:outline-none">
              <AccountInfo address={address} nickName={nickName} showAddress />
              <SvgChevronDown className="relative h-[1rem] w-[1rem] text-primary-main" />
            </div>
            <div className="relative z-20 flex flex-col items-start gap-s">
              <div className="grid w-full grid-cols-3 gap-s">
                <AccountContentButton
                  label="Copy"
                  onClick={copyToClipboard}
                  icon={<SvgCopy className="h-m w-m text-primary-main" />}
                />
                <AccountContentButton
                  label="Explorer"
                  onClick={() => window.open(explorerLink, "_blank")}
                  icon={
                    <SvgArrowUpLeft16 className="h-m w-m text-primary-main" />
                  }
                />
                <AccountContentButton
                  label="Disconnect"
                  onClick={() => {
                    disconnect();
                    router.replace("/");
                  }}
                  icon={<SvgDelete className="h-m w-m text-secondary" />}
                />
              </div>
            </div>
          </GradientBorder>
        </motion.div>
      ) : (
        <motion.div
          exit={{ height: 0 }}
          initial={{ height: 0 }}
          className="overflow-hidden"
          animate={{ height: "auto" }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex cursor-pointer items-center justify-between rounded-l-s rounded-r-s px-l py-m outline-none hover:bg-bg-secondary hover:outline-none">
            <AccountInfo address={address} showAddress nickName={nickName} />
            <SvgChevronDown className="relative h-m w-m -rotate-90 text-primary-main" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
