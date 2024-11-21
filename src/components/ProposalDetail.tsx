import Link from "next/link";
import { Text } from "@/components/ui/Text";
import { CountDownTimer } from "./CountDownTimer";
import { SectionLayout } from "./SectionLayout";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { format, isPast } from "date-fns";
import { useExplorerLink } from "@/hooks/useExplorerLink";
import SvgArrowUpLeft16 from "@/icons/ArrowUpLeft16";

export function ProposalDetail({ proposalId }: { proposalId: string }) {
  const { data, isLoading } = useGetProposalDetail({ proposalId });
  const explorerLink = useExplorerLink({ id: proposalId, type: "object" });
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
            Proposal #{data?.fields.serial_no}
          </Text>
          <Link
            href={explorerLink}
            target="_blank"
            className="flex items-center gap-2024_XS"
          >
            <Text variant="LABEL/bold" color="fillContent-primary">
              View on Explorer
            </Text>
            <SvgArrowUpLeft16 className="h-2024_M w-2024_M text-2024_fillContent-primary" />
          </Link>
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
                Voting Ended
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
                Voting started
              </Text>
              <Text variant="LABEL/bold" color="fillContent-primary">
                {proposalStartDate}
              </Text>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <Text variant="LABEL/bold" color="fillContent-secondary">
                  Voting Ends
                </Text>
                <Text variant="LABEL/bold" color="fillContent-primary">
                  {votingEndedIn}
                </Text>
              </div>
              <CountDownTimer timestamp={timestampMs} />
            </div>
          </>
        )}
      </div>
    </SectionLayout>
  );
}
