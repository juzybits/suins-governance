import { z } from "zod";

export const proposalV1Schema = z
  .object({
    dataType: z.literal("moveObject"),
    type: z.string(),
    hasPublicTransfer: z.boolean(),
    fields: z.object({
      description: z.string(),
      end_time_ms: z.string(),
      id: z.object({
        id: z.string(),
      }),
      serial_no: z.string(),
      start_time_ms: z.string(),
      threshold: z.string(),
      title: z.string(),
      vote_leaderboards: z.object({
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
                value: z.object({
                  type: z.string(),
                  fields: z.object({
                    entries: z.array(
                      z.object({
                        type: z.string(),
                        fields: z.record(z.string()),
                      }),
                    ),
                    max_size: z.string(),
                  }),
                }),
              }),
            }),
          ),
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
      winning_option: z
        .object({
          type: z.string(),
          fields: z.object({
            pos0: z.string(),
          }),
        })
        .nullable(),
    }),
  })
  .transform((data) => ({
    ...data,
    version: 1 as const,
  }));
