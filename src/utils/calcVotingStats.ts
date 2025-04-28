import { useMemo } from "react";
import { roundFloat } from "./roundFloat";
import { ONE_NS_RAW, NS_VOTE_THRESHOLD } from "@/constants/common";

export function calcVotingStats(votes: {
  yesVote?: number;
  noVote?: number;
  abstainVote?: number;
  threshold?: number;
  isPersonVote?: boolean;
}) {
  const yesVotes = votes?.yesVote ?? 0;
  const noVotes = votes?.noVote ?? 0;
  const abstainVotes = votes?.abstainVote ?? 0;
  const totalVotes = yesVotes + noVotes + abstainVotes;
  const totalVotesWithoutAbstain =
    totalVotes - (votes.isPersonVote ? 0 : abstainVotes);

  const yesPercentage =
    totalVotes > 0
      ? roundFloat((yesVotes / totalVotesWithoutAbstain) * 100)
      : 0;
  const noPercentage =
    totalVotes > 0 ? roundFloat((noVotes / totalVotesWithoutAbstain) * 100) : 0;
  const abstainPercentage =
    totalVotes > 0 ? roundFloat((abstainVotes / totalVotes) * 100) : 0;

  const threshold = (votes?.threshold ?? NS_VOTE_THRESHOLD) / ONE_NS_RAW;
  const thresholdReached = totalVotes >= threshold;

  const votingStatus = useMemo(() => {
    const response = [
      {
        votedState: "Yes" as const,
        percentage: yesPercentage,
        votes: yesVotes,
      },
      {
        votedState: "No" as const,
        percentage: noPercentage,
        votes: noVotes,
      },
      {
        votedState: "Abstain" as const,
        percentage: abstainPercentage,
        votes: abstainVotes,
      },
    ];
    return votes.isPersonVote
      ? response.sort((a, b) => b.percentage - a.percentage)
      : response;
  }, [
    abstainPercentage,
    votes.isPersonVote,
    noPercentage,
    abstainVotes,
    noVotes,
    yesVotes,
    yesPercentage,
  ]);

  return {
    status: votingStatus,
    threshold,
    thresholdReached,
    totalVotes,
    yesVotes,
    noVotes,
    abstainVotes,
    totalVotesWithoutAbstain,
    yesPercentage,
    noPercentage,
    abstainPercentage,
  };
}
