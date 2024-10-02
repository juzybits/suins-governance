import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { formatAddress } from "@mysten/sui/utils";
import { useGetAllVoters } from "@/hooks/useGetAllVoters";
import {
  useGetProposalDetail,
  getTopVotersByVoteType,
  type VoteType,
} from "@/hooks/useGetProposalDetail";
import { Avatar } from "@/components/Avatar";
import { useGetAccountInfo } from "@/hooks/useGetAccountInfo";
import { useExplorerLink } from "@/hooks/useExplorerLink";
import { formatName } from "@/utils/common";
import Loader from "./ui/Loader";
import {
  useGetVoteCastedById,
  getVoteTypeWithMostVotes,
} from "@/hooks/useGetVoteCasted";
import { VoteIndicator } from "@/components/ui/VoteIndicator";
import { NSAmount } from "./ui/NSAmount";
import { GradientBorder } from "./gradient-border";
import { Divide } from "@/components/ui/Divide";
import { useState } from "react";
import { truncatedText } from "@/utils/truncatedText";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useCursorPagination } from "@/hooks/useCursorPagination";
import SvgPaginationNext24 from "@/icons/PaginationNext24";
import SvgPaginationPrev24 from "@/icons/PaginationPrev24";
import clsx from "clsx";

const PAGE_SIZE = 10;

