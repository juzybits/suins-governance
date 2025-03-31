import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { formatNSBalance } from "@/utils/formatNumber";
export function ProposalReward({ proposalId }: { proposalId: string }) {
  const { data, isLoading } = useGetProposalDetail({ proposalId });
  if (isLoading || !data) return null;
  if (!("reward" in data.fields)) return null; // v1 proposals don't have rewards
  const reward = data.fields.reward;

  return (
    <div className="dummy-ui">
      <div className="panel">
        <h2>Reward: {formatNSBalance(reward)} NS</h2>
      </div>
    </div>
  );
}
