import Link from "next/link";
import { CountDownTimer } from "./CountDownTimer";
import { SectionLayout } from "./SectionLayout";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { format, isPast } from "date-fns";
import { useExplorerLink } from "@/hooks/useExplorerLink";
import SvgArrowUpLeft16 from "@/icons/legacy/ArrowUpLeft16";
import Typography from "../ui/typography";

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
          <Typography variant="label/Regular Bold" className="text-secondary">
            Proposal #{data?.fields.serial_no}
          </Typography>
          <Link
            href={explorerLink}
            target="_blank"
            className="flex items-center gap-xs"
          >
            <Typography
              variant="label/Regular Bold"
              className="text-primary-main"
            >
              View on Explorer
            </Typography>
            <SvgArrowUpLeft16 className="h-m w-m text-primary-main" />
          </Link>
        </div>

        {isProposalClosed ? (
          <>
            <div className="flex justify-between">
              <Typography
                variant="label/Regular Bold"
                className="text-secondary"
              >
                Voting Started
              </Typography>
              <Typography
                variant="label/Regular Bold"
                className="text-primary-main"
              >
                {proposalStartDate}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography
                variant="label/Regular Bold"
                className="text-secondary"
              >
                Voting Ended
              </Typography>
              <Typography
                variant="label/Regular Bold"
                className="text-primary-main"
              >
                {votingEndedIn}
              </Typography>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <Typography
                variant="label/Regular Bold"
                className="text-secondary"
              >
                Voting Started
              </Typography>
              <Typography
                variant="label/Regular Bold"
                className="text-primary-main"
              >
                {proposalStartDate}
              </Typography>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <Typography
                  variant="label/Regular Bold"
                  className="text-secondary"
                >
                  Voting Ends
                </Typography>
                <Typography
                  variant="label/Regular Bold"
                  className="text-primary-main"
                >
                  {votingEndedIn}
                </Typography>
              </div>
              <CountDownTimer timestamp={timestampMs} />
            </div>
          </>
        )}
      </div>
    </SectionLayout>
  );
}
