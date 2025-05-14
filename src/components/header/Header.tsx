"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { SuiNSLogo } from "@/components/SuiNSLogo";
import { ConnectWallet } from "@/components/WalletConnet/ConnectWallet";
import { cn } from "@/utils/cn";
import { ProposalsMenu } from "@/components/ProposalsMenu";
import { Menu } from "./Menu";
import {
  MenuContent,
  MenuContentContext,
  type MenuContentContextProps,
} from "./MenuContent";
import { StakeHeaderButtons } from "@/components/staking/StakeHeaderButtons";

export interface HeaderProps {
  logoVariant?: "outline" | "fill";
  className?: string;
  hideWalletConnect?: boolean;
  targetPath?: string;
  logoAction?: () => void;
}

export function Header({
  className,
  logoVariant = "fill",
  logoAction,
}: HeaderProps) {
  // const isSmallOrAbove = useBreakpoint("sm");
  const [openMenu, setOpenMenu] = useState(false);
  const [menuContent, setMenuContent] =
    useState<MenuContentContextProps["content"]>(null);

  const pathname = usePathname();

  return (
    <MenuContentContext.Provider
      value={{
        open: openMenu,
        setOpen: setOpenMenu,
        content: menuContent,
        setContent: setMenuContent,
      }}
    >
      <div className="z-10 mx-auto flex w-full flex-col items-center justify-center gap-2024_XL pt-2024_L sm:gap-2024_3XL">
        <div
          className={cn(
            "min-lg:px-2024_3XL relative z-[1000] -mx-4 flex w-screen flex-row flex-wrap items-center px-2024_L",
            className,
          )}
        >
          <div
            className={cn(
              "flex w-full items-center justify-between gap-[4px] md:gap-2024_2XL",
            )}
          >
            <div className="flex items-center justify-center gap-2024_S md:gap-2024_M">
              <Link href="/" className="max-w-[200px]" onClick={logoAction}>
                <SuiNSLogo
                  variant={logoVariant}
                  className="h-2024_2XL sm:h-2024_3XL"
                />
              </Link>
              {(pathname === "/vote" || pathname.startsWith("/proposal/")) && (
                <ProposalsMenu />
              )}
            </div>

            <div className="flex items-center gap-2024_M">
              {/* {pathname === "/vote" && isSmallOrAbove && <OwnedNSBalance />} */}

              <div className="flex items-center gap-2024_S">
                {pathname === "/" && (
                  <>
                    <Link
                      href="/stake"
                      className="rounded bg-green-400 px-4 py-2"
                    >
                      Stake
                    </Link>
                    <Link
                      href="/vote"
                      className="rounded bg-pink-400 px-4 py-2"
                    >
                      Vote
                    </Link>
                  </>
                )}
                {pathname === "/stake" && <StakeHeaderButtons />}
                <div className="flex max-w-[200px] justify-end">
                  <ConnectWallet />
                </div>
                <Menu />
              </div>
            </div>
          </div>
        </div>
        <MenuContent />
      </div>
    </MenuContentContext.Provider>
  );
}
