"use client";

import { ProposalText } from "@/components/ProposalText";
import { ProposalDetail } from "@/components/ProposalDetail";
import { VotingStatus } from "@/components/VotingStatus";
import { CastYourVote } from "@/components/CastYourVote";
import { api } from "@/trpc/react";
import { useGetProposalsIds } from "@/hooks/useGetProposals";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";

export function ProposalContent({ proposalId }: { proposalId: string }) {
  const { data } = useGetProposalDetail({ proposalId });

  return (
    <div className="flex flex-col gap-2024_L px-2024_L sm:max-w-[1040px] lg:flex-row">
      <div className="mx-auto flex w-full basis-1 flex-col items-center justify-center gap-2024_3XL sm:gap-2024_5XL md:basis-2/3">
        <ProposalText proposalId={proposalId} />
        <CastYourVote />
      </div>
      <div className="order-first flex basis-1 flex-col gap-2024_XL md:basis-1/3 lg:order-last">
        <ProposalDetail proposalId={proposalId} />
        <VotingStatus />
      </div>
    </div>
  );
}
