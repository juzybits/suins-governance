import * as Progress from "@radix-ui/react-progress";
import { motion } from "framer-motion";

type VoteProgressBarProps = {
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
};
export function VoteProgressBar({
  yesVotes,
  noVotes,
  abstainVotes,
}: VoteProgressBarProps) {
  const totalVotesCasted = yesVotes + noVotes + abstainVotes;

  // Calculate percentage for each vote option
  const yesPercentage = (yesVotes / totalVotesCasted) * 100;
  const noPercentage = (noVotes / totalVotesCasted) * 100;
  const abstainPercentage = (abstainVotes / totalVotesCasted) * 100;
  const votesCast = abstainPercentage + noPercentage + yesPercentage;

  const gradient = `linear-gradient(
    to right,
    #34D399 ${yesPercentage}%,
    #F97316 ${yesPercentage}% ${yesPercentage + noPercentage}%,
    #FBBF24 ${yesPercentage + noPercentage}% ${yesPercentage + noPercentage + abstainPercentage}%
  )`;

  return (
    <Progress.Root className="relative h-4 w-full overflow-hidden rounded-full bg-gray-800">
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: `${votesCast}%` }}
        transition={{ duration: 1 }} // Animation duration (2 seconds)
        className="h-full w-full rounded-full"
        style={{
          backgroundImage: gradient,
        }}
      />
    </Progress.Root>
  );
}
