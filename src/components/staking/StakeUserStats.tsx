"use client";

import { formatNSBalance } from "@/utils/coins";
import { useGetUserStakingData } from "@/hooks/staking/useGetUserStakingData";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useGetOwnedNSBalance } from "@/hooks/useGetOwnedNSBalance";

export function StakeUserStats({ showTokens }: { showTokens: boolean }) {
  const currAcct = useCurrentAccount();
  const userStaking = useGetUserStakingData(currAcct?.address);
  const balance = useGetOwnedNSBalance(currAcct?.address);

  if (userStaking.data === undefined || balance.data === undefined) {
    return null;
  }

  const stats = userStaking.data.stats;

  return (
    <div className="panel">
      <div>
        <p>
          Total Locked: {formatNSBalance(stats.lockedNS)} NS (
          {formatNSBalance(stats.lockedPower)} Votes)
        </p>
        <p>
          Total Staked: {formatNSBalance(stats.stakedNS)} NS (
          {formatNSBalance(stats.stakedPower)} Votes)
        </p>
        <p>Your Total Votes: {formatNSBalance(stats.totalPower)}</p>
        {showTokens && <p>Available Tokens: {balance.data.formatted} NS</p>}
      </div>
    </div>
  );
}
