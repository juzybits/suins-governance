import { client } from "@/app/SuinsClient";
import { useQuery } from "@tanstack/react-query";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { governanceSchema } from "@/schemas/governanceSchema";
import isFuture from "date-fns/isFuture";

// TODO: support pagination
export function useGetProposalIds() {
  return useQuery({
    queryKey: ["proposal-ids"],
    queryFn: async () => {
      const proposalsContent = await client.getDynamicFields({
        parentId: SUINS_PACKAGES[NETWORK].governanceObjId,
        limit: 20,
      });

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
      if (NETWORK === "mainnet") {
        proposals.push(...V1_PROPOSAL_IDS);
      }

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

const V1_PROPOSAL_IDS = [
  // #1: SuiNS DAO Constitution
  {
    type: "0xd43eeaa30cb62d94ecf7d2a2283913486bfd9288926f9f7ff237ac7a6cb44b41::early_voting::ProposalPointer",
    fields: {
      end_time: "1732816800000",
      proposal_id:
        "0xd4c794821436f03f1dc8321f4939c17d67c54aa6661a7b8dee12b3d179601001",
    },
  },
  // #2: SuiNS Pricing & Renewal Rates
  {
    type: "0xd43eeaa30cb62d94ecf7d2a2283913486bfd9288926f9f7ff237ac7a6cb44b41::early_voting::ProposalPointer",
    fields: {
      end_time: "1734811200000",
      proposal_id:
        "0x8e71b81bd327fc8ae721518ccbfc0964fe19c8300773307eb6f0746e7f620b8f",
    },
  },
  // #3: SuiNS RFP Selection
  {
    type: "0xd43eeaa30cb62d94ecf7d2a2283913486bfd9288926f9f7ff237ac7a6cb44b41::early_voting::ProposalPointer",
    fields: {
      end_time: "1740175200000",
      proposal_id:
        "0x9ee1af58d737418649101836c8ba926cbe28e522e22e315dd7bd649c94425a0b",
    },
  },
];
