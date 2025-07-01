"use client";

import Link from "next/link";
import { type FC, useState } from "react";
import { usePathname } from "next/navigation";

import { SuiNSLogo } from "@/components/SuiNSLogo";
import { Wallet } from "@/components/wallet";
import { ProposalsMenu } from "@/components/vote/ProposalsMenu";
import { HeaderMenu } from "./header-menu";
import { StakeHeaderButtons } from "@/components/staking/staking-header-buttons";
import { type HeaderProps } from "./header.types";
import {
  MenuContentContext,
  type MenuContentContextProps,
} from "@/context/menu";
import { HeaderMenuContent } from "./header-menu/header-menu-content";
import clsx from "clsx";

export const Header: FC<HeaderProps> = ({ logoAction }) => {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);
  const [menuContent, setMenuContent] =
    useState<MenuContentContextProps["content"]>(null);

  return (
    <MenuContentContext.Provider
      value={{
        open: openMenu,
        setOpen: setOpenMenu,
        content: menuContent,
        setContent: setMenuContent,
      }}
    >
      <div
        className={clsx(
          "flex flex-col gap-l bg-opacity-[0.18] px-l py-m",
          pathname != "/stake"
            ? "absolute w-full"
            : "bg-bg-secondary_highlight",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-s md:gap-m">
            <Link href="/" onClick={logoAction}>
              <SuiNSLogo
                className="max-w-[20rem]"
                isStaking={
                  pathname !== "/vote" && !pathname.startsWith("/proposal/")
                }
              />
            </Link>
            {(pathname === "/vote" || pathname.startsWith("/proposal/")) && (
              <ProposalsMenu />
            )}
          </div>
          <div className="flex items-center gap-l">
            {pathname === "/stake" && (
              <div className="hidden items-center gap-l md:flex">
                <StakeHeaderButtons />
              </div>
            )}
            <div className="flex max-w-[200px] justify-end">
              <Wallet />
            </div>
            <HeaderMenu />
          </div>
        </div>
      </div>
      {pathname === "/stake" && (
        <div className="flex items-center gap-l px-l md:hidden">
          <StakeHeaderButtons />
        </div>
      )}
      <HeaderMenuContent />
    </MenuContentContext.Provider>
  );
};
