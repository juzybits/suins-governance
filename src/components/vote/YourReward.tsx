import { useCurrentAccount } from "@mysten/dapp-kit";

import { useGetVoteCastedByProposalId } from "@/hooks/useGetVoteCasted";
import isPast from "date-fns/isPast";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { calculateReward, getTotalReward } from "@/types/Proposal";
import { formatNSBalance } from "@/utils/coins";
import Typography from "../ui/typography";
import NSToken from "@/icons/legacy/NSToken";
import NSTokenSVG from "@/icons/ns-token";

export function YourReward({ proposalId }: { proposalId: string }) {
  const currAcct = useCurrentAccount();
  const userAddr = currAcct?.address;

  const { data: proposal } = useGetProposalDetail({ proposalId });

  const { data: userVote } = useGetVoteCastedByProposalId({
    proposalId: proposalId,
    address: userAddr ?? "",
  });

  if (!proposal || userVote === undefined) return null;

  if (!userAddr)
    return (
      <div className="flex w-full flex-col items-start justify-center gap-s rounded-l-xs rounded-r-xs bg-[#62519C66] px-m py-l">
        <Typography variant="label/Regular Bold" className="text-primary-main">
          Your Reward
        </Typography>
        <Typography variant="paragraph/XSmall" className="text-secondary">
          Vote now to find out reward.
        </Typography>
      </div>
    );

  const totalRewards = getTotalReward({ proposal });
  if (totalRewards === 0n) return null;

  const userVotes = userVote?.totalVotes ?? 0;
  const reward = calculateReward({
    proposal,
    userPower: BigInt(userVotes),
  });

  const rewardPercentage = Number((reward * 10000n) / totalRewards) / 100;

  const isVotingOver = isPast(
    new Date(Number(proposal.fields.end_time_ms ?? 0)),
  );

  if (userVotes === 0)
    return (
      <div className="flex w-full flex-col items-start justify-center gap-s rounded-l-xs rounded-r-xs bg-[#62519C66] px-m py-l">
        <Typography variant="label/Regular Bold" className="text-primary-main">
          Your Reward
        </Typography>
        <Typography variant="paragraph/XSmall" className="text-secondary">
          Vote now to find out reward.
        </Typography>
      </div>
    );

  if (!isVotingOver) {
    return (
      <div className="flex w-full flex-col items-start justify-center gap-s rounded-l-xs rounded-r-xs bg-[#62519C66] px-m py-l">
        <Typography variant="label/Regular Bold" className="text-primary-main">
          Prize Pool
        </Typography>
        <div className="flex gap-xs">
          <Typography
            variant="heading/Regular Bold"
            className="text-primary-main"
          >
            {formatNSBalance(totalRewards)}
          </Typography>
          <NSToken width="1.5rem" />
        </div>
        <Typography variant="paragraph/XSmall" className="text-semantic-good">
          Your current potential reward: {rewardPercentage.toFixed(2)}%
        </Typography>
      </div>
    );
  }

  return (
    <div
    //  className="flex w-full flex-col items-start justify-center gap-s rounded-l-xs rounded-r-xs bg-[#62519C66] px-m py-l"
    >
      <Typography variant="label/Regular Bold" className="text-primary-main">
        Your Reward For Voting
      </Typography>
      <div className="flex items-center gap-xs">
        <Typography
          variant="heading/Regular Bold"
          className="text-primary-main"
        >
          {formatNSBalance(reward)}
        </Typography>
        <NSTokenSVG width="3rem" />
      </div>
    </div>
  );
}
