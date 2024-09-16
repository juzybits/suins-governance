"use client";

import Link from "next/link";

import { SuiNSLogo } from "@/components/SuiNSLogo";
import { ConnectWallet } from "@/components/WalletConnet/ConnectWallet";
import { cn } from "@/utils/cn";
import { ProposalsMenu } from "@/components/ProposalsMenu";

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
  return (
    <div className="z-10 mx-auto flex w-full flex-col items-center justify-center gap-2024_XL pt-2024_L sm:gap-2024_3XL">
      <div
        className={cn(
          "min-lg:px-2024_3XL relative z-[1000] -mx-4 flex w-screen flex-row flex-wrap items-center px-2024_L",
          className,
        )}
      >
        <div
          className={cn(
            "flex w-full items-center justify-between gap-2024_2XL",
          )}
        >
          <Link href="/" className="w-[200px]" onClick={logoAction}>
            <SuiNSLogo
              variant={logoVariant}
              className="h-2024_2XL sm:h-2024_3XL"
            />
          </Link>

          <div className="flex items-center gap-2024_S">
            <ProposalsMenu />
            <div className="flex max-w-[200px] justify-end">
              <ConnectWallet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
