import { NETWORK } from "@/constants/env";

import { useGetProposalDetail } from "./useGetProposalDetail";

export function useIsPersonVote(proposalId: string) {
  const { data: proposalDetail } = useGetProposalDetail({
    proposalId,
  });
  return NETWORK === "testnet" &&
    (Number(proposalDetail?.fields.serial_no) === 11 ||
      Number(proposalDetail?.fields.serial_no) === 12)
    ? true
    : NETWORK === "mainnet" && Number(proposalDetail?.fields.serial_no) === 4
      ? true
      : false;
}
