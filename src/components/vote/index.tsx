"use client";

import { ProposalText } from "@/components/vote/ProposalText";
import { ProposalDetail } from "@/components/vote/ProposalDetail";
import { VotingStatus } from "@/components/vote/VotingStatus";
import { CastYourVoteV2 } from "@/components/vote/CastYourVoteV2";
import { Votes } from "@/components/vote/Votes";
import { VoteBg } from "./vote-bg";

export const Voting = ({ proposalId }: { proposalId: string }) => (
  <>
    <ProposalDetail proposalId={proposalId} />
    <VotingStatus proposalId={proposalId} />
  </>
);

export function ProposalContent({ proposalId }: { proposalId: string }) {
  return (
    <div>
      <VoteBg />
      <div className="mx-auto flex w-full max-w-[62.5rem] flex-col gap-3xl px-l sm:mt-[15rem] xl:flex-row">
        <div className="flex w-full flex-col gap-3xl sm:gap-4xl md:basis-2/3">
          <ProposalText proposalId={proposalId} />
          <CastYourVoteV2 proposalId={proposalId} />
          <Votes proposalId={proposalId} />
        </div>
        <div className="hidden flex-col gap-xl md:sticky md:h-[987px] md:min-h-fit md:basis-1/3 xl:sticky xl:top-0 xl:flex">
          <Voting proposalId={proposalId} />
        </div>
      </div>
    </div>
  );
}
