"use client";

import { SectionLayout } from "./SectionLayout";
import { VoteIndicator } from "./ui/VoteIndicator";
import { VoteProgressBar } from "./VoteProgressBar";
import { GradientProgressBar } from "./ui/GradientProgressBar";
import { Text } from "@/components/ui/Text";
import { YourVote } from "@/components/YourVote";
import { NSAmount } from "@/components/ui/NSAmount";

import {
  useGetProposalDetail,
  parseProposalVotes,
} from "@/hooks/useGetProposalDetail";
import { roundFloat } from "@/utils/roundFloat";
import NSToken from "@/icons/NSToken";
import { formatAmountParts } from "@/utils/coins";
import { THREAD_HOLD } from "@/constants/common";

function MinimumThreshHold({
  thresholdPercentage,
  isReached,
  totalVotes,
}: {
  thresholdPercentage: number;
  totalVotes: number;
  isReached: boolean;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-2024_R rounded-12 bg-2024_fillBackground-secondary-Highlight/40 px-2024_R py-2024_R">
      <div className="flex w-full items-center justify-between gap-2024_R">
        <Text
          variant="B6/bold"
          color="fillContent-primary"
          className="flex basis-3/5 items-start"
        >
          Votes Casted
        </Text>
        <div className="flex basis-1/5 items-center justify-end gap-2024_R">
          <div className="flex basis-1/5 items-center justify-end gap-1">
            <Text
              variant="P3/medium"
              color="fillContent-secondary"
              className="flex justify-end"
            >
              {formatAmountParts(totalVotes)}
            </Text>
            <NSToken className="h-3 w-3" color="white" />
          </div>
        </div>
        <Text
          variant="P3/medium"
          color="fillContent-secondary"
          className="flex max-w-[43px] basis-1/5 justify-end"
        >
          {thresholdPercentage}%
        </Text>
      </div>
      <GradientProgressBar percentage={thresholdPercentage} />
      <div className="flex w-full items-center justify-between gap-1">
        <Text
          variant="B7/regular"
          color="fillContent-secondary"
          className="!tracking-tighter"
        >
          Minimum Voting Threshold: {1}%
        </Text>
        <Text variant="B7/regular" color={isReached ? "cyan" : "warning"}>
          {isReached ? "Reached" : "Not Reached"}
        </Text>
      </div>
    </div>
  );
}

type VotedStateProps = {
  votedState: "Yes" | "No" | "Abstain";
  percentage?: number;
  votes: number;
  onlyStatus?: boolean;
  roundedCoinFormat?: boolean;
  noFormat?: boolean;
};

export function VotingState({
  votedState,
  percentage,
  votes,
  onlyStatus,
  roundedCoinFormat,
  noFormat,
}: VotedStateProps) {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex basis-3/5 items-start">
        <VoteIndicator votedStatus={votedState} onlyStatus={onlyStatus} />
      </div>
      <NSAmount
        amount={votes}
        roundedCoinFormat={roundedCoinFormat}
        noFormat={noFormat}
      />
      {percentage !== undefined && (
        <Text
          variant="P3/medium"
          color="fillContent-secondary"
          className="flex min-w-[60px] justify-end"
        >
          {percentage}%
        </Text>
      )}
    </div>
  );
}

export function VotingStatus({ proposalId }: { proposalId: string }) {
  const { data, isLoading } = useGetProposalDetail({ proposalId });
  console.log(data);

  const resp = data ? parseProposalVotes(data) : null;
  console.log(resp);

  const totalVotes =
    (resp?.yesVote ?? 0) + (resp?.noVote ?? 0) + (resp?.abstainVote ?? 0);

  const yesVotesPecentage = roundFloat(
    ((resp?.yesVote ?? 0) / totalVotes) * 100,
  );
  const totalVotesFormatted = formatAmountParts(totalVotes);

  const noVotesPecentage = roundFloat(((resp?.noVote ?? 0) / totalVotes) * 100);
  const abstainVotesPecentage = roundFloat(
    ((resp?.abstainVote ?? 0) / totalVotes) * 100,
  );

  const ThresholdPercentage = roundFloat((totalVotes / THREAD_HOLD) * 100);

  if (isLoading) return null;
  return (
    <SectionLayout title="Voting Status">
      <VoteProgressBar
        yesVotes={resp?.yesVote ?? 0}
        noVotes={resp?.noVote ?? 0}
        abstainVotes={resp?.abstainVote ?? 0}
      />
      <div className="flex flex-col justify-between gap-2">
        <VotingState
          votedState="Yes"
          percentage={yesVotesPecentage}
          votes={resp?.yesVote ?? 0}
          onlyStatus
          noFormat
        />
        <VotingState
          votedState="No"
          percentage={noVotesPecentage}
          votes={resp?.noVote ?? 0}
          onlyStatus
          noFormat
        />
        <VotingState
          votedState="Abstain"
          percentage={abstainVotesPecentage}
          votes={resp?.abstainVote ?? 0}
          onlyStatus
          noFormat
        />
      </div>
      <MinimumThreshHold
        thresholdPercentage={ThresholdPercentage}
        isReached={totalVotes >= THREAD_HOLD}
        totalVotes={totalVotes}
      />

      <YourVote proposalId={proposalId} />
    </SectionLayout>
  );
}
