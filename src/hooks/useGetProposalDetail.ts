import { string, type z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/app/SuinsClient";
import { CoinFormat, formatBalance } from "@/utils/coins";
import { NS_COINTYPE_DECIMAL_PLACES } from "@/constants/common";
import { proposalDetailSchema } from "@/schemas/proposalResponseSchema";

type ProposalDataType = z.infer<typeof proposalDetailSchema>;

type TopVotes =
  ProposalDataType["fields"]["vote_leaderboards"]["fields"]["contents"];

export type VoteType = "Yes" | "No" | "Abstain";
type VoteEntry = {
  address: string;
  votes: number;
}[];

export function getTopVotersByVoteType(data: TopVotes) {
  return data.reduce((acc, entry) => {
    const voteType = entry.fields.key.fields.pos0 as VoteType;
    const entries = entry.fields.value.fields.entries.map((entry) => ({
      address: entry.fields.pos0!,
      votes: Number(entry.fields.pos1 ?? 0),
    }));
    acc.set(voteType, entries);
    return acc;
  }, new Map<VoteType, VoteEntry>());
}

export function getTopVoters(
  data: TopVotes,
  topN: number,
): { address: string; votes: number }[] {
  // voteType:  "Yes" | "No" | "Abstain"
  // Map to keep track of each address's highest vote and corresponding vote type
  const voteCounts = new Map<string, number>();

  data.forEach((entry) => {
    // const votingOption = entry.fields.key.fields.pos0;
    const leaderboardEntries = entry.fields.value.fields.entries;

    leaderboardEntries.forEach((leaderboardEntry) => {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const address = leaderboardEntry.fields.pos0 || "";
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const votes = parseInt(leaderboardEntry.fields.pos1 || "0", 10);

      // Accumulate votes per address
      if (voteCounts.has(address)) {
        voteCounts.set(address, voteCounts.get(address)! + votes);
      } else {
        voteCounts.set(address, votes);
      }
    });
  });

  // Convert the Map to an array and sort by votes in descending order
  const sortedVoters = Array.from(voteCounts.entries())
    .map(([address, votes]) => ({ address, votes }))
    .sort((a, b) => b.votes - a.votes);

  // Return the top N voters
  return sortedVoters.slice(0, topN);
}

export function parseProposalVotes(data: ProposalDataType) {
  // Initialize the proposal field name
  let proposalFieldName = "";

  // Initialize the vote counts
  let yesVote = 0;
  let noVote = 0;
  let abstainVote = 0;

  const contents = data.fields.votes.fields.contents;

  for (const entry of contents) {
    const keyFields = entry.fields.key.fields;
    const fieldNames = Object.keys(keyFields);

    // Check that there is exactly one dynamic field name
    if (fieldNames.length !== 1) {
      // Handle error or skip
      continue;
    }

    const fieldName = fieldNames[0];

    if (typeof fieldName !== "string") {
      continue;
    }
    const option = keyFields[fieldName];
    const value = parseInt(entry.fields.value, 10);

    // Set the proposal field name if it hasn't been set yet
    if (!proposalFieldName && fieldName) {
      proposalFieldName = fieldName;
    } else if (proposalFieldName !== fieldName) {
      // Handle case where field names differ if necessary
      // For now, we'll assume all field names are the same
    }

    // Accumulate the vote counts based on the option
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
        // Handle unknown options if necessary
        break;
    }
  }

  return {
    proposal: proposalFieldName,
    yesVote: Number(
      formatBalance({
        balance: yesVote,
        decimals: NS_COINTYPE_DECIMAL_PLACES,
        format: CoinFormat.FULL,
      }).replace(/,/g, ""),
    ),
    noVote: Number(
      formatBalance({
        balance: noVote,
        decimals: NS_COINTYPE_DECIMAL_PLACES,
        format: CoinFormat.FULL,
      }).replace(/,/g, ""),
    ),
    abstainVote: Number(
      formatBalance({
        balance: abstainVote,
        decimals: NS_COINTYPE_DECIMAL_PLACES,
        format: CoinFormat.FULL,
      }).replace(/,/g, ""),
    ),
  };
}

export function useGetProposalDetail({ proposalId }: { proposalId: string }) {
  return useQuery({
    queryKey: ["proposal-detail-by-id", proposalId],
    queryFn: async () => {
      const resp = await client.getObject({
        id: proposalId,
        options: {
          showContent: true,
          showDisplay: true,
          showOwner: true,
          showType: true,
        },
      });

      const objDetail = proposalDetailSchema.safeParse(resp?.data?.content);

      if (objDetail.error) {
        throw new Error("Invalid proposal detail");
      }
      return objDetail.data;
    },
  });
}
