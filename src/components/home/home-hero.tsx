import StakeSVG from "@/icons/stake";
import VoteSVG from "@/icons/vote";
import { useCurrentAccount, useCurrentWallet } from "@mysten/dapp-kit";
import { type FC } from "react";
import { Button } from "../ui/button";
import Typography from "../ui/typography";
import { ConnectWalletButton } from "../wallet/connect-wallet-button";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import clsx from "clsx";

export const HomeHero: FC = () => {
  const currAcct = useCurrentAccount();
  const isNotMobile = useBreakpoint("sm");
  const { isConnecting, isDisconnected } = useCurrentWallet();
  const isLoggedOut = (!currAcct && !isConnecting) ?? isDisconnected;

  return (
    <div className="my-5xl px-s pt-5xl">
      <div className="flex flex-col items-center gap-3xl">
        <h1 className="all-unset">
          <Typography
            variant={isNotMobile ? "display/XLarge" : "display/Regular"}
            className="flex max-w-[15ch] text-center text-primary-main"
          >
            Stake Your SuiNS Tokens & Earn Votes
          </Typography>
        </h1>
        <h2 className="all-unset">
          <Typography
            className="flex text-center text-secondary"
            variant={
              isNotMobile ? "heading/Small Medium" : "heading/Regular Regular"
            }
          >
            Participate in governance, earn rewards,
            {isNotMobile && <br />} and shape the future of SuiNS
          </Typography>
        </h2>
        {isLoggedOut ? (
          <div className={clsx("flex", !isNotMobile && "w-full")}>
            <ConnectWalletButton variant="tall/gradientB" className="w-auto" />
          </div>
        ) : (
          <div className={clsx("flex gap-s", !isNotMobile && "w-full")}>
            <Button
              href="/stake"
              className={clsx("bg-bg-good", !isNotMobile && "flex-1")}
              variant="solid/large"
              before={<StakeSVG width="100%" className="max-w-[1.25rem]" />}
            >
              <Typography variant="label/Large Bold">Stake</Typography>
            </Button>
            <Button
              href="/vote"
              className={clsx("bg-link", !isNotMobile && "flex-1")}
              variant="solid/large"
              before={<VoteSVG width="100%" className="max-w-[1.25rem]" />}
            >
              <Typography variant="label/Large Bold">Vote</Typography>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
