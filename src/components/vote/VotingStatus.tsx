"use client";

import { SectionLayout } from "./SectionLayout";
import { VoteIndicator } from "../ui/legacy/VoteIndicator";
import { VoteProgressBar } from "./VoteProgressBar";
import { GradientProgressBar } from "../ui/legacy/GradientProgressBar";
import { YourVote } from "@/components/vote/YourVote";
import { YourReward } from "@/components/vote/YourReward";
import { NSAmount } from "@/components/ui/legacy/NSAmount";

import {
  useGetProposalDetail,
  parseProposalVotes,
} from "@/hooks/useGetProposalDetail";
import { roundFloat } from "@/utils/roundFloat";
import { CoinFormat, formatBalance, formatNSBalance } from "@/utils/coins";
import { useCalcVotingStats } from "@/hooks/useCalcVotingStats";
import { useIsPersonVote } from "@/hooks/useIsPersonVote";
import Typography from "../ui/typography";
import clsx from "clsx";

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
    <div className="flex w-full flex-col items-center justify-between gap-m rounded-l-xs rounded-r-xs bg-[#62519C66] px-s py-s">
      {!isReached && (
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-start">
            <Typography
              variant="label/Regular Bold"
              className="text-primary-main"
            >
              Votes Cast
            </Typography>
          </div>
          <div className="flex min-w-[100px] basis-1/2 flex-row items-end justify-between gap-3">
            <Typography
              variant="label/Small Medium"
              className="flex min-w-[60px] justify-end text-secondary"
            >
              {percentage}%
            </Typography>
            <NSAmount amount={totalVotes} />
          </div>
        </div>
      )}
      {!isReached && <GradientProgressBar percentage={percentage} />}
      <div className="flex w-full items-center justify-between gap-1">
        <Typography variant="paragraph/XSmall" className="text-secondary">
          Minimum Voting Threshold:{" "}
          {formatBalance({
            balance: threshold,
            decimals: 6,
            format: CoinFormat.ROUNDED,
          })}{" "}
          Votes
        </Typography>
        <Typography
          variant="paragraph/XSmall"
          className={clsx(
            isReached ? "text-semantic-perfect" : "text-semantic-warning",
          )}
        >
          {isReached ? "Reached" : "Not Reached"}
        </Typography>
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
        <Typography
          variant="label/Small Medium"
          className="flex min-w-[60px] justify-end text-secondary"
        >
          {formatNSBalance(votes)}
        </Typography>
        {percentage !== undefined && !hidePercentage && (
          <Typography
            variant="label/Small Medium"
            className="flex min-w-[60px] justify-end text-secondary"
          >
            {percentage}%
          </Typography>
        )}
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
