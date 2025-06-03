"use client";

import { SectionLayout } from "./SectionLayout";
import { VoteIndicator } from "./ui/legacy/VoteIndicator";
import { VoteProgressBar } from "./VoteProgressBar";
import { GradientProgressBar } from "./ui/legacy/GradientProgressBar";
import { Text } from "@/components/ui/legacy/Text";
import { YourVote } from "@/components/YourVote";
import { YourReward } from "@/components/YourReward";
import { NSAmount } from "@/components/ui/legacy/NSAmount";

import {
  useGetProposalDetail,
  parseProposalVotes,
} from "@/hooks/useGetProposalDetail";
import { roundFloat } from "@/utils/roundFloat";
import NSToken from "@/icons/legacy/NSToken";
import { CoinFormat, formatBalance } from "@/utils/coins";
import { useCalcVotingStats } from "@/hooks/useCalcVotingStats";
import { useIsPersonVote } from "@/hooks/useIsPersonVote";

function MinimumThreshHold({
  isReached,
  totalVotes,
  threshold,
}: {
  totalVotes: number;
  isReached: boolean;
  threshold: number;
}) {
  const percentage = Math.min(
    roundFloat((totalVotes / threshold) * 100, 2),
    100,
  );

  return (
    <div className="gap-2024_R rounded-12 bg-2024_fillBackground-secondary-Highlight/40 px-2024_R py-2024_R flex w-full flex-col items-center justify-between">
      <div className="gap-2024_R flex w-full items-center justify-between">
        <Text
          variant="B6/bold"
          color="fillContent-primary"
          className="flex basis-3/5 items-start"
        >
          Votes Cast
        </Text>
        <div className="gap-2024_R flex basis-1/5 items-center justify-end">
          <Text
            variant="P3/medium"
            color="fillContent-secondary"
            className="flex max-w-[43px] basis-1/5 justify-end"
          >
            {percentage}%
          </Text>
          <div className="flex basis-1/5 items-center justify-end gap-1">
            <Text
              variant="P3/medium"
              color="fillContent-secondary"
              className="flex justify-end"
            >
              {formatBalance({
                balance: totalVotes,
                decimals: 0,
                format: CoinFormat.FULL,
              })}
            </Text>
            <NSToken className="h-3 w-3" color="white" />
          </div>
        </div>
      </div>
      <GradientProgressBar percentage={percentage} />
      <div className="flex w-full items-center justify-between gap-1">
        <Text
          variant="B7/regular"
          color="fillContent-secondary"
          className="font-paragraph flex items-center !tracking-tighter"
        >
          Minimum Voting Threshold:{" "}
          {formatBalance({
            balance: threshold,
            decimals: 0,
            format: CoinFormat.ROUNDED,
          })}{" "}
          $NS
        </Text>

        <Text
          variant="B7/regular"
          className="font-paragraph"
          color={isReached ? "cyan" : "warning"}
        >
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
  hidePercentage?: boolean;
  isPersonVote?: boolean;
};

export function VotingState({
  votedState,
  percentage,
  votes,
  onlyStatus,
  hidePercentage,
  isPersonVote,
}: VotedStateProps) {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex items-start">
        <VoteIndicator
          votedStatus={votedState}
          onlyStatus={onlyStatus}
          isPersonVote={isPersonVote}
        />
      </div>
      <div className="flex min-w-[100px] basis-1/2 flex-row items-end justify-between gap-3">
        {percentage !== undefined && !hidePercentage && (
          <Text
            variant="P3/medium"
            color="fillContent-secondary"
            className="flex min-w-[60px] justify-end"
          >
            {percentage}%
          </Text>
        )}
        <NSAmount amount={votes} />
      </div>
    </div>
  );
}

export function VotingStatus({
  proposalId,
  progressOnly,
}: {
  proposalId: string;
  progressOnly?: boolean;
}) {
  const { data, isLoading } = useGetProposalDetail({ proposalId });
  const isPersonVote = useIsPersonVote(proposalId);
  const resp = data ? parseProposalVotes(data) : null;
  const stats = useCalcVotingStats({
    ...resp,
    threshold: Number(data?.fields.threshold),
    isPersonVote,
  });

  if (isLoading || !resp) return null;

  if (progressOnly)
    return (
      <VoteProgressBar
        yesVotes={stats.yesVotes}
        noVotes={stats.noVotes}
        abstainVotes={stats.abstainVotes}
      />
    );

  return (
    <SectionLayout title="Voting Status">
      <VoteProgressBar
        yesVotes={stats.yesVotes}
        noVotes={stats.noVotes}
        abstainVotes={stats.abstainVotes}
      />
      <div className="flex flex-col justify-between gap-2">
        {stats.status.map((voting) => (
          <VotingState
            key={voting.votedState}
            votedState={voting.votedState}
            percentage={voting.percentage}
            votes={voting.votes}
            onlyStatus
            isPersonVote={isPersonVote}
          />
        ))}
      </div>
      <MinimumThreshHold
        isReached={stats.thresholdReached}
        totalVotes={stats.totalVotes}
        threshold={stats.threshold}
      />

      <YourVote proposalId={proposalId} />
      <YourReward proposalId={proposalId} />
    </SectionLayout>
  );
}
