import { z } from "zod";

export const statsSchema = z.object({
  objectId: z.string(),
  version: z.string(),
  digest: z.string(),
  content: z.object({
    dataType: z.literal("moveObject"),
    type: z.string(),
    hasPublicTransfer: z.boolean(),
    fields: z.object({
      id: z.object({
        id: z.string(),
      }),
      total_balance: z.string(),
      user_rewards: z.object({
        type: z.string(),
        fields: z.object({
          id: z.object({
            id: z.string(),
          }),
          size: z.string(),
        }),
      }),
    }),
  }),
});
