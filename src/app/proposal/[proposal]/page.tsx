"use client";

import { ProposalContent } from "@/components/vote";
import Loader from "@/components/ui/legacy/Loader";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { MetadataManager } from "@/components/vote/MetadataManager";
import { truncatedText } from "@/utils/truncatedText";
import Typography from "@/components/ui/typography";

export default function ProposalPage({
  params,
}: {
  params: { proposal: string };
}) {
  const proposalId = params?.proposal;
  const { data, isLoading, isError } = useGetProposalDetail({
    proposalId,
  });

  if (isError)
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3xl bg-bg-primary p-s">
        <Typography variant="display/Regular" className="text-primary-main">
          Page Not Found
        </Typography>
        <Typography variant="paragraph/Regular" className="text-secondary">
          The page you are looking for does not exist
        </Typography>
      </div>
    );

  if (isLoading) return <Loader className="h-5 w-5" />;
  return (
    <MetadataManager
      title={data?.fields.title ?? "SuiNS Voting site"}
      description={truncatedText({ text: data?.fields?.description ?? "" })}
    >
      <ProposalContent proposalId={proposalId} />
    </MetadataManager>
  );
}
