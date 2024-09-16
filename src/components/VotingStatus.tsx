import { SectionLayout } from "./SectionLayout";
import { VoteIndicator } from "./ui/VoteIndicator";
import { VoteProgressBar } from "./VoteProgressBar";
import { GradientProgressBar } from "./ui/GradientProgressBar";
import { Text } from "@/components/ui/Text";
import NSToken from "@/icons/NSToken";
import { YourVote } from "./YourVote";
import { Divide } from "@/components/ui/Divide";
import {
  useGetProposalDetail,
  parseProposalVotes,
} from "@/hooks/useGetProposalDetail";
import { roundFloat } from "@/utils/roundFloat";

const THREAD_HOLD = 5_000_000;

function MinimumThreshHold({
  thresholdPercentage,
  isReached,
}: {
  thresholdPercentage: number;
  isReached: boolean;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-2024_R rounded-12 bg-2024_fillBackground-secondary-Highlight/40 px-2024_R py-2024_R">
      <Text
        variant="B6/bold"
        color="fillContent-primary"
        className="w-full text-start"
      >
        Votes Casted
      </Text>
      <GradientProgressBar percentage={thresholdPercentage} />
      <div className="flex w-full items-center justify-between gap-1">
        <Text
          variant="B7/regular"
          color="fillContent-secondary"
          className="!tracking-tighter"
        >
          Minimum Voting Threshold: {thresholdPercentage}%
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
  percentage: number;
  votes: number;
};

function VotingState({ votedState, percentage, votes }: VotedStateProps) {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex basis-3/5 items-start">
        <VoteIndicator votedStatus={votedState} />
      </div>
      <div className="flex basis-1/5 items-center justify-end gap-1">
        <Text variant="P3/medium" color="fillContent-secondary">
          {votes}
        </Text>
        <NSToken className="h-3 w-3" color="white" />
      </div>
      <Text
        variant="P3/medium"
        color="fillContent-secondary"
        className="flex min-w-[60px] justify-end"
      >
        {percentage}%
      </Text>
    </div>
  );
}

export function VotingStatus({ proposalId }: { proposalId: string }) {
  const { data, isLoading } = useGetProposalDetail({ proposalId });

  if (isLoading) return null;
  const resp = data ? parseProposalVotes(data) : null;

  const totalVotes =
    (resp?.yesVote || 0) + (resp?.noVote || 0) + (resp?.abstainVote || 0) || 1;

  const yesVotesPecentage = roundFloat(
    ((resp?.yesVote || 0) / totalVotes) * 100,
  );

  const noVotesPecentage = roundFloat(((resp?.noVote || 0) / totalVotes) * 100);
  const abstainVotesPecentage = roundFloat(
    ((resp?.abstainVote || 0) / totalVotes) * 100,
  );
  const ThresholdPercentage = roundFloat((totalVotes / THREAD_HOLD) * 100);
  return (
    <SectionLayout title="Voting Status">
      <VoteProgressBar
        yesVotes={resp?.yesVote || 0}
        noVotes={resp?.noVote || 0}
        abstainVotes={resp?.abstainVote || 0}
        totalVotes={THREAD_HOLD}
      />
      <div className="flex flex-col justify-between gap-2">
        <VotingState
          votedState="Yes"
          percentage={yesVotesPecentage}
          votes={resp?.yesVote || 0}
        />
        <VotingState
          votedState="No"
          percentage={noVotesPecentage}
          votes={resp?.noVote || 0}
        />
        <VotingState
          votedState="Abstain"
          percentage={abstainVotesPecentage}
          votes={resp?.abstainVote || 0}
        />
      </div>
      <MinimumThreshHold
        thresholdPercentage={ThresholdPercentage}
        isReached={totalVotes >= THREAD_HOLD}
      />
      <Divide />
      <YourVote />
    </SectionLayout>
  );
}
