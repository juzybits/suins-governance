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
import { CoinFormat, formatBalance } from "@/utils/coins";
import { calcVotingStats } from "@/utils/calcVotingStats";

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
    <div className="flex w-full flex-col items-center justify-between gap-2024_R rounded-12 bg-2024_fillBackground-secondary-Highlight/40 px-2024_R py-2024_R">
      <div className="flex w-full items-center justify-between gap-2024_R">
        <Text
          variant="B6/bold"
          color="fillContent-primary"
          className="flex basis-3/5 items-start"
        >
          Votes Cast
        </Text>
        <div className="flex basis-1/5 items-center justify-end gap-2024_R">
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
          className="!tracking-tighter flex items-center font-paragraph"
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
  roundedCoinFormat?: boolean;
  noFormat?: boolean;
  hidePercentage?: boolean;
};

export function VotingState({
  votedState,
  percentage,
  votes,
  onlyStatus,
  roundedCoinFormat,
  noFormat,
  hidePercentage,
}: VotedStateProps) {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex items-start">
        <VoteIndicator votedStatus={votedState} onlyStatus={onlyStatus} />
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
        <NSAmount
          amount={votes}
          roundedCoinFormat={roundedCoinFormat}
          noFormat={noFormat}
        />
      </div>
    </div>
  );
}

export function VotingStatus({ proposalId }: { proposalId: string }) {
  const { data, isLoading } = useGetProposalDetail({ proposalId });
  const resp = data ? parseProposalVotes(data) : null;
  if (isLoading || !resp) return null;

  const stats = calcVotingStats({
    ...resp,
    threshold: Number(data?.fields.threshold),
  });

  return (
    <SectionLayout title="Voting Status">
      <VoteProgressBar
        yesVotes={stats.yesVotes}
        noVotes={stats.noVotes}
        abstainVotes={stats.abstainVotes}
      />
      <div className="flex flex-col justify-between gap-2">
        <VotingState
          votedState="Yes"
          percentage={stats.yesPercentage}
          votes={stats.yesVotes}
          onlyStatus
          noFormat
        />
        <VotingState
          votedState="No"
          percentage={stats.noPercentage}
          votes={stats.noVotes}
          onlyStatus
          noFormat
        />
        <VotingState
          votedState="Abstain"
          percentage={stats.abstainPercentage}
          votes={stats.abstainVotes}
          onlyStatus
          noFormat
          hidePercentage
        />
      </div>
      <MinimumThreshHold
        isReached={stats.thresholdReached}
        totalVotes={stats.totalVotes}
        threshold={stats.threshold}
      />

      <YourVote proposalId={proposalId} />
    </SectionLayout>
  );
}
