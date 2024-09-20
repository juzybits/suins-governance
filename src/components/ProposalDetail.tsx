import { Text } from "@/components/ui/Text";
import { CountDownTimer } from "./CountDownTimer";
import { SectionLayout } from "./SectionLayout";
import {
  useGetProposalDetail,
  parseProposalVotes,
} from "@/hooks/useGetProposalDetail";
import { format, isPast } from "date-fns";

export function ProposalDetail({ proposalId }: { proposalId: string }) {
  const { data, isLoading } = useGetProposalDetail({ proposalId });
  const resp = data ? parseProposalVotes(data) : null;
  if (!data) return null;
  const timestampMs = parseInt(data.fields.valid_until_timestamp_ms, 10);
  const formattedDate = format(new Date(timestampMs), "MMM d, yyyy");

  const isProposalClosed = isPast(new Date(timestampMs));

  return (
    <SectionLayout title="Information" isLoading={isLoading}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <Text variant="LABEL/bold" color="fillContent-secondary">
            Proposal #
          </Text>
          <Text variant="LABEL/bold" color="fillContent-primary">
            {resp?.proposal}
          </Text>
        </div>
        <div className="flex justify-between">
          <Text variant="LABEL/bold" color="fillContent-secondary">
            Proposal Date
          </Text>
          <Text variant="LABEL/bold" color="fillContent-primary">
            {formattedDate}
          </Text>
        </div>

        {!isProposalClosed && (
          <div className="flex flex-col gap-4">
            <CountDownTimer timestamp={timestampMs} />
          </div>
        )}
      </div>
    </SectionLayout>
  );
}
