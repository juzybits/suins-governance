import { z } from "zod";

export const batchSchema = z.object({
  objectId: z.string(),
  version: z.string(),
  digest: z.string(),
  type: z.string(),
  content: z.object({
    dataType: z.literal("moveObject"),
    type: z.string(),
    hasPublicTransfer: z.boolean(),
    fields: z.object({
      balance: z.string(),
      cooldown_end_ms: z.string(),
      id: z.object({
        id: z.string(),
      }),
      start_ms: z.string(),
      unlock_ms: z.string(),
      voting_until_ms: z.string(),
    }),
  }),
});