function VoterDetail({
  voterAddress,
  position: position,
  objID,
}: {
  voterAddress: string;
  objID: string;
  position: number;
}) {
  const { data: accountInfo } = useGetAccountInfo({ address: voterAddress });
  const { data: voter } = useGetVoteCastedById(objID);
  const formattedAddress = truncatedText({
    text: formatAddress(voterAddress),
    maxLength: 20,
  });
  const isSmallOrAbove = useBreakpoint("sm");
  const formattedName =
    accountInfo?.name &&
    truncatedText({
      text: formatName(accountInfo?.name, {
        noTruncate: isSmallOrAbove,
      }),
      maxLength: isSmallOrAbove ? 24 : 12,
    });
  const votes = voter ? getVoteTypeWithMostVotes(voter)?.[0] : null;

  const explorerLink = useExplorerLink({
    id: voterAddress || "",
    type: "address",
  });

  return (
    <div className="flex items-center justify-between gap-2.5">
      <div className="flex w-fit min-w-[150px] items-center justify-start gap-2.5 text-start md:min-w-[224px]">
        <Text
          variant="B6/bold"
          color="fillContent-tertiary"
          className="min-w-3"
        >
          {position}
        </Text>
        <Avatar address={voterAddress} className="h-[32px] w-[32px]" />
        <Link href={explorerLink} target="_blank">
          <Text variant="B6/bold" color="fillContent-primary">
            {formattedName ?? formattedAddress}
          </Text>
        </Link>
      </div>
      {votes && (
        <div className="flex w-full basis-1/3 flex-row items-center justify-between gap-2.5">
          <div className="w-fit basis-1/3">
            <VoteIndicator votedStatus={votes.key as VoteType} onlyStatus />
          </div>
          <div className="flex min-w-[80px] items-center justify-end gap-1">
            <NSAmount
              amount={votes.votes}
              isMedium
              roundedCoinFormat={!isSmallOrAbove}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function AllVoter({
  proposalId,
  topVotersSwitch,
}: {
  proposalId: string;
  topVotersSwitch: () => void;
}) {
  const { data: resp } = useGetProposalDetail({ proposalId });
  const allVotersQuery = useGetAllVoters({
    parentId: resp?.fields.voters.fields.id.id,
    size: PAGE_SIZE,
  });

  const {
    data: lists,
    isFetching,
    pagination,
  } = useCursorPagination(allVotersQuery);

  if (!lists?.data) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        variants={container}
        transition={{ ease: [0.17, 0.67, 0.83, 0.67] }}
        animate="show"
        className="flex flex-col gap-2024_XL"
      >
        <Heading variant="H6/super" className="font-[750]">
          All Voters ({resp?.fields.voters.fields.size})
        </Heading>
        {isFetching && <Loader className="h-3 w-3" />}
        {lists?.data?.map((voter, index) => (
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            key={voter.name.value}
          >
            <VoterDetail
              key={voter.name.value}
              objID={voter.objectId}
              voterAddress={voter.name.value}
              position={index + 1 + pagination.currentPage * PAGE_SIZE}
            />
          </motion.div>
        ))}
        <Divide />
        <div className="flex flex-col-reverse items-center justify-between gap-2024_L md:flex-row">
          <button
            className="w-full rounded-2024_S bg-transparent md:w-fit"
            onClick={topVotersSwitch}
          >
            <GradientBorder
              variant="orange_pink_blue"
              animateOnHover
              className="flex w-full items-center justify-center rounded-2024_S border-2 bg-[#62519c66] px-2024_L py-2.5"
            >
              <Text
                variant="B4/bold"
                color="fillContent-primary"
                className="leading-none"
              >
                View Top Voters
              </Text>
            </GradientBorder>
          </button>
          <div className="flex gap-2024_S">
            <button
              className="flex min-h-2024_3XL min-w-2024_3XL items-center justify-center rounded-[16px] border-2 border-2024_fillContent-tertiary bg-transparent px-2"
              disabled={!pagination.hasPrev}
              onClick={() => pagination.onPrev()}
            >
              <Text
                variant="B7/semibold"
                color={
                  pagination.hasPrev
                    ? "fillContent-secondary"
                    : "fillContent-tertiary"
                }
                className="leading-none"
              >
                <SvgPaginationPrev24 />
              </Text>
            </button>

            <button
              className="flex min-h-2024_3XL min-w-2024_3XL items-center justify-center rounded-[16px] border-2 border-2024_fillContent-tertiary bg-transparent px-2"
              disabled={!pagination.hasNext}
              onClick={() => pagination.onNext()}
              color="fillContent-secondary"
            >
              <Text
                variant="B7/semibold"
                color={
                  pagination.hasNext
                    ? "fillContent-secondary"
                    : "fillContent-tertiary"
                }
                className="leading-none"
              >
                <SvgPaginationNext24
                  fill={
                    pagination.hasNext
                      ? "fillContent-secondary"
                      : "fillContent-tertiary"
                  }
                />
              </Text>
            </button>
          </div>
        </div>
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
  position,
  address,
  votes,
  voteType,
}: {
  position: number;
  address: string;
  votes: number;
  voteType?: VoteType;
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
    <div className="flex max-w-[118px] flex-col items-center gap-2024_R">
      <div className="flex max-w-[118px] flex-col items-center justify-center gap-2024_R">
        <div className="relative h-[44px] w-[44px]">
          <Avatar address={address} className="h-[44px] w-[44px]" />
          <div className="absolute -left-[6px] -top-[1px] mx-auto flex h-5 w-5 items-center justify-center rounded-16 border-2 border-[#221C36] bg-2024_fillBackground-secondary-Highlight">
            <Text variant="B7/semibold" color="fillContent-primary">
              {position}
            </Text>
          </div>
        </div>
        <Link href={explorerLink} target="_blank">
          <Text
            variant="B6/bold"
            color="fillContent-primary"
            className="w-full text-center"
          >
            {formattedName ?? formattedAddress}
          </Text>
        </Link>
        {voteType && <VoteIndicator votedStatus={voteType} onlyStatus />}
        <NSAmount amount={votes} isMedium roundedCoinFormat centerAlign />
      </div>
    </div>
  );
}

function TopVoters({
  proposalId,
  allVotersSwitch,
}: {
  proposalId: string;
  allVotersSwitch: () => void;
}) {
  const { data: resp } = useGetProposalDetail({ proposalId });
  const voteTypes: VoteType[] = ["Yes", "No", "Abstain"];
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
        className="flex flex-col gap-2024_XL"
      >
        <div className="flex justify-between gap-1">
          <Heading variant="H6/super" className="font-[750]">
            Top Voters
          </Heading>
          <div className="flex gap-1">
            {voteTypes.map((type) => {
              const isAvailable = !!topVoters.get(type);
              return (
                <button
                  className={clsx(
                    "flex min-h-[30px] min-w-2024_3XL items-center justify-center rounded-[8px] border border-2024_fillContent-tertiary bg-transparent px-2024_R",
                    currentVoteType === type && "!bg-2024_fillContent-tertiary",
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
                  <Text
                    variant="B7/semibold"
                    color={
                      isAvailable
                        ? "fillContent-secondary"
                        : "fillContent-tertiary"
                    }
                    className="leading-none"
                  >
                    {type}
                  </Text>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2024_XL md:grid-cols-5 md:gap-2024_3XL">
          {currentTopVoters.map((voter, index) => (
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 2.5,
                  },
                },
              }}
              key={voter.address}
            >
              <TopVoter
                votes={voter.votes}
                address={voter.address}
                position={index + 1}
                voteType={currentVoteType}
              />
            </motion.div>
          ))}
        </div>
        <Divide />
        <div className="flex flex-col-reverse items-center justify-between gap-2024_L md:flex-row">
          <button
            className="w-full rounded-2024_S bg-transparent md:w-fit"
            onClick={allVotersSwitch}
          >
            <GradientBorder
              variant="orange_pink_blue"
              animateOnHover
              className="flex w-full items-center justify-center rounded-2024_S border-2 bg-[#62519c66] px-2024_L py-2.5"
            >
              <Text
                variant="B4/bold"
                color="fillContent-primary"
                className="leading-none"
              >
                View All Voters
              </Text>
            </GradientBorder>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function Votes({ proposalId }: { proposalId: string }) {
  const { data: resp } = useGetProposalDetail({ proposalId });
  const [topVoters, setTopVoters] = useState(false);

  if (!resp || Number(resp?.fields.voters.fields.size || 0) < 1) return null;
  const counts = resp?.fields.voters.fields.size;
  return (
    <div className="relative flex w-full flex-col gap-2024_XL rounded-2024_S">
      <div className="flex gap-2">
        <Heading variant="H5/super" className="font-[750]">
          Votes
        </Heading>
        {counts !== undefined && (
          <div className="flex rounded-2024_S bg-2024_fillBackground-secondary px-2024_M py-2024_S backdrop-blur-[20px]">
            <Text variant="B5/bold" color="fillContent-secondary">
              {counts}
            </Text>
          </div>
        )}
      </div>
      <div className="flex flex-col rounded-2024_S bg-2024_fillBackground-searchBg p-2024_2XL">
        {topVoters ? (
          <TopVoters
            proposalId={proposalId}
            allVotersSwitch={() => setTopVoters(false)}
          />
        ) : (
          <AllVoter
            proposalId={proposalId}
            topVotersSwitch={() => setTopVoters(true)}
          />
        )}
      </div>
    </div>
  );
}
