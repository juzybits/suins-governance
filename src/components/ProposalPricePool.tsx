import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { formatNSBalance } from "@/utils/formatNumber";

// TODO-J: only show if the user has voted
export function ProposalPricePool({ proposalId }: { proposalId: string }) {
  const { data, isLoading } = useGetProposalDetail({ proposalId });
  if (isLoading || !data || data.version == 1) return null;

  return (
    <div className="dummy-ui">
      <div className="panel">
        {/* TODO-J: only show if the proposal is not finalized,
         * otherwise, show "Your Reward For Voting: xx.x NS"
         */}
        <h2>Price Pool</h2>
        <h2>{formatNSBalance(data.fields.total_reward)} NS</h2>
        <h3>Your current potential reward: x.xx%</h3>
      </div>
    </div>
  );
}
