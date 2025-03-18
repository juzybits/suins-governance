"use client";

import { StakeContent } from "@/components/StakeContent";
import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import { useGetProposalsIds } from "@/hooks/useGetProposals";

export default function StakePage() {
  const { data, isLoading, error } = useGetProposalsIds();

  if (isLoading) return <Loader className="h-5 w-5" />;

  if (error || !data?.[0]?.fields) return <div>Error: {error?.message}</div>;
  return (
    <Suspense fallback={<Loader className="h-5 w-5" />}>
      <StakeContent />
    </Suspense>
  );
}
