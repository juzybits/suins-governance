"use client";

import { useGetUserStakingData } from "@/hooks/staking/useGetUserStakingData";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useGetOwnedNSBalance } from "@/hooks/useGetOwnedNSBalance";
import { useStakeModal } from "./staking-modal-context";
import LockSVG from "@/icons/lock";
import StakeSVG from "@/icons/stake";
import { Button } from "../ui/button";
import Typography from "../ui/typography";

export function StakeHeaderButtons() {
  const currAcct = useCurrentAccount();
  const currAddr = currAcct?.address;

  const balance = useGetOwnedNSBalance(currAddr);
  const availableNS = balance.data ? balance.data.raw : 0n;

  const userStaking = useGetUserStakingData(currAddr);
  const ownedBatches = userStaking.data?.batches ?? [];

  const { openModal } = useStakeModal();

  if (availableNS === 0n || ownedBatches.length === 0) return null;

  return (
    <>
      <Button
        onClick={openModal("stake")}
        variant="solid/medium"
        className="bg-bg-good"
        before={<StakeSVG width="100%" style={{ maxWidth: "1rem" }} />}
      >
        <Typography variant="label/Large Bold">Stake</Typography>
      </Button>
      <Button
        onClick={openModal("lock")}
        variant="solid/medium"
        before={<LockSVG width="100%" style={{ maxWidth: "1rem" }} />}
      >
        <Typography variant="label/Large Bold">Lock</Typography>
      </Button>
    </>
  );
}
