import { ProposalContent } from "@/components/ProposalContent";
import { api } from "@/trpc/server";
import { Suspense } from "react";
import Loader from "@/components/ui/Loader";

export default async function HomePage() {
  const data = await api.post.getIsProposalActive();
  const latestProposal = data?.isProposalActive ?? data?.defaultProposalId;

  return (
    <Suspense fallback={<Loader className="h-5 w-5" />}>
      <ProposalContent proposalId={latestProposal ?? ""} />
    </Suspense>
  );
}
