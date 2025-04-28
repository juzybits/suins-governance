"use client";

import { formatNSBalance } from "@/utils/formatNumber";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { parseProposalVotes } from "@/hooks/useGetProposalDetail";
import { isPast } from "date-fns";
import { useCalcVotingStats } from "@/hooks/useCalcVotingStats";
import { useGetAllProposals } from "@/hooks/useGetAllProposals";
import { type ProposalObjResp } from "@/types/Proposal";
import {
  useGetUserStats,
  type UserProposalStats,
} from "@/hooks/useGetUserStats";

// TODO-J: group into "voting in progress" and "voting ended"
export function PanelRecentProposals() {
  const currAcct = useCurrentAccount();
  const { data: proposals } = useGetAllProposals();
  const { data: userStats } = useGetUserStats({
    user: currAcct?.address,
    proposalIds: proposals?.map((proposal) => proposal.fields.id.id),
  });

  return (
    <div className="panel">
      <h2>Recent Proposals</h2>
      {proposals?.map((proposal) => (
        <CardProposalSummary
          key={proposal.fields.id.id}
          proposal={proposal}
          userStats={userStats?.proposalStats.find(
            (stat) => stat.proposalId === proposal.fields.id.id,
          )}
        />
      ))}
      {userStats && (
        <div>
          <h2>Your Lifetime Rewards:</h2>
          <p>{formatNSBalance(userStats.totalReward)}</p>
        </div>
      )}
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
  // Calculate overall voting statistics
  const votes = parseProposalVotes(proposal);
  const stats = useCalcVotingStats({
    ...votes,
    threshold: Number(proposal?.fields.threshold),
  });

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

        <div>
          <h3>Overall Votes</h3>
          <div>
            <p>
              Yes: {stats.yesVotes} ({stats.yesPercentage}%)
            </p>
            <p>
              No: {stats.noVotes} ({stats.noPercentage}%)
            </p>
            <p>
              Abstain: {stats.abstainVotes} ({stats.abstainPercentage}%)
            </p>
            <p>Total votes: {stats.totalVotes}</p>
            <p>
              Threshold: {stats.threshold}{" "}
              {stats.thresholdReached ? "(Reached)" : "(Not reached)"}
            </p>
          </div>
        </div>

        {userStats && (
          <div>
            <h3>Your Participation</h3>
            <div>
              <p>Your Votes: {formatNSBalance(userStats.power)}</p>
              <p>Your Rewards: {formatNSBalance(userStats.reward)}</p>
            </div>
          </div>
        )}
      </div>
      <hr />
    </div>
  );
}
