import { useSuiClientQuery } from "@mysten/dapp-kit";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/app/SuinsClient";

const proposalDetailSchema = z.object({
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
        head: z.string(),
        id: z.object({
          id: z.string(),
        }),
        size: z.string(),
        tail: z.string(),
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
                fields: z.object({
                  pos0: z.string(),
                }),
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

export function useGetProposalDetail({ proposalId }: { proposalId: string }) {
  return useQuery({
    queryKey: ["proposal-detail", proposalId],
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
