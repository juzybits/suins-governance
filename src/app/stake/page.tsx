"use client";

import { StakeContent } from "@/components/StakeContent";
import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import { useGetStakingBatches } from "@/hooks/staking/useGetStakingBatches";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { useGetBalance } from "@/hooks/useGetBalance";
import { NETWORK } from "@/constants/env";

export default function StakePage() {
  const currAcct = useCurrentAccount();
  const batches = useGetStakingBatches(currAcct?.address);
  const balance = useGetBalance({
      owner: currAcct?.address,
      coinType: SUINS_PACKAGES[NETWORK].votingTokenType,
    });

  if (batches.isLoading || balance.isLoading) {
    return <Loader className="h-5 w-5" />;
  }

  if (batches.error || balance.error) {
    return <div>Error: {batches.error?.message || balance.error?.message}</div>;
  }

  return (
    <Suspense fallback={<Loader className="h-5 w-5" />}>
      <StakeContent
        batches={batches.data ?? []}
        availableNS={balance.data ? BigInt(balance.data.totalBalance) : 0n}
      />
    </Suspense>
  );
}
