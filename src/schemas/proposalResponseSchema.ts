import { z } from "zod";

export const proposalDetailSchema = z
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

export const proposalV2DetailSchema = z
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
      reward: z.string(),
      total_power: z.string(),
      total_reward: z.string(),
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
                    entries: z.array(z.any()),
                    max_size: z.string(),
                  }),
                }),
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
    }),
  })
  .transform((data) => ({
    ...data,
    version: 2 as const,
  }));

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
