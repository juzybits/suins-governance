import { useQuery } from "@tanstack/react-query";

import { type z } from "zod";
import { client } from "@/app/SuinsClient";
import { votesCastedSchema } from "@/schemas/votesCastedSchema";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";

type ParsedVotes = z.infer<typeof votesCastedSchema>;

type ParsedVotesData = {
  proposalFieldName: string | null;
  yesVote: number;
  noVote: number;
  abstainVote: number;
};
export function getVoteTypeWithMostVotes(parsedVotes: ParsedVotesData) {
  const { yesVote, noVote, abstainVote } = parsedVotes;

  const votesArray = [
    { key: "Yes", votes: yesVote },
    { key: "No", votes: noVote },
    { key: "Abstain", votes: abstainVote },
  ];

  const highestVote = Math.max(yesVote, noVote, abstainVote);

  // If all votes are zero, return null
  if (highestVote === 0) {
    return null;
  }

  // Get all categories with the highest vote count
  const topCategories = votesArray.filter((vote) => vote.votes === highestVote);

  return topCategories;
}
export function parseVotesData(data: ParsedVotes) {
  let proposalFieldName: string | null = null;
  let yesVote = 0;
  let noVote = 0;
  let abstainVote = 0;

  const contents = data.content.fields.value.fields.value.fields.contents;

  for (const entry of contents) {
    const dynamicFields = entry.fields.key.fields;
    const fieldNames = Object.keys(dynamicFields);

    if (fieldNames.length !== 1) {
      continue;
    }

    const fieldName = fieldNames[0];
    if (!fieldName) {
      continue;
    }

    const option = dynamicFields[fieldName];
    if (typeof option !== "string") {
      continue;
    }

    const valueStr = entry.fields.value;
    const value = parseInt(valueStr, 10);
    if (isNaN(value)) {
      continue;
    }

    if (!proposalFieldName) {
      proposalFieldName = fieldName;
    }

    switch (option) {
      case "Yes":
        yesVote += value;
        break;
      case "No":
        noVote += value;
        break;
      case "Abstain":
        abstainVote += value;
        break;
      default:
        break;
    }
  }

  return {
    proposalFieldName,
    yesVote,
    noVote,
    abstainVote,
    totalVotes: yesVote + noVote + abstainVote,
  };
}

export function useGetVoteCastedByProposalId({
  address,
  proposalId,
}: {
  address: string;
  proposalId: string;
}) {
  const { data: proposal, isLoading: isProposalLoading } = useGetProposalDetail(
    { proposalId },
  );

  return useQuery({
    queryKey: ["vote-casted", address, proposalId],
    queryFn: async () => {
      if (!proposal) {
        throw new Error("proposal not found");
      }

      const dynamicFields = await client.getDynamicFieldObject({
        parentId: proposal.fields.voters.fields.id.id,
        name: {
          type: "address",
          value: address,
        },
      });

      if (dynamicFields.error) {
        return null;
      }

      const resp = votesCastedSchema.safeParse(dynamicFields.data);
      if (resp.error) {
        console.warn(
          "[useGetVoteCasted] Failed to fetch votes casted",
          resp.error,
        );
        return null;
      }
      return resp.data;
    },
    select: (data) => (data ? parseVotesData(data) : null),
    enabled: !!address && !!proposalId && !isProposalLoading && !!proposal,
  });
}

export function useGetVoteCastedByVoterId(objectId: string) {
  return useQuery({
    queryKey: ["vote-casted-by-id", objectId],
    queryFn: async () => {
      const obj = await client.getObject({
        id: objectId,
        options: {
          showType: true,
          showContent: true,
        },
      });
      const resp = votesCastedSchema.safeParse(obj.data);

      if (resp.error) {
        console.warn(
          "[useGetVoteCastedById] Failed to fetch votes casted by ID",
          resp.error,
        );
        return null;
      }
      return parseVotesData(resp.data);
    },

    enabled: !!objectId,
  });
}
