import { z } from "zod";

export const votingObjectContentSchema = z.object({
  dataType: z.literal("moveObject"),
  type: z.string(),
  hasPublicTransfer: z.boolean(),
  fields: z.object({
    id: z.object({ id: z.string() }),
    name: z.object({
      type: z.string(),
      fields: z.object({
        dummy_field: z.boolean(),
      }),
    }),
    value: z.object({
      type: z.string(),
      fields: z.record(
        z.array(
          z.object({
            type: z.string(),
            fields: z.object({
              end_time: z.string(),
              proposal_id: z.string(),
            }),
          }),
        ),
      ),
    }),
  }),
});
