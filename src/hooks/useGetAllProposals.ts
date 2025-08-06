import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";
import { devInspectAndGetReturnValues } from "@polymedia/suitcase-core";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import { parseProposalObjResp } from "./useGetProposalDetail";
import {
  getCachedProposal,
  cacheProposalIfFinalized,
} from "@/utils/proposalCache";
import { type ProposalObjResp } from "@/types/Proposal";

const OFFSET = 0;
const LIMIT = 50;

/**
 * Fetch all proposals with just 2 RPC queries.
 * Limited to the latest 50 proposals. Needs pagination to support more.
 */
export function useGetAllProposals() {
  const suiClient = useSuiClient();
  return useQuery({
    queryKey: ["all-proposals"],
    queryFn: async () => {
      // fetch proposal ids
      let proposalIds: string[] = [];
      try {
        const tx = new Transaction();
        tx.moveCall({
          target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::early_voting::get_proposal_ids`,
          arguments: [
            tx.object(SUINS_PACKAGES[NETWORK].governanceObjId),
            tx.pure.u64(OFFSET),
            tx.pure.u64(LIMIT),
          ],
        });
        const retVals = await devInspectAndGetReturnValues(suiClient, tx, [
          [bcs.vector(bcs.Address)],
        ]);
        proposalIds = retVals[0]![0]! as string[];
      } catch (e) {
        console.debug("[useGetAllProposals] devinspect failed:", e);
      }

      // add governance v1 proposal IDs
      if (NETWORK === "mainnet") {
        proposalIds.push(...V1_PROPOSAL_IDS);
      }

      // reuse cached proposals
      const proposals: ProposalObjResp[] = [];
      const uncachedIds: string[] = [];
      for (const id of proposalIds) {
        const cached = getCachedProposal(id);
        if (cached) {
          proposals.push(cached);
        } else {
          uncachedIds.push(id);
        }
      }

      if (uncachedIds.length === 0) {
        return sortProposals(proposals);
      }

      try {
        const objs = await suiClient.multiGetObjects({
          ids: uncachedIds.slice(0, LIMIT),
          options: {
            showContent: true,
            showType: true,
          },
        });
        const fetchedProposals = objs.map(parseProposalObjResp);

        // cache finalized proposals
        fetchedProposals.forEach(cacheProposalIfFinalized);

        return sortProposals([...proposals, ...fetchedProposals]);
      } catch (e) {
        console.debug("[useGetAllProposals] multiGetObjects failed:", e);
        return sortProposals(proposals);
      }
    },
  });
}

const V1_PROPOSAL_IDS = [
  // #5: SuiNS Buyback & Burn
  "0xb36e45e41dfb033153e9174eef9932a5c93d4b8ad078e3344a3d91aa8996139f",
  // #4: Community Council voting
  "0x94952ab99ac0303b9857d6e40ef478b0156f4680f4a069d042525ffdfd44ecc5",
  // #3: SuiNS RFP Selection
  "0x9ee1af58d737418649101836c8ba926cbe28e522e22e315dd7bd649c94425a0b",
  // #2: SuiNS Pricing & Renewal Rates
  "0x8e71b81bd327fc8ae721518ccbfc0964fe19c8300773307eb6f0746e7f620b8f",
  // #1: SuiNS DAO Constitution
  "0xd4c794821436f03f1dc8321f4939c17d67c54aa6661a7b8dee12b3d179601001",
];

/**
 * Sort proposals by end time in descending order (newest first)
 */
function sortProposals(proposals: ProposalObjResp[]) {
  return proposals.sort((a, b) =>
    a.fields.end_time_ms > b.fields.end_time_ms ? -1 : 1,
  );
}
