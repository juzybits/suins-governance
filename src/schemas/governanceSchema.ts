import { z } from "zod";

export const governanceSchema = z.object({
  dataType: z.literal("moveObject"),
  type: z.string(),
  hasPublicTransfer: z.boolean(),
  fields: z.object({
    id: z.object({
      id: z.string(),
    }),
    name: z.object({
      type: z.string(),
      fields: z.object({
        dummy_field: z.boolean(),
      }),
    }),
    value: z.object({
      type: z.string(),
      fields: z.object({
        pos0: z.array(
          z.object({
            type: z.string(),
            fields: z.object({
              end_time: z.string(),
              proposal_id: z.string(),
            }),
          }),
        ),
      }),
    }),
  }),
});
