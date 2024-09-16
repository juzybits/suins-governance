import type { Metadata } from "next";
import { api } from "@/trpc/server";
import { ProposalContent } from "@/components/ProposalContent";
import { truncatedText } from "@/utils/truncatedText";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { proposal: string };
}): Promise<Metadata> {
  const pathName = params?.proposal;
  const data = await api.post.getProposalDetail({ proposalId: pathName });
  if (!data || !("fields" in data)) {
    return notFound();
  }
  return {
    title: data?.fields.title ?? "SuiNS Voting site",
    description: truncatedText({
      text:
        data?.fields?.description ??
        "Join today and voice your opinion on upcoming changes to SuiNS",
    }),
    icons: [{ rel: "icon", url: "/images/apple-touch-icon.png" }],
  };
}

export default async function ProposalPage({
  params,
}: {
  params: { proposal: string };
}) {
  const proposalId = params?.proposal;
  return <ProposalContent proposalId={proposalId} />;
}
