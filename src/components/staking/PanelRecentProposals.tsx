"use client";

import { formatNSBalance } from "@/utils/formatNumber";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { isPast } from "date-fns";
import { useGetAllProposals } from "@/hooks/useGetAllProposals";
import { type ProposalObjResp } from "@/types/Proposal";
import {
  useGetUserStats,
  type UserProposalStats,
} from "@/hooks/useGetUserStats";
import { VotingStatus } from "@/components/VotingStatus";
import Typography from "../ui/typography";

export function PanelRecentProposals() {
  const currAcct = useCurrentAccount();
  const { data: proposals } = useGetAllProposals();
  const { data: userStats } = useGetUserStats({
    user: currAcct?.address,
    proposalIds: proposals?.map((proposal) => proposal.fields.id.id),
  });

  if (proposals === undefined) return null;

  // group proposals into in-progress and ended
  let openProposals: ProposalObjResp[] = [];
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
    <div className="flex flex-col items-center gap-2xl">
      <h2 className="all-unset">
        <Typography
          variant="display/XSmall"
          className="flex text-center text-primary-main"
        >
          Recent Proposals
        </Typography>
      </h2>
      <div className="w-full max-w-[56rem] rounded-m bg-[#62519C2E] p-m text-primary-main">
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
                userStats={userStats?.proposalStats.find(
                  (stat) => stat.proposalId === proposal.fields.id.id,
                )}
              />
            ))}
          </div>
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
            {closedProposals.map((proposal) => (
              <CardProposalSummary
                key={proposal.fields.id.id}
                proposal={proposal}
                userStats={userStats?.proposalStats.find(
                  (stat) => stat.proposalId === proposal.fields.id.id,
                )}
              />
            ))}
          </div>
        )}
        {userStats && userStats.totalReward > 0n && (
          <div>
            <h2>Your Lifetime Rewards:</h2>
            <p>{formatNSBalance(userStats.totalReward)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CardProposalSummary({
  proposal,
  userStats,
}: {
  proposal: ProposalObjResp;
  userStats: UserProposalStats | undefined;
}) {
  const isClosed = isPast(new Date(Number(proposal.fields.end_time_ms ?? 0)));
  const fields = proposal.fields;

  let status = "active";
  if (isClosed) {
    if (fields.winning_option?.fields.pos0 === "Yes") {
      status = "passed";
    } else if (fields.winning_option === null) {
      status = "pending";
    } else {
      status = "failed";
    }
  }

  return (
    <div>
      <h2>{fields.title}</h2>
      <div>
        <div>Status: {status}</div>
        <p>
          End time: {new Date(Number(fields.end_time_ms)).toLocaleDateString()}
        </p>

        {userStats && (
          <div>
            <h3>Your Participation</h3>
            <div>
              <p>Your Votes: {formatNSBalance(userStats.power)}</p>
              <p>Your Rewards: {formatNSBalance(userStats.reward)}</p>
            </div>
          </div>
        )}

        <VotingStatus proposalId={proposal.fields.id.id} />
      </div>
      <br />
      <hr />
    </div>
  );
}
