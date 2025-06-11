"use client";

import { StakeContent } from "@/components/staking";
import { StakingModal } from "@/components/staking/staking-modal";

export default function StakePage() {
  return (
    <div className="flex flex-1 flex-col p-xl">
      <StakeContent />
      <StakingModal />
    </div>
  );
}
