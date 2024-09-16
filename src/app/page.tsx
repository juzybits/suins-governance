"use client";

import { useGetProposalsIds } from "@/hooks/useGetProposals";
import { ProposalContent } from "@/components/ProposalContent";

export default function Claim() {
  const { data } = useGetProposalsIds();
  console.log(data);
  return <ProposalContent proposalId={data?.[0]?.[0] ?? ""} />;
}
