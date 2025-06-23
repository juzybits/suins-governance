"use client";

import { ProposalContent } from "@/components/vote";
import { Suspense } from "react";
import Loader from "@/components/ui/legacy/Loader";
import { useGetAllProposals } from "@/hooks/useGetAllProposals";
import Typography from "@/components/ui/typography";

export default function VotePage() {
  const { data, isLoading, error } = useGetAllProposals();

  if (isLoading) return <Loader className="h-5 w-5" />;

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-s rounded-l-s rounded-r-s bg-[#62519C2E] px-3xl py-4xl text-center">
        <Typography variant="heading/Small Bold" className="text-bg-error">
          Error loading proposals
        </Typography>
        <Typography
          variant="paragraph/Large"
          className="max-w-[30rem] text-center text-secondary"
        >
          {error.message ?? "Unable to load proposal data"}
        </Typography>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-s rounded-l-s rounded-r-s bg-[#62519C2E] px-3xl py-4xl text-center">
        <Typography variant="heading/Small Bold" className="text-primary-main">
          No proposals available
        </Typography>
        <Typography
          variant="paragraph/Large"
          className="max-w-[30rem] text-center text-secondary"
        >
          There are currently no governance proposals to vote on. Check back
          later for new proposals.
        </Typography>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loader className="h-5 w-5" />}>
      <ProposalContent proposalId={data[0]!.fields.id.id} />
    </Suspense>
  );
}
