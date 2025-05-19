"use client";

import { ProposalContent } from "@/components/ProposalContent";
import { Suspense } from "react";
import Loader from "@/components/ui/legacy/Loader";
import { useGetProposalIds } from "@/hooks/useGetProposalIds";

export default function VotePage() {
  const { data, isLoading, error } = useGetProposalIds();

  if (isLoading) return <Loader className="h-5 w-5" />;

  if (error || !data?.[0]?.fields) return <div>Error: {error?.message}</div>;
  return (
    <Suspense fallback={<Loader className="h-5 w-5" />}>
      <ProposalContent proposalId={data[0].fields.proposal_id} />
    </Suspense>
  );
}
