import { SectionLayout } from "./SectionLayout";
import { VoteIndicator } from "./ui/VoteIndicator";
import { VoteProgressBar } from "./VoteProgressBar";
import { GradientProgressBar } from "./ui/GradientProgressBar";
import { Text } from "@/components/ui/Text";
import NSToken from "@/icons/NSToken";
import { YourVote } from "./YourVote";
import { Divide } from "@/components/ui/Divide";

const yesVotes = 2400;
const noVotes = 500;
const abstainVotes = 125;

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
        <Text variant="B7/regular" color="fillContent-secondary">
          Minimum Voting Threshold: {thresholdPercentage}%
        </Text>
        <Text
          variant="B7/regular"
          color="fillContent-secondary"
          className="text-[#00F9FB]"
        >
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
  const statusColor =
    votedState === "Yes"
      ? "good"
      : votedState === "No"
        ? "issue-dark"
        : "warning";
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

export function VotingStatus() {
  return (
    <SectionLayout title="Voting Status">
      <VoteProgressBar
        yesVotes={yesVotes}
        noVotes={noVotes}
        abstainVotes={abstainVotes}
        totalVotes={4000}
      />
      <div className="flex flex-col justify-between gap-2">
        <VotingState votedState="Yes" percentage={60} votes={yesVotes} />
        <VotingState votedState="No" percentage={12.5} votes={noVotes} />
        <VotingState
          votedState="Abstain"
          percentage={3.125}
          votes={abstainVotes}
        />
      </div>
      <MinimumThreshHold thresholdPercentage={96} isReached={true} />
      <Divide />
      <YourVote />
    </SectionLayout>
  );
}
