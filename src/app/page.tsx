"use client";

import { useGetProposalsIds } from "@/hooks/useGetProposals";
import { ProposalContent } from "@/components/ProposalContent";

export default function HomePage() {
  const { data } = useGetProposalsIds();
  const proposals = data ? Object.values(data) : [];
  // TODO : verify the best way to get the latest proposal
  const latestProposal = proposals?.[0]?.length ? proposals[0].at(-1) : null;

  // TODO: Add a loading state
  if (!latestProposal) return null;

  return <ProposalContent proposalId={latestProposal} />;
}
