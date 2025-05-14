import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

import { Heading } from "@/components/ui.legacy/Heading";
import { Text } from "@/components/ui.legacy/Text";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { ProposalStatus } from "./ui.legacy/ProposalStatus";
import { Button } from "./ui.legacy/button/Button";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { isPast } from "date-fns";
import { formatContractText } from "@/utils/formatContractText";
import { ContentBlockParser } from "./ui.legacy/ContentBlockParser";
import { useIsPersonVote } from "@/hooks/useIsPersonVote";

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
    <section className="relative flex w-full flex-col gap-2024_4XL sm:gap-2024_5XL">
      <div className="flex flex-col gap-2024_XL">
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

        <Heading variant="H3/extraBold" className="text-start capitalize">
          {data?.fields.title}
        </Heading>
      </div>
      <div className="flex flex-col gap-2024_3XL">
        <Heading variant="H4/super">Description</Heading>
        <div className="flex flex-col gap-2024_L">
          <motion.div
            ref={contentRef}
            initial={false}
            animate={{
              height: isExpanded ? "auto" : 350,
              opacity: isExpanded ? 1 : 0.85,
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="text-proposal-text relative flex flex-col gap-2024_M overflow-hidden"
          >
            {description?.map((desc, index) => (
              <Text
                variant={isSmallOrAbove ? "P1/regular" : "P2/regular"}
                color="fillContent-primary"
                key={index + desc.substring(0, 20)}
              >
                <ContentBlockParser text={desc} />
              </Text>
            ))}
          </motion.div>
          {/* Fade effect */}
          {!isExpanded && isOverflowing && (
            <div className="pointer-events-none absolute bottom-16 left-0 right-0 h-28 bg-show-more-gradient" />
          )}

          {/* Show "Show More" button only if content exceeds 350px */}
          {isOverflowing && (
            <Button
              onClick={toggleExpanded}
              variant="short"
              className="mt-4 self-start border-2 border-[#6E609F] bg-[#221C3603] transition-all"
            >
              <Text variant="LABEL/bold" color="fillContent-secondary">
                {isExpanded ? "Show Less" : "Show More"}
              </Text>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
