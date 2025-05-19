"use client";

import Link from "next/link";
import { type FC, useState } from "react";
import { usePathname } from "next/navigation";

import { SuiNSLogo } from "@/components/SuiNSLogo";
import { Wallet } from "@/components/wallet";
import { ProposalsMenu } from "@/components/ProposalsMenu";
import { HeaderMenu } from "./header-menu";
import { StakeHeaderButtons } from "@/components/staking/StakeHeaderButtons";
import Typography from "../ui/typography";
import { Button } from "../ui/button";
import { type HeaderProps } from "./header.types";
import {
  MenuContentContext,
  type MenuContentContextProps,
} from "@/context/menu";
import { HeaderMenuContent } from "./header-menu/header-menu-content";
import LockSVG from "@/icons/lock";
import StakeSVG from "@/icons/stake";

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
      <div className="bg-bg-secondary_highlight bg-opacity-[0.18] px-l py-m">
        <div className="">
          <div className="flex justify-between">
            <div className="flex items-center justify-center gap-s md:gap-m">
              <Link href="/" onClick={logoAction}>
                <SuiNSLogo className="max-w-[200px]" />
              </Link>
              {(pathname === "/vote" || pathname.startsWith("/proposal/")) && (
                <ProposalsMenu />
              )}
            </div>
            <div className="flex items-center gap-l">
              {pathname !== "/" && (
                <>
                  <Button
                    href="/stake"
                    variant="solid/medium"
                    className="bg-bg-good"
                    before={
                      <StakeSVG width="100%" style={{ maxWidth: "1rem" }} />
                    }
                  >
                    <Typography variant="label/Large Bold">Stake</Typography>
                  </Button>
                  <Button
                    href="/vote"
                    variant="solid/medium"
                    before={
                      <LockSVG width="100%" style={{ maxWidth: "1rem" }} />
                    }
                  >
                    <Typography variant="label/Large Bold">Lock</Typography>
                  </Button>
                </>
              )}
              {pathname === "/stake" && <StakeHeaderButtons />}
              <div className="flex max-w-[200px] justify-end">
                <Wallet />
              </div>
              <HeaderMenu />
            </div>
          </div>
        </div>
        <HeaderMenuContent />
      </div>
    </MenuContentContext.Provider>
  );
};
