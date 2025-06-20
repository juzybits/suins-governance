"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { isPast } from "date-fns";
import { useGetAllProposals } from "@/hooks/useGetAllProposals";
import { type ProposalObjResp } from "@/types/Proposal";
import { useGetUserStats } from "@/hooks/useGetUserStats";
import Typography from "../ui/typography";
import { CardProposalSummary } from "@/components/staking/staking-card-proposal-summary";

export function PanelRecentProposals() {
  const currAcct = useCurrentAccount();
  const { data: proposals } = useGetAllProposals();
  const { data: userStats } = useGetUserStats({
    user: currAcct?.address,
    proposalIds: proposals?.map((proposal) => proposal.fields.id.id),
  });

  if (proposals === undefined) return null;

  // group proposals into in-progress and ended
  let openProposals: ProposalObjResp[] = []; // only 1 proposal can be open at a time
  let closedProposals: ProposalObjResp[] = [];

  if (proposals.length > 0) {
    const newestProposal = proposals[0]!; // useGetAllProposals returns newest to oldest
    const isClosed = isPast(
      new Date(Number(newestProposal.fields.end_time_ms ?? 0)),
    );
    if (isClosed) {
      // no in-progress proposals
      closedProposals = proposals;
    } else {
      openProposals = [newestProposal];
      closedProposals = proposals.slice(1);
    }
  }

  return (
    <div className="max-h-[100vh] w-full max-w-[56rem] overflow-hidden rounded-l-s rounded-r-s bg-[#62519C2E] text-primary-main backdrop-blur-[10px]">
      <div className="flex flex-col gap-m bg-[#62519C2E] p-m">
        <h2>
          <Typography variant="label/Regular Bold">
            SuiNS Governance Proposals
          </Typography>
        </h2>
      </div>
      <div className="max-h-[40rem] overflow-y-auto p-xl">
        {proposals.length === 0 && <p>No proposals yet</p>}
        {openProposals.length > 0 && (
          <div className="flex flex-col gap-m">
            <h3 className="all-unset">
              <Typography
                variant="label/Small Medium"
                className="block text-center text-secondary"
              >
                VOTING IN PROGRESS
              </Typography>
            </h3>
            {openProposals.map((proposal) => (
              <CardProposalSummary
                key={proposal.fields.id.id}
                proposal={proposal}
                index={proposals.length}
                userStats={userStats?.proposalStats.find(
                  (stat) => stat.proposalId === proposal.fields.id.id,
                )}
              />
            ))}
          </div>
        )}
        {openProposals.length > 0 && closedProposals.length > 0 && (
          <div className="h-xl" />
        )}
        {closedProposals.length > 0 && (
          <div className="flex flex-col gap-m">
            <h3 className="all-unset">
              <Typography
                variant="label/Small Medium"
                className="block text-center text-secondary"
              >
                VOTING ENDED
              </Typography>
            </h3>
            {closedProposals.map((proposal, index) => (
              <CardProposalSummary
                key={proposal.fields.id.id}
                proposal={proposal}
                index={closedProposals.length - index}
                userStats={userStats?.proposalStats.find(
                  (stat) => stat.proposalId === proposal.fields.id.id,
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
