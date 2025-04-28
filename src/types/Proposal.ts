import { type z } from "zod";
import { type proposalV2Schema } from "@/schemas/proposalV2Schema";
import { type proposalV1Schema } from "@/schemas/proposalV1Schema";

export type ProposalObjResp =
  | z.infer<typeof proposalV1Schema>
  | z.infer<typeof proposalV2Schema>;

/**
 * Mirrors proposal_v2::calculate_reward() in Sui contract
 */
export const calculateReward = ({
  proposal,
  userPower,
}: {
  proposal: ProposalObjResp;
  userPower: bigint;
}): bigint => {
  if (proposal.version === 1) {
    return 0n;
  }
  const totalPower = BigInt(proposal.fields.total_power);
  if (totalPower == 0n) {
    return 0n;
  }
  const totalReward = BigInt(proposal.fields.total_reward);
  return (userPower * totalReward) / totalPower;
};
