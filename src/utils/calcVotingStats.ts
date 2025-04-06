import { roundFloat } from "./roundFloat";
import { NS_VOTE_DIVISOR, NS_VOTE_THRESHOLD } from "@/constants/common";

export type VoteStats = {
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  totalVotes: number;
  totalVotesWithoutAbstain: number;
  yesPercentage: number;
  noPercentage: number;
  abstainPercentage: number;
  threshold: number;
  thresholdReached: boolean;
};

export function calcVotingStats(votes: {
  yesVote?: number;
  noVote?: number;
  abstainVote?: number;
  threshold?: number;
}): VoteStats {
  const yesVotes = votes?.yesVote ?? 0;
  const noVotes = votes?.noVote ?? 0;
  const abstainVotes = votes?.abstainVote ?? 0;
  const totalVotes = yesVotes + noVotes + abstainVotes;
  const totalVotesWithoutAbstain = totalVotes - abstainVotes;

  const yesPercentage =
    totalVotes > 0
      ? roundFloat((yesVotes / totalVotesWithoutAbstain) * 100)
      : 0;
  const noPercentage =
    totalVotes > 0 ? roundFloat((noVotes / totalVotesWithoutAbstain) * 100) : 0;
  const abstainPercentage =
    totalVotes > 0 ? roundFloat((abstainVotes / totalVotes) * 100) : 0;

  const threshold =
    Number(votes?.threshold ?? NS_VOTE_THRESHOLD) / NS_VOTE_DIVISOR;
  const thresholdReached = totalVotes >= threshold;

  return {
    yesVotes,
    noVotes,
    abstainVotes,
    totalVotes,
    totalVotesWithoutAbstain,
    yesPercentage,
    noPercentage,
    abstainPercentage,
    threshold,
    thresholdReached,
  };
}
