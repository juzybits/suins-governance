"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { isPast } from "date-fns";
import { useGetAllProposals } from "@/hooks/useGetAllProposals";
import { type ProposalObjResp } from "@/types/Proposal";
import {
  useGetUserStats,
  type UserProposalStats,
} from "@/hooks/useGetUserStats";
import Typography from "../ui/typography";
import Badge from "../ui/badge";
import clsx from "clsx";
import { GradientBorder } from "../gradient-border";
import NSToken from "@/icons/legacy/NSToken";
import { VotingStatus } from "../VotingStatus";
import { formatNSBalance } from "@/utils/coins";

export function HomeRecentProposals() {
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
    <div className="flex w-full flex-col px-s">
      <div className="flex w-full flex-col items-center gap-2xl">
        <h2 className="all-unset">
          <Typography
            variant="display/XSmall"
            className="flex text-center text-primary-main"
          >
            Recent Proposals
          </Typography>
        </h2>
        <div className="w-full max-w-[56rem] overflow-hidden rounded-m text-primary-main backdrop-blur-[10px]">
          <div className="max-h-[40rem] overflow-y-auto bg-[#62519C2E] p-m">
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
                    index={proposals.length + 1}
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
                {closedProposals.map((proposal, index) => (
                  <CardProposalSummary
                    key={proposal.fields.id.id}
                    proposal={proposal}
                    index={proposals.length - index}
                    userStats={userStats?.proposalStats.find(
                      (stat) => stat.proposalId === proposal.fields.id.id,
                    )}
                  />
                ))}
              </div>
            )}
          </div>
          {userStats && userStats.totalReward > 0n && (
            <div className="flex flex-col gap-s bg-[#D34BFF0D] px-m py-l">
              <h2>
                <Typography
                  variant="label/Small Medium"
                  className="block text-center uppercase text-secondary"
                >
                  Your Lifetime Rewards
                </Typography>
              </h2>
              <p className="flex items-center justify-center gap-s">
                <Typography variant="display/XXSmall Light">
                  {formatNSBalance(userStats.totalReward)}
                </Typography>{" "}
                <NSToken width="100%" className="max-w-[2rem]" />
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CardProposalSummary({
  index,
  proposal: { fields },
  userStats,
}: {
  index: number;
  proposal: ProposalObjResp;
  userStats: UserProposalStats | undefined;
}) {
  const isClosed = isPast(new Date(Number(fields.end_time_ms ?? 0)));

  let status = "active";

  if (isClosed) {
    if (fields.winning_option?.fields.pos0 === "Yes") status = "passed";
    else if (fields.winning_option === null) status = "pending";
    else status = "failed";
  }

  return (
    <GradientBorder
      variant="green_blue_pink"
      className={clsx(
        "rounded-xs",
        status === "pending" ? "border-2" : "border-0",
      )}
    >
      <div
        className={clsx(
          "flex flex-col gap-xs rounded-xs p-m",
          status === "pending" ? "bg-primary-darker" : "bg-[#62519C2E]",
        )}
      >
        <h2 className="all-unset">
          <Typography variant="display/XXXSmall Light">
            #{index} {fields.title}
          </Typography>
        </h2>
        {status === "pending" && (
          <VotingStatus progressOnly proposalId={fields.id.id} />
        )}
        <div className="flex items-end gap-xs">
          {status === "pending" ? (
            <Typography variant="label/Small Bold" className="flex-1">
              Voting in progress
            </Typography>
          ) : (
            <Badge variant="positive">
              <Typography
                variant="label/XSmall SemiBold"
                className="capitalize"
              >
                {status}
              </Typography>
            </Badge>
          )}
          <p>
            <Typography variant="paragraph/XSmall" className="text-secondary">
              {status === "pending" && "Ends "}
            </Typography>
            <Typography
              variant="paragraph/XSmall"
              className="uppercase text-secondary"
            >
              {new Date(Number(fields.end_time_ms)).toLocaleDateString()}
            </Typography>
          </p>
        </div>
        {userStats && (
          <>
            {status !== "pending" && (
              <hr className="mt-xs border-primary-inactive opacity-30" />
            )}
            <div className="flex items-center gap-2xs">
              <Typography
                variant="label/Small Medium"
                className="text-secondary"
              >
                Your Votes: {formatNSBalance(userStats?.power ?? 0)}
              </Typography>
              <span className="text-secondary opacity-30">•</span>
              <Typography
                variant="label/Small Medium"
                className="flex items-center gap-xs whitespace-nowrap text-secondary"
              >
                Your Rewards: {formatNSBalance(userStats?.reward ?? 0)}{" "}
                <NSToken />
              </Typography>
            </div>
          </>
        )}
      </div>
    </GradientBorder>
  );
}
