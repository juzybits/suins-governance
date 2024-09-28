import { z } from "zod";

export const votesCastedSchema = z.object({
  objectId: z.string(),
  version: z.string(),
  digest: z.string(),
  type: z.string(),
  owner: z.object({ ObjectOwner: z.string() }),
  previousTransaction: z.string(),
  storageRebate: z.string(),
  content: z.object({
    dataType: z.literal("moveObject"),
    type: z.string(),
    hasPublicTransfer: z.boolean(),
    fields: z.object({
      id: z.object({ id: z.string() }),
      name: z.string(),
      value: z.object({
        type: z.string(),
        fields: z.object({
          next: z.string().nullable(),
          prev: z.string().nullable(),
          value: z.object({
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
        }),
      }),
    }),
  }),
});

export const votesCastedSchema1 = z.object({
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
      value: z.object({
        type: z.string(),
        fields: z.object({
          next: z.string().nullable(),
          prev: z.string().nullable(),
          value: z.object({
            type: z.string(),
            fields: z.object({
              contents: z.array(
                z.object({
                  type: z.string(),
                  fields: z.object({
                    key: z.object({
                      type: z.string(),
                      fields: z.record(z.string(), z.string()), // Dynamic field names
                    }),
                    value: z.object({
                      type: z.string(),
                      fields: z.object({
                        balance: z.string(),
                        id: z.object({
                          id: z.string(),
                        }),
                      }),
                    }),
                  }),
                }),
              ),
            }),
          }),
        }),
      }),
    }),
  }),
});
