import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { clients } from "@/lib/rpc";
import { NETWORK } from "@/constants/env";

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

export const proposalRouter = createTRPCRouter({
  getProposalDetail: publicProcedure
    .input(
      z.object({
        proposalId: z.string(),
      }),
    )
    .query(async ({ input: { proposalId } }) => {
      try {
        const resp = await clients[NETWORK].getObject({
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
          return new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid proposal detail",
          });
        }
        return objDetail.data;
      } catch (cause) {
        if (cause instanceof TRPCError) {
          // An error from tRPC occurred

          return new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid proposal detail",
          });
        }
      }
    }),
});
