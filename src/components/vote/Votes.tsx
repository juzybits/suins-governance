import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { Heading } from "@/components/ui/legacy/Heading";
import { Text } from "@/components/ui/legacy/Text";
import { formatAddress } from "@mysten/sui/utils";
import { useGetAllVotersDfs } from "@/hooks/useGetAllVotersDfs";

import {
  useGetProposalDetail,
  getTopVotersByVoteType,
  type VoteType,
} from "@/hooks/useGetProposalDetail";
import { Avatar } from "@/components/Avatar";
import { useGetAccountInfo } from "@/hooks/useGetAccountInfo";
import { useExplorerLink } from "@/hooks/useExplorerLink";
import { formatName } from "@/utils/common";
import Loader from "../ui/legacy/Loader";
import {
  useGetVoteCastedByVoterId,
  getVoteTypeWithMostVotes,
} from "@/hooks/useGetVoteCasted";
import { VoteIndicator } from "@/components/ui/legacy/VoteIndicator";
import { NSAmount } from "../ui/legacy/NSAmount";
import { GradientBorder } from "../gradient-border";
import { Divide } from "@/components/ui/legacy/Divide";
import { useState } from "react";
import { truncatedText } from "@/utils/truncatedText";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useCursorPagination } from "@/hooks/useCursorPagination";
import SvgPaginationNext24 from "@/icons/legacy/PaginationNext24";
import SvgPaginationPrev24 from "@/icons/legacy/PaginationPrev24";
import { cn } from "@/utils/cn";
import { useIsPersonVote } from "@/hooks/useIsPersonVote";
import Typography from "../ui/typography";
import clsx from "clsx";
import { SectionLayout } from "./SectionLayout";
import { Button } from "../ui/button";
const PAGE_SIZE = 10;

