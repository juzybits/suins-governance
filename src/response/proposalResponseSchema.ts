import { z } from "zod";

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
        head: z.string().nullable(), // Updated to allow null
        id: z.object({
          id: z.string(),
        }),
        size: z.string(),
        tail: z.string().nullable(), // Updated to allow null
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
                fields: z.record(z.string(), z.string()),
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
      fields: z.record(z.array(z.string())),
    }),
  }),
});
