/**
 * Given "0x123::proposal_v2::ProposalV2" it returns `2`
 */
export function getProposalVersion(objectType: string): 1 | 2 {
  const struct = objectType.split("::")[2];
  if (!struct) {
    throw new Error("Invalid proposal object type");
  }
  if (struct === "Proposal") {
    return 1;
  }
  if (struct === "ProposalV2") {
    return 2;
  }
  throw new Error("Invalid proposal object type");
}
