"use client";

import { formatNSBalance } from "@/utils/formatNumber";
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

export const StakingUserStats: FC<StakingUserStarsProps> = ({ showTokens }) => {
  const currAcct = useCurrentAccount();
  const userStaking = useGetUserStakingData(currAcct?.address);
  const balance = useGetOwnedNSBalance(currAcct?.address);

  if (userStaking.data === undefined || balance.data === undefined) return null;

  const stats = userStaking.data.stats;

  return (
    <div className={clsx("grid", showTokens ? "grid-cols-4" : "grid-cols-3")}>
      <Card
        title="Total Locked"
        icon={<LockSVG width="100%" className="max-w-[1.5rem]" />}
        value={formatNSBalance(stats.lockedNS)}
        subValue={`${formatNSBalance(stats.lockedPower)} Votes`}
      />
      <Card
        withBorder
        title="Total Staked"
        value={formatNSBalance(stats.stakedNS)}
        subValue={`${formatNSBalance(stats.stakedPower)} Votes`}
        icon={<StakeSVG width="100%" className="max-w-[1.5rem]" />}
      />
      <Card
        withBorder
        title="Your Total Votes"
        value={formatNSBalance(stats.totalPower)}
        icon={<VoteSVG width="100%" className="max-w-[1.5rem]" />}
      />
      {showTokens && (
        <Card
          withBorder
          title="Available Tokens"
          value={`${balance.data.formatted} NS`}
          icon={<WalletSVG width="100%" className="max-w-[1.5rem]" />}
        />
      )}
    </div>
  );
};
