import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { formatNSBalance } from "@/utils/formatNumber";

export function ProposalReward({ proposalId }: { proposalId: string }) {
  const { data, isLoading } = useGetProposalDetail({ proposalId });
  if (isLoading || !data || data.version == 1) return null;

  return (
    <div className="dummy-ui">
      <div className="panel">
        <h2>Reward: {formatNSBalance(data.fields.reward)} NS</h2>
      </div>
    </div>
  );
}
