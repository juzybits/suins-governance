import { z } from "zod";

export const userTotalRewardSchema = z.object({
  objectId: z.string(),
  version: z.string(),
  digest: z.string(),
  type: z.string(),
  owner: z.object({
    ObjectOwner: z.string(),
  }),
  previousTransaction: z.string(),
  storageRebate: z.string(),
  content: z.object({
    dataType: z.literal("moveObject"),
    type: z.string(),
    hasPublicTransfer: z.boolean(),
    fields: z.object({
      id: z.object({
        id: z.string(),
      }),
      name: z.string(),
      value: z.string(),
    }),
  }),
});
