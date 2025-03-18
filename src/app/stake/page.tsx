"use client";

import { StakeContent } from "@/components/StakeContent";
import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import { useGetStakingBatches } from "@/hooks/useGetStakingBatches";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function StakePage() {
  const currAcct = useCurrentAccount();
  const { data, isLoading, error } = useGetStakingBatches(currAcct?.address);

  if (isLoading) return <Loader className="h-5 w-5" />;

  if (error ) return <div>Error:{error?.message}</div>;
  return (
    <Suspense fallback={<Loader className="h-5 w-5" />}>
      <StakeContent stakeBatches={data ?? []} />
    </Suspense>
  );
}
