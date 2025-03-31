import { z } from "zod";

export const proposalV2Schema = z
  .object({
    dataType: z.literal("moveObject"),
    type: z.string(),
    hasPublicTransfer: z.boolean(),
    fields: z.object({
      id: z.object({
        id: z.string(),
      }),
      description: z.string(),
      end_time_ms: z.string(),
      serial_no: z.string(),
      start_time_ms: z.string(),
      threshold: z.string(),
      title: z.string(),
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
      winning_option: z
        .object({
          type: z.string(),
          fields: z.object({
            pos0: z.string(),
          }),
        })
        .nullable(),
      vote_leaderboards: z.object({
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
                value: z.object({
                  type: z.string(),
                  fields: z.object({
                    entries: z.array(z.any()), // TODO
                    max_size: z.string(),
                  }),
                }),
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
      reward: z.string(),
      total_reward: z.string(),
      total_power: z.string(),
      batch_powers: z.object({
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
    }),
  })
  .transform((data) => ({
    ...data,
    version: 2 as const,
  }));
