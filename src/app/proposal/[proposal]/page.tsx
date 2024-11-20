"use client";

import { ProposalContent } from "@/components/ProposalContent";
import Loader from "@/components/ui/Loader";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { MetadataManager } from "@/components/MetadataManager";
import { truncatedText } from "@/utils/truncatedText";

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
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-2">
        <h1 className="font-sans text-2024_h3-super-48 font-[750] text-2024_fillContent-primary md:text-2024_h1-super-88">
          Page Not Found
        </h1>
        <p className="text-slate-400">
          {}The page you are looking for does not exist
        </p>
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
