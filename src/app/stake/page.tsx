"use client";

import { StakeContent } from "@/components/staking/StakeContent";
import { StakeModalContent } from "@/components/staking/StakeModalContent";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useGetOwnedNSBalance } from "@/hooks/useGetOwnedNSBalance";

export default function StakePage() {
  const currAcct = useCurrentAccount();
  const currAddr = currAcct?.address;
  const balance = useGetOwnedNSBalance(currAddr);
  const availableNS = balance.data ? BigInt(balance.data.totalBalance) : 0n;

  return (
    <div className="dummy-ui">
      <StakeContent />
      <StakeModalContent availableNS={availableNS} />
    </div>
  );
}
