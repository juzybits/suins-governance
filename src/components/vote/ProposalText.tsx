import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

import { useBreakpoint } from "@/hooks/useBreakpoint";
import { ProposalStatus } from "../ui/legacy/ProposalStatus";

import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { isPast } from "date-fns";
import { formatContractText } from "@/utils/formatContractText";
import { ContentBlockParser } from "../ui/legacy/ContentBlockParser";
import { useIsPersonVote } from "@/hooks/useIsPersonVote";
import Typography from "../ui/typography";
import { Button } from "../ui/button";
import { Voting } from ".";
import clsx from "clsx";

export function ProposalText({ proposalId }: { proposalId: string }) {
  const isSmallOrAbove = useBreakpoint("sm");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false); // Check if the content overflows
  const contentRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useGetProposalDetail({ proposalId });
  const isPersonVote = useIsPersonVote(proposalId);
  const toggleExpanded = () => setIsExpanded(!isExpanded);
  const description = formatContractText(data?.fields.description ?? "");

  useEffect(() => {
    // Check if the content height is more than 350px
    if (contentRef.current && contentRef.current.scrollHeight > 350) {
      setIsOverflowing(true); // Show "Show More" button if height exceeds 350px
    }
  }, [isLoading]);

  const isClosed = isPast(new Date(Number(data?.fields.end_time_ms ?? 0)));

  if (!description || isLoading) return null;

  return (
    <section className="relative flex w-full flex-col gap-xl xl:gap-4xl">
      <div className="flex flex-col gap-xl">
        <ProposalStatus
          status={
            isClosed
              ? isPersonVote && data?.fields.winning_option !== null
                ? "passed"
                : data?.fields.winning_option?.fields.pos0 === "Yes"
                  ? "passed"
                  : data?.fields.winning_option === null && isClosed
                    ? "pending"
                    : "failed"
              : "active"
          }
        />
        <Typography
          variant="display/Regular"
          className="text-start capitalize text-primary-main"
        >
          {data?.fields.title}
        </Typography>
      </div>
      <div className="flex flex-col gap-s xl:hidden">
        <Voting proposalId={proposalId} />
      </div>
      <div className="flex flex-col gap-xl">
        <Typography
          variant="display/XSmall Light"
          className="text-start capitalize text-primary-main"
        >
          Description
        </Typography>
        <div
          className={clsx(
            "flex flex-col gap-l",
            isOverflowing && !isExpanded && "fade-out-div",
          )}
        >
          <motion.div
            ref={contentRef}
            initial={false}
            animate={{
              height: isExpanded ? "auto" : 350,
              opacity: isExpanded ? 1 : 0.85,
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="text-proposal-text gap-2024_M relative flex flex-col overflow-hidden"
          >
            {description?.map((desc, index) => (
              <Typography
                variant={
                  isSmallOrAbove ? "paragraph/Regular" : "paragraph/Large"
                }
                className="text-primary-main"
                key={index + desc.substring(0, 20)}
              >
                <ContentBlockParser text={desc} />
              </Typography>
            ))}
          </motion.div>
          {/* Fade effect */}
          {!isExpanded && isOverflowing && (
            <div className="bg-show-more-gradient pointer-events-none absolute bottom-16 left-0 right-0 h-28" />
          )}
        </div>
        {/* Show "Show More" button only if content exceeds 350px */}
        {isOverflowing && (
          <div className="relative">
            <Button
              onClick={toggleExpanded}
              variant="outline/small"
              className="relative mt-4 self-start border-2 border-[#6E609F] bg-[#221C3603] transition-all"
            >
              <Typography
                variant="label/Regular Bold"
                className="text-secondary"
              >
                {isExpanded ? "Show Less" : "Show More"}
              </Typography>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