function VoterDetail({
  voterAddress,
  position,
  objID,
  isPersonVote,
}: {
  voterAddress: string;
  objID: string;
  position: number;
  isPersonVote?: boolean;
}) {
  const { data: accountInfo } = useGetAccountInfo({ address: voterAddress });
  const { data: voter } = useGetVoteCastedByVoterId(objID);
  const isSmallOrAbove = useBreakpoint("sm");
  const formattedAddress = truncatedText({
    text: formatAddress(voterAddress),
    maxLength: isSmallOrAbove ? 40 : 6,
  });
  const formattedName =
    accountInfo?.name &&
    truncatedText({ text: formatName(accountInfo?.name), maxLength: 12 });
  const voteCast = [
    {
      key: "Abstain",
      votes: voter?.abstainVote,
    },
    {
      key: "No",
      votes: voter?.noVote,
    },
    {
      key: "Yes",
      votes: voter?.yesVote,
    },
  ].filter((item) => item.votes && item.votes > 0);

  const explorerLink = useExplorerLink({
    id: voterAddress || "",
    type: "address",
  });

  return (
    <div className="rounded-lg bg-bg-primary p-m">
      <div className="flex w-full flex-col items-center justify-between gap-s">
        <div className="flex w-full items-center justify-between gap-xs md:gap-2.5">
          <div className="flex w-full min-w-[160px] items-center justify-start gap-2.5 text-start md:min-w-[254px]">
            <Typography
              variant="label/Small Bold"
              className="min-w-3 text-tertiary"
            >
              {position}
            </Typography>
            <Avatar address={voterAddress} className="h-[32px] w-[32px]" />
            <Link href={explorerLink} target="_blank">
              <Typography
                variant="label/Small Bold"
                className="text-primary-main"
              >
                {formattedName ?? formattedAddress}
              </Typography>
            </Link>
          </div>
          <NSAmount
            isMedium
            noTokenIcon
            color="text-primary-main"
            amount={voter?.totalVotes ?? 0}
          />
        </div>
        <hr className="w-full border-t border-tertiary/30" />
        <div className="mt-xs flex w-full flex-col items-end justify-end gap-xs">
          {voteCast?.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-end gap-xs"
            >
              <VoteIndicator
                onlyStatus
                isPersonVote={isPersonVote}
                votedStatus={item.key as VoteType}
              />
              <NSAmount
                isMedium
                noTokenIcon
                className="w-fit"
                amount={item?.votes ?? 0}
                color={
                  item.key === "Yes"
                    ? "text-semantic-good"
                    : item.key === "No"
                      ? "text-semantic-issue"
                      : "text-semantic-warning"
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AllVoter({
  proposalId,
  topVotersSwitch,
  isPersonVote,
}: {
  proposalId: string;
  topVotersSwitch: () => void;
  isPersonVote?: boolean;
}) {
  const { data: resp } = useGetProposalDetail({ proposalId });
  const allVotersQuery = useGetAllVotersDfs({
    votersLinkedTableId: resp?.fields.voters.fields.id.id,
    size: PAGE_SIZE,
  });

  const {
    data: lists,
    isFetching,
    pagination,
  } = useCursorPagination(allVotersQuery);

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        variants={container}
        transition={{ ease: [0.17, 0.67, 0.83, 0.67] }}
        animate="show"
        className="gap-2024_XL flex flex-col"
      >
        <SectionLayout title="All Voters">
          {isFetching && <Loader className="h-3 w-3" />}
          <div
            className={cn(
              "flex flex-col gap-s",
              // prevent jumping between pages
              !pagination.hasNext && pagination.hasPrev && "min-h-[519px]",
            )}
          >
            {lists?.data?.map((voter, index) => (
              <motion.div
                key={voter.name.value}
                variants={{
                  hidden: { opacity: pagination.currentPage + 1 > 1 ? 1 : 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2,
                    },
                  },
                }}
              >
                <VoterDetail
                  key={voter.name.value}
                  objID={voter.objectId}
                  voterAddress={voter.name.value}
                  position={index + 1 + pagination.currentPage * PAGE_SIZE}
                  isPersonVote={isPersonVote}
                />
              </motion.div>
            ))}
          </div>
          <hr className="border-secondary/10" />
          <div className="flex flex-col-reverse items-center justify-between gap-l md:flex-row">
            <Button
              variant="short/outline"
              onClick={topVotersSwitch}
              className="w-full bg-bg-modal md:w-fit"
            >
              <Typography
                className="text-secondary"
                variant="label/Regular Bold"
              >
                View Top Voters
              </Typography>
            </Button>
            <div className="flex gap-xs">
              <Button
                variant="outline/small"
                onClick={() => pagination.onPrev()}
                className={clsx(
                  "!rounded-2xs px-xs",
                  !pagination.hasPrev && "opacity-50",
                )}
              >
                <SvgPaginationPrev24
                  fill={
                    pagination.hasPrev
                      ? "fillContent-secondary"
                      : "fillContent-tertiary"
                  }
                />
              </Button>
              <Button
                variant="outline/small"
                disabled={!pagination.hasNext}
                onClick={() => pagination.onNext()}
                className={clsx(
                  "!rounded-2xs px-xs",
                  !pagination.hasNext && "opacity-50",
                )}
              >
                <SvgPaginationNext24
                  fill={
                    pagination.hasNext
                      ? "fillContent-secondary"
                      : "fillContent-tertiary"
                  }
                />
              </Button>
            </div>
          </div>
        </SectionLayout>
      </motion.div>
    </AnimatePresence>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,

    transition: {
      staggerChildren: 0.1,
    },
  },
};

function TopVoter({
  address,
  votes,
  voteType,
  isPersonVote,
}: {
  address: string;
  votes: number;
  voteType?: VoteType;
  isPersonVote?: boolean;
}) {
  const { data: accountInfo } = useGetAccountInfo({ address });

  const formattedAddress = truncatedText({
    text: formatAddress(address),
    maxLength: 6,
  });
  const formattedName =
    accountInfo?.name &&
    truncatedText({ text: formatName(accountInfo?.name), maxLength: 12 });

  const explorerLink = useExplorerLink({
    id: address,
    type: "address",
  });

  return (
    <div className="flex max-w-[118px] flex-col items-center gap-xs">
      <div className="flex max-w-[118px] flex-col items-center justify-center gap-xs">
        <div className="relative h-[44px] w-[44px]">
          <Avatar address={address} className="h-[44px] w-[44px]" />
        </div>
        <Link href={explorerLink} target="_blank">
          <Typography
            variant="label/Small Bold"
            className="w-full text-center text-primary-main"
          >
            {formattedName ?? formattedAddress}
          </Typography>
        </Link>
        {voteType && (
          <VoteIndicator
            votedStatus={voteType}
            onlyStatus={true}
            isPersonVote={isPersonVote}
          />
        )}
        <Typography
          variant="label/Small Bold"
          className="flex w-full gap-2xs text-center text-primary-main text-secondary"
        >
          <NSAmount amount={votes} isSmall centerAlign noTokenIcon /> Votes
        </Typography>
      </div>
    </div>
  );
}

function TopVoters({
  proposalId,
  allVotersSwitch,
  isPersonVote,
}: {
  proposalId: string;
  allVotersSwitch: () => void;
  isPersonVote?: boolean;
}) {
  const { data: resp } = useGetProposalDetail({ proposalId });
  const voteTypes: VoteType[] = ["Yes", "No", "Abstain"];
  const voteTypesWithPerson = ["Nigri", "Welp", "William"];
  const [currentVoteTypeIndex, setCurrentVoteTypeIndex] = useState(0);

  if (!resp?.fields.vote_leaderboards.fields.contents) {
    return null;
  }

  const topVoters = getTopVotersByVoteType(
    resp.fields.vote_leaderboards.fields.contents,
  );
  if (!topVoters) return null;

  const availableVoteTypes = voteTypes.filter((type) => {
    const voters = topVoters.get(type);
    return voters && voters.length > 0;
  });

  // If no vote types have top voters, return null
  if (availableVoteTypes.length === 0) return null;

  // Get the current vote type and corresponding voters
  const currentVoteType = availableVoteTypes[currentVoteTypeIndex];
  const currentTopVoters = topVoters.get(currentVoteType!);

  if (!currentTopVoters || currentTopVoters.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        variants={container}
        transition={{ ease: [0.17, 0.67, 0.83, 0.67] }}
        animate="show"
        className="flex flex-col gap-xl"
      >
        <SectionLayout
          title="Top Voters"
          aux={
            <div className="flex justify-between gap-1">
              <div className="flex gap-xs">
                {voteTypes.map((type, index) => {
                  const isAvailable = !!topVoters.get(type)?.length;
                  return (
                    <Button
                      variant="outline/small"
                      className={clsx(
                        "!rounded-xs",
                        currentVoteType === type && "!bg-tertiary",
                        isAvailable && "hover:opacity-65",
                      )}
                      key={type}
                      disabled={!isAvailable}
                      onClick={() => {
                        const index = availableVoteTypes.indexOf(type);
                        if (index !== -1) {
                          setCurrentVoteTypeIndex(index);
                        }
                      }}
                      color="fillContent-secondary"
                    >
                      <Typography
                        variant="label/XSmall SemiBold"
                        className={clsx(
                          "leading-none",
                          isAvailable ? "text-secondary" : "text-tertiary",
                        )}
                      >
                        {isPersonVote ? voteTypesWithPerson[index] : type}
                      </Typography>
                    </Button>
                  );
                })}
              </div>
            </div>
          }
        >
          <div className="grid grid-cols-3 gap-xl md:grid-cols-5 md:gap-3xl">
            {currentTopVoters.map((voter) => (
              <motion.div
                key={voter.address}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 2.5,
                    },
                  },
                }}
              >
                <TopVoter
                  votes={voter.votes}
                  address={voter.address}
                  voteType={currentVoteType}
                  isPersonVote={isPersonVote}
                />
              </motion.div>
            ))}
          </div>
          <hr className="border-secondary/10" />
          <div className="flex flex-col-reverse items-center justify-between gap-xs md:flex-row">
            <Button
              variant="short/outline"
              onClick={allVotersSwitch}
              className="w-full bg-[#62519c66] md:w-fit"
            >
              <Typography
                className="text-secondary"
                variant="label/Regular Bold"
              >
                View All Voters
              </Typography>
            </Button>
          </div>
        </SectionLayout>
      </motion.div>
    </AnimatePresence>
  );
}

export function Votes({ proposalId }: { proposalId: string }) {
  const { data: resp } = useGetProposalDetail({ proposalId });
  const isPersonVote = useIsPersonVote(proposalId);
  const [topVoters, setTopVoters] = useState(false);

  if (!resp || Number(resp?.fields.voters.fields.size || 0) < 1) return null;

  const counts = resp?.fields.voters.fields.size;

  return (
    <div className="relative flex w-full flex-col gap-xl rounded-s">
      <div className="flex gap-s text-primary-main">
        <Typography variant="display/XSmall Light">Votes</Typography>
        {counts !== undefined && (
          <div className="flex w-fit items-center justify-center rounded-full bg-bg-secondary px-m py-s text-secondary">
            <Typography variant="label/Regular Bold">{counts}</Typography>
          </div>
        )}
      </div>
      {topVoters ? (
        <TopVoters
          proposalId={proposalId}
          isPersonVote={isPersonVote}
          allVotersSwitch={() => setTopVoters(false)}
        />
      ) : (
        <SectionLayout title="All Voters">
          <AllVoter
            proposalId={proposalId}
            isPersonVote={isPersonVote}
            topVotersSwitch={() => setTopVoters(true)}
          />
        </SectionLayout>
      )}
    </div>
  );
}
