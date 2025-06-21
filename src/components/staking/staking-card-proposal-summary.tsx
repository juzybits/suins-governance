"use client";

import { isPast } from "date-fns";
import { useRouter } from "next/navigation";
import { type ProposalObjResp } from "@/types/Proposal";
import { type UserProposalStats } from "@/hooks/useGetUserStats";
import Typography from "../ui/typography";
import Badge from "../ui/badge";
import clsx from "clsx";
import { GradientBorder } from "../gradient-border";
import NSToken from "@/icons/legacy/NSToken";
import { VotingStatus } from "../vote/VotingStatus";
import { formatNSBalance } from "@/utils/coins";

export function CardProposalSummary({
  index,
  proposal: { fields },
  userStats,
}: {
  index: number;
  proposal: ProposalObjResp;
  userStats: UserProposalStats | undefined;
}) {
  const router = useRouter();
  const isClosed = isPast(new Date(Number(fields.end_time_ms ?? 0)));

  let status = "active";

  if (isClosed) {
    if (fields.winning_option?.fields.pos0 === "Yes") status = "passed";
    else if (fields.winning_option === null) status = "pending";
    else status = "failed";
  }

  const handleClick = () => {
    router.push(`/proposal/${fields.id.id}`);
  };

  return (
    <GradientBorder
      variant="green_blue_pink"
      className={clsx(
        "rounded-xs",
        status === "active" ? "border-2" : "border-0",
      )}
    >
      <div
        className={clsx(
          "flex cursor-pointer flex-col gap-xs rounded-xs p-m transition-opacity hover:opacity-80",
          status === "active" ? "bg-primary-darker" : "bg-[#62519C2E]",
        )}
        onClick={handleClick}
      >
        <h2 className="all-unset">
          <Typography variant="display/XXXSmall Light">
            #{index} {fields.title}
          </Typography>
        </h2>
        {status === "active" && (
          <VotingStatus progressOnly proposalId={fields.id.id} />
        )}
        <div className="flex items-end gap-xs">
          {status === "active" ? (
            <Typography variant="label/Small Bold" className="flex-1">
              Voting in progress
            </Typography>
          ) : (
            <Badge variant={status === "passed" ? "positive" : "negative"}>
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
              {status === "active" && "Ends "}
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
            {status !== "active" && (
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
