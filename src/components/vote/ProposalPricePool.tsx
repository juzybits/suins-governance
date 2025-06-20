import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { formatNSBalance } from "@/utils/coins";

export function ProposalPricePool({ proposalId }: { proposalId: string }) {
  const { data, isLoading } = useGetProposalDetail({ proposalId });
  if (isLoading || !data || data.version == 1) return null;

  const balanceStr = formatNSBalance(data.fields.total_reward);

  return (
    <div className="flex w-full flex-col items-start justify-center gap-2xl rounded-l-s rounded-r-s bg-[#62519C66] p-s">
      <div className="panel">
        <h2>Proposal Voting Rewards</h2>
        <h2>{balanceStr} NS</h2>
        <p>
          Upon reaching the Minimum Voting Threshold, each voter receives a
          portion of the {balanceStr} SuiNS tokens reward based on the number of
          tokens they used to vote, proportional to the total tokens used by all
          voters.
        </p>
      </div>
    </div>
  );
}
