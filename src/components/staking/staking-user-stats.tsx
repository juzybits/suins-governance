"use client";

import { useGetUserStakingData } from "@/hooks/staking/useGetUserStakingData";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useGetOwnedNSBalance } from "@/hooks/useGetOwnedNSBalance";
import { type FC } from "react";
import { type StakingUserStarsProps } from "./staking.types";
import Card from "../ui/card";
import LockSVG from "@/icons/lock";
import StakeSVG from "@/icons/stake";
import VoteSVG from "@/icons/vote";
import clsx from "clsx";
import WalletSVG from "@/icons/wallet";
import { formatNSBalance } from "@/utils/coins";
import { useBreakpoint } from "@/hooks/useBreakpoint";

export const StakingUserStats: FC<StakingUserStarsProps> = ({ showTokens }) => {
  const currAcct = useCurrentAccount();
  const userStaking = useGetUserStakingData(currAcct?.address);
  const balance = useGetOwnedNSBalance(currAcct?.address);

  const mdGte = useBreakpoint("md");
  const lgGte = useBreakpoint("lg");
  const xlGte = useBreakpoint("xl");

  if (userStaking.data === undefined || balance.data === undefined) return null;

  const stats = userStaking.data.stats;

  return (
    <div
      className={clsx(
        "grid md:gap-l",
        showTokens
          ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "md:grid-cols-2 lg:grid-cols-3",
      )}
    >
      <Card
        withBorder
        subValueGradient
        valueSuffix="NS"
        title="Total Locked"
        subValueSuffix="Votes"
        value={formatNSBalance(stats.lockedNS)}
        active={Boolean(Number(stats.lockedNS))}
        subValue={formatNSBalance(stats.lockedPower)}
        icon={<LockSVG width="100%" className="max-h-[2rem] max-w-[2rem]" />}
      />
      <Card
        subValueGradient
        valueSuffix="NS"
        title="Total Staked"
        subValueSuffix="Votes"
        withBorder={lgGte || !mdGte}
        value={formatNSBalance(stats.stakedNS)}
        subValue={formatNSBalance(stats.stakedPower)}
        active={Boolean(Boolean(Number(stats.stakedNS)))}
        icon={<StakeSVG width="100%" className="max-w-[2rem]" />}
      />
      <hr className="col-span-2 hidden border-0 border-b border-[#6E609F80] md:block lg:hidden" />
      <Card
        valueGradient
        title="Your Total Votes"
        earnMoreVotes={!showTokens}
        value={formatNSBalance(stats.totalPower)}
        active={Boolean(Number(stats.totalPower))}
        withBorder={showTokens && (xlGte || !lgGte)}
        icon={<VoteSVG width="100%" className="max-w-[2rem]" />}
      />
      {showTokens && (
        <hr className="col-span-3 hidden border-0 border-b border-[#6E609F80] lg:block xl:hidden" />
      )}
      {showTokens && (
        <Card
          valueSuffix="NS"
          title="Available Tokens"
          value={balance.data.formatted}
          subValue={
            stats.cooldownNS > 0n
              ? formatNSBalance(stats.cooldownNS)
              : undefined
          }
          subValueSuffix={stats.cooldownNS > 0n ? "In cooldown" : undefined}
          subValueGradient
          active={Boolean(Number(balance.data.raw))}
          icon={<WalletSVG width="100%" className="max-w-[2rem]" />}
        />
      )}
    </div>
  );
};
