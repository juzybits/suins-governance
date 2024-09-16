import { formatAddress } from "@mysten/sui/utils";
import { Text } from "@/components/ui/Text";
import { Heading } from "@/components/ui/Heading";
import { CountDownTimer } from "./CountDownTimer";
import { SectionLayout } from "./SectionLayout";
import clsx from "clsx";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { format, isPast } from "date-fns";

export function ProposalDetail({ proposalId }: { proposalId: string }) {
  const { data, isLoading } = useGetProposalDetail({ proposalId });

  if (!data) return null;
  const timestampMs = parseInt(data.fields.valid_until_timestamp_ms, 10);
  const formattedDate = format(new Date(timestampMs), "MMM d, yyyy");

  const isProposalClosed = isPast(new Date(timestampMs));
  // 1727154000000
  return (
    <SectionLayout title="Information" isLoading={isLoading}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <Text variant="LABEL/bold" color="fillContent-secondary">
            Proposal #
          </Text>
          <Text variant="LABEL/bold" color="fillContent-primary">
            349805
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
        <div className="flex justify-between">
          <Text variant="LABEL/bold" color="fillContent-secondary">
            Package
          </Text>
          <Text variant="LABEL/semibold" color="fillContent-link" mono>
            {formatAddress(data.fields.id.id)}
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
