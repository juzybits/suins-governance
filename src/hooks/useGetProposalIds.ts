import { client } from "@/app/SuinsClient";
import { useQuery } from "@tanstack/react-query";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { governanceSchema } from "@/schemas/governanceSchema";
import isFuture from "date-fns/isFuture";

/**
 * @deprecated use `useGetAllProposals` instead
 */
export function useGetProposalIds() {
  return useQuery({
    queryKey: ["proposal-ids"],
    queryFn: async () => {
      const proposalsContent = await client.getDynamicFields({
        parentId: SUINS_PACKAGES[NETWORK].governanceObjId,
        limit: 20,
      });

      if (proposalsContent.data.length === 0) {
        return [];
      }

      if (
        !proposalsContent.data[0]?.name.type ||
        !proposalsContent.data[0]?.name.value
      ) {
        throw new Error("No type found");
      }

      const dynamicFieldsObject = await client.getDynamicFieldObject({
        parentId: SUINS_PACKAGES[NETWORK].governanceObjId,
        name: {
          type: proposalsContent.data[0].name.type,
          value: proposalsContent.data[0].name.value,
        },
      });
      const governanceData = governanceSchema.safeParse(
        dynamicFieldsObject.data?.content,
      );

      if (governanceData.error) return [];

      const proposals = governanceData.data?.fields.value.fields.pos0;
      // if (NETWORK === "mainnet") {
      //   proposals.push(...V1_PROPOSAL_IDS);
      // }

      return proposals;
    },
    select: (proposals) => {
      const sortedProposals = proposals
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
