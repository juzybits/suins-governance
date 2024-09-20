"use client";
import { THREAD_HOLD } from "@/constants/common";
import { api } from "@/trpc/react";
import {
  parseProposalVotes,
  useGetProposalDetail,
} from "@/hooks/useGetProposalDetail";
import { Text } from "@/components/ui/Text";
import { useParams } from "next/navigation";
import { formatBalance, CoinFormat } from "@/utils/coins";

export function VotesRemaining() {
  const param = useParams();

  const { data: respDate } = api.post.getIsProposalActive.useQuery();
  const latestProposal =
    respDate?.isProposalActive ?? respDate?.defaultProposalId;
  const { data, isLoading } = useGetProposalDetail({
    proposalId: (param.proposal as string) ?? latestProposal ?? "",
  });

  const resp = data ? parseProposalVotes(data) : null;

  const totalVotes =
    (resp?.yesVote ?? 0) + (resp?.noVote ?? 0) + (resp?.abstainVote ?? 0);

  const votesRemaining = THREAD_HOLD - totalVotes;

  if (isLoading) return null;
  const formattedVotesRemaining = formatBalance({
    balance: Number(votesRemaining),
    decimals: 0,
    format: CoinFormat.FULL,
  });
  return (
    <div className="flex w-full items-center justify-center rounded-[56px] border-2 border-2024_fillContent-tertiary bg-transparent p-2024_M md:w-fit">
      <Text
        variant="B5/bold"
        color="fillContent-primary"
        className="0.16px leading-[112.5%]"
      >
        {formattedVotesRemaining} NS
      </Text>
    </div>
  );
}
