import { client } from "@/app/SuinsClient";
import { useQuery } from "@tanstack/react-query";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { governanceSchema } from "@/schemas/proposalResponseSchema";
import isFuture from "date-fns/isFuture";

// TODO: We need to update this so that we can paginate the proposals, This works for the first 20 proposals
export function useGetProposalsIds() {
  const network = NETWORK === "mainnet" ? "mainnet" : "testnet";
  return useQuery({
    queryKey: ["governanceObject-dynamic-fields-objects"],
    queryFn: async () => {
      const proposalsContent = await client.getDynamicFields({
        parentId: SUINS_PACKAGES[network].governance,
        limit: 20,
      });

      if (
        !proposalsContent.data[0]?.name.type ||
        !proposalsContent.data[0]?.name.value
      ) {
        throw new Error("No type found");
      }

      const dynamicFieldsObject = await client.getDynamicFieldObject({
        parentId: SUINS_PACKAGES[network].governance,
        name: {
          type: proposalsContent.data[0].name.type,
          value: proposalsContent.data[0].name.value,
        },
      });
      const governanceData = governanceSchema.safeParse(
        dynamicFieldsObject.data?.content,
      );
      return governanceData;
    },
    select: (governanceData) => {
      if (governanceData.error) return null;
      const sortedProposals = governanceData.data?.fields.value.fields.pos0
        .sort(
          (b, a) => parseInt(a.fields.end_time) - parseInt(b.fields.end_time),
        )
        .map((proposal) => ({
          ...proposal,
          isActive: isFuture(new Date(Number(proposal.fields.end_time ?? 0))),
        }));
      return sortedProposals;
    },
  });
}
