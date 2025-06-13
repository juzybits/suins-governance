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

export const StakingUserStats: FC<StakingUserStarsProps> = ({ showTokens }) => {
  const currAcct = useCurrentAccount();
  const userStaking = useGetUserStakingData(currAcct?.address);
  const balance = useGetOwnedNSBalance(currAcct?.address);

  if (userStaking.data === undefined || balance.data === undefined) return null;

  const stats = userStaking.data.stats;

  return (
    <div className={clsx("grid", showTokens ? "grid-cols-4" : "grid-cols-3")}>
      <Card
        subValueGradient
        valueSuffix="NS"
        title="Total Locked"
        subValueSuffix="Votes"
        value={formatNSBalance(stats.lockedNS)}
        active={Boolean(Number(stats.lockedNS))}
        subValue={formatNSBalance(stats.lockedPower)}
        icon={<LockSVG width="100%" className="max-w-[1.5rem]" />}
      />
      <Card
        withBorder
        subValueGradient
        valueSuffix="NS"
        title="Total Staked"
        subValueSuffix="Votes"
        value={formatNSBalance(stats.stakedNS)}
        subValue={formatNSBalance(stats.stakedPower)}
        active={Boolean(Boolean(Number(stats.stakedNS)))}
        icon={<StakeSVG width="100%" className="max-w-[1.5rem]" />}
      />
      <Card
        withBorder
        valueGradient
        title="Your Total Votes"
        active={Boolean(Number(stats.totalPower))}
        value={formatNSBalance(stats.totalPower)}
        icon={<VoteSVG width="100%" className="max-w-[1.5rem]" />}
      />
      {showTokens && (
        <Card
          withBorder
          valueSuffix="NS"
          title="Available Tokens"
          value={balance.data.formatted}
          active={Boolean(Number(balance.data.raw))}
          icon={<WalletSVG width="100%" className="max-w-[1.5rem]" />}
        />
      )}
    </div>
  );
};
