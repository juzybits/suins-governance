import { client } from "@/app/SuinsClient";
import { useQuery } from "@tanstack/react-query";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { z } from "zod";
import { NETWORK } from "@/constants/env";

const votingObjectContentSchema = z.object({
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

// TODO: We need to update this so that we can paginate the proposals, This works for the first 20 proposals
export function useGetProposalsIds() {
  const network = NETWORK === "mainnet" ? "mainnet" : "testnet";
  return useQuery({
    queryKey: ["governanceObject-dynamic-fields-objects"],
    queryFn: async () => {
      const getActiveDiscounts = await client.getDynamicFields({
        parentId: SUINS_PACKAGES[network].governanceObjectID,
        limit: 20,
      });
      const resp = await Promise.allSettled(
        getActiveDiscounts.data.map((item) =>
          client.getObject({
            id: item.objectId,
            options: {
              showContent: true,
              showOwner: true,
              showType: true,
            },
          }),
        ),
      );

      // eslint-disable-next-line @typescript-eslint/prefer-find
      return resp
        .map((item) => {
          if (item.status !== "fulfilled") return null;

          const data = votingObjectContentSchema.safeParse(
            item.value.data?.content,
          );
          if (data.error) return null;
          return data.data.fields.value.fields;
        })
        .filter(Boolean)[0];
    },
  });
}
