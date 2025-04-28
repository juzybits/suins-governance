import { useCurrentAccount } from "@mysten/dapp-kit";

import { Text } from "@/components/ui/Text";
import { useGetVoteCastedByProposalId } from "@/hooks/useGetVoteCasted";
import isPast from "date-fns/isPast";
import { Divide } from "./ui/Divide";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { calculateReward } from "@/types/Proposal";
import { formatNSBalance } from "@/utils/formatNumber";

export function YourReward({ proposalId }: { proposalId: string }) {
  const currAcct = useCurrentAccount();
  const userAddr = currAcct?.address;

  const { data: proposal } = useGetProposalDetail({ proposalId });

  const { data: userVote } = useGetVoteCastedByProposalId({
    proposalId: proposalId,
    address: userAddr ?? "",
  });

  if (!userAddr || !proposal || userVote === undefined) {
    return null;
  }

  const userVotes = userVote?.totalVotes ?? 0;
  const reward = calculateReward({
    proposal,
    userPower: BigInt(userVotes),
  });

  const isVotingOver = isPast(
    new Date(Number(proposal.fields.end_time_ms ?? 0)),
  );

  return (
    <div className="dummy-ui">
      <div className="panel">
        <h2>Your Reward</h2>
        {userVotes === 0 && <p>Vote now to find out your reward.</p>}
        <p>{formatNSBalance(reward)} NS</p>
        <h2>Your Votes</h2>
        <p>{formatNSBalance(userVotes)}</p>
        {!isVotingOver && (
          <p>Subject to change based on total proposal votes.</p>
        )}
      </div>
    </div>
  );
}
