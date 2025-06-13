"use client";

import { ProposalText } from "@/components/ProposalText";
import { ProposalDetail } from "@/components/ProposalDetail";
import { VotingStatus } from "@/components/VotingStatus";
import { CastYourVoteV2 } from "@/components/CastYourVoteV2";
import { Votes } from "@/components/Votes";
import { ProposalPricePool } from "@/components/ProposalPricePool";
import { StakingUserStats } from "@/components/staking/staking-user-stats";

export function ProposalContent({ proposalId }: { proposalId: string }) {
  return (
    <div className="flex w-full flex-col gap-2024_L px-2024_L sm:max-w-[1100px] lg:flex-row">
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-2024_3XL sm:gap-2024_5XL md:basis-2/3">
        <ProposalText proposalId={proposalId} />
        <CastYourVoteV2 proposalId={proposalId} />
        <div className="dummy-ui">
          <StakingUserStats showTokens={false} />
        </div>
        <Votes proposalId={proposalId} />
      </div>
      <div className="order-first flex flex-col gap-2024_XL md:sticky md:h-[987px] md:min-h-fit md:basis-1/3 md:pt-10 lg:sticky lg:top-0 lg:order-last">
        <ProposalDetail proposalId={proposalId} />
        <VotingStatus proposalId={proposalId} />
        <ProposalPricePool proposalId={proposalId} />
      </div>
    </div>
  );
}
