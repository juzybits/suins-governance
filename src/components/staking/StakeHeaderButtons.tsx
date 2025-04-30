"use client";

import { useGetUserStakingData } from "@/hooks/staking/useGetUserStakingData";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useGetOwnedNSBalance } from "@/hooks/useGetOwnedNSBalance";
import { useStakeModal } from "./StakeModalContext";

export function StakeHeaderButtons() {
  const currAcct = useCurrentAccount();
  const currAddr = currAcct?.address;

  const balance = useGetOwnedNSBalance(currAddr);
  const availableNS = balance.data ? balance.data.raw : 0n;

  const userStaking = useGetUserStakingData(currAddr);
  const ownedBatches = userStaking.data?.batches ?? [];

  const { openModal } = useStakeModal();

  if (availableNS === 0n || ownedBatches.length === 0) {
    return null;
  }

  return (
    <>
      <button
        className="rounded bg-green-400 px-4 py-2"
        onClick={() => openModal("stake")}
      >
        Stake
      </button>
      <button
        className="rounded bg-blue-400 px-4 py-2"
        onClick={() => openModal("lock")}
      >
        Lock
      </button>
    </>
  );
}
