import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/app/SuinsClient";
import { CoinFormat, formatBalance } from "@/utils/coins";
import { NS_COINTYPE_DECIMAL_PLACES } from "@/constants/common";

export const proposalDetailSchema = z.object({
  dataType: z.literal("moveObject"),
  type: z.string(),
  hasPublicTransfer: z.boolean(),
  fields: z.object({
    description: z.string(),
    id: z.object({
      id: z.string(),
    }),
    title: z.string(),
    valid_until_timestamp_ms: z.string(),
    voters: z.object({
      type: z.string(),
      fields: z.object({
        head: z.string().nullable(),
        id: z.object({
          id: z.string(),
        }),
        size: z.string(),
        tail: z.string().nullable(),
      }),
    }),
    votes: z.object({
      type: z.string(),
      fields: z.object({
        contents: z.array(
          z.object({
            type: z.string(),
            fields: z.object({
              key: z.object({
                type: z.string(),
                fields: z.record(z.string()),
              }),
              value: z.string(),
            }),
          }),
        ),
      }),
    }),
    winning_option: z.null(),
  }),
});

type ProposalDataType = z.infer<typeof proposalDetailSchema>;

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
