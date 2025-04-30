/* in-memory cache for finalized (immutable) proposals */

import { type ProposalObjResp } from "@/types/Proposal";
import { normalizeSuiAddress } from "@mysten/sui/utils";

const finalizedProposalCache = new Map<string, ProposalObjResp>();

/**
 * Get a cached finalized proposal by ID, or undefined if not cached.
 */
export function getCachedProposal(id: string): ProposalObjResp | undefined {
  const normalizedId = normalizeSuiAddress(id);
  return finalizedProposalCache.get(normalizedId);
}

/**
 * Cache a finalized proposal.
 */
export function cacheProposal(
  proposal: ProposalObjResp,
): void {
  const normalizedId = normalizeSuiAddress(proposal.fields.id.id);
  finalizedProposalCache.set(normalizedId, proposal);
}

/**
 * Check if a proposal is finalized (immutable).
 */
export function isFinalized(proposal: ProposalObjResp): boolean {
  return proposal.fields.winning_option !== null;
}
