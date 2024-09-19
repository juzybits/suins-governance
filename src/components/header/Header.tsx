"use client";

import Link from "next/link";

import { SuiNSLogo } from "@/components/SuiNSLogo";
import { ConnectWallet } from "@/components/WalletConnet/ConnectWallet";
import { cn } from "@/utils/cn";
import { ProposalsMenu } from "@/components/ProposalsMenu";
import { GradientBorder } from "../gradient-border";
import { Text } from "../ui/Text";
import { NETWORK } from "@/constants/env";
import { useGetTestTokenMutation } from "@/hooks/useGetTestTokenMutation";
import { ToastContainer, toast } from "react-toastify";

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
  const getTokens = useGetTestTokenMutation({
    onSuccess: () => {
      toast("Testnet NS token sent to your address", {
        position: "bottom-right",
        autoClose: 10000,
        hideProgressBar: true,
        closeButton: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        bodyStyle: {
          backgroundColor: "#4BFFA6",
          color: "#221C36",
          fontSize: "18px",
          fontWeight: "bold",
          borderRadius: "20px",
          height: "42px",
          padding: "0px important",
          lineHeight: "100%",
        },
        className:
          "!bg-[#4BFFA6] !h-[22px] !w-full !text-[18px] !py-0 !rounded-[20px] !px-[24px] !py-[12px]",
        progress: undefined,
      });
    },
    onError: (error) => {
      toast(error.message, {
        position: "bottom-right",
        autoClose: 10000,
        hideProgressBar: true,
        closeButton: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        bodyStyle: {
          backgroundColor: "#FF1D53",
          color: "#FFFFFF",
          fontSize: "18px",
          fontWeight: "bold",
          borderRadius: "20px",

          padding: "0px important",
          lineHeight: "100%",
        },
        className:
          "!bg-[#FF1D53] !h-[22px] !w-full !text-[18px] !py-0 !rounded-[20px] !px-[24px] !py-[12px]",
        progress: undefined,
      });
    },
  });
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
            {NETWORK === "testnet" && (
              <button
                className="w-full rounded-2024_S bg-transparent md:w-fit"
                onClick={getTokens.mutate}
              >
                <GradientBorder
                  variant="green_pink_blue"
                  animateOnHover
                  className="flex w-full items-center justify-center rounded-2024_S border-2 bg-[#62519c66] px-2024_S py-2024_M"
                >
                  <Text
                    variant="B6/bold"
                    color="fillContent-primary"
                    className="leading-none"
                  >
                    $NS
                  </Text>
                </GradientBorder>
              </button>
            )}

            <ProposalsMenu />
            <div className="flex max-w-[200px] justify-end">
              <ConnectWallet />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
