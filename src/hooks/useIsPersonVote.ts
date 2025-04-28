import { NETWORK } from "@/constants/env";

import { useGetProposalDetail } from "./useGetProposalDetail";
import { type SupportedNetwork } from "@/constants/endpoints";

// Proposal IDs for team votes
const PROPOSAL_IDS: Record<SupportedNetwork, number[]> = {
  mainnet: [4],
  testnet: [11, 12, 13],
  devnet: [],
  localnet: [],
};
export function useIsPersonVote(proposalId: string) {
  const { data: proposalDetail } = useGetProposalDetail({
    proposalId,
  });
  return PROPOSAL_IDS[NETWORK].includes(
    Number(proposalDetail?.fields.serial_no),
  );
}
