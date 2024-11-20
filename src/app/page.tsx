"use client";

import { ProposalContent } from "@/components/ProposalContent";
import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import { useGetProposalsIds } from "@/hooks/useGetProposals";

export default function HomePage() {
  const { data, isLoading, error } = useGetProposalsIds();
  console.log(data);
  if (isLoading) return <Loader className="h-5 w-5" />;

  if (error || !data?.[0]?.fields) return <div>Error: {error?.message}</div>;
  return (
    <Suspense fallback={<Loader className="h-5 w-5" />}>
      <ProposalContent proposalId={data[0].fields.proposal_id} />
    </Suspense>
  );
}
