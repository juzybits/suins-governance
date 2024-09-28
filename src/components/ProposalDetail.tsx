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

  const timestampMs = parseInt(data.fields.end_time_ms, 10);
  const proposalStartDate = format(
    new Date(parseInt(data.fields.start_time_ms, 10)),
    "MMM d, yyyy",
  );
  const votingEndedIn = format(new Date(timestampMs), "MMM d, yyyy");

  const isProposalClosed = isPast(new Date(timestampMs));

  return (
    <SectionLayout title="Information" isLoading={isLoading}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <Text variant="LABEL/bold" color="fillContent-secondary">
            Proposal #
          </Text>
          <Text variant="LABEL/bold" color="fillContent-primary">
            {data?.fields.serial_no}
          </Text>
        </div>

        {isProposalClosed ? (
          <>
            <div className="flex justify-between">
              <Text variant="LABEL/bold" color="fillContent-secondary">
                Voting started
              </Text>
              <Text variant="LABEL/bold" color="fillContent-primary">
                {proposalStartDate}
              </Text>
            </div>
            <div className="flex justify-between">
              <Text variant="LABEL/bold" color="fillContent-secondary">
                Voting ended
              </Text>
              <Text variant="LABEL/bold" color="fillContent-primary">
                {votingEndedIn}
              </Text>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <Text variant="LABEL/bold" color="fillContent-secondary">
                Proposal Date
              </Text>
              <Text variant="LABEL/bold" color="fillContent-primary">
                {proposalStartDate}
              </Text>
            </div>
            <div className="flex flex-col gap-4">
              <Text variant="LABEL/bold" color="fillContent-secondary">
                Ends in
              </Text>
              <CountDownTimer timestamp={timestampMs} />
            </div>
          </>
        )}
      </div>
    </SectionLayout>
  );
}
