"use client";

import { StakeContent } from "@/components/staking";
import { StakeModalContent } from "@/components/staking/StakeModalContent";

export default function StakePage() {
  return (
    <div className="p-xl">
      <StakeContent />
      <StakeModalContent />
    </div>
  );
}
