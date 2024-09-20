import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { formatAddress } from "@mysten/sui/utils";
import { useGetAllVoters } from "@/hooks/useGetAllVoters";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { Avatar } from "@/components/Avatar";
import { useGetAccountInfo } from "@/hooks/useGetAccountInfo";
import { useExplorerLink } from "@/hooks/useExplorerLink";
import { formatName } from "@/utils/common";
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

type VoteType = "Yes" | "No" | "Abstain";
function VoterDetail({
  voterAddress,
  position: position,
  objID,
  isTopVoter,
}: {
  voterAddress: string;
  objID: string;
  position: number;
  isTopVoter?: boolean;
}) {
  const { data: accountInfo } = useGetAccountInfo({ address: voterAddress });
  const { data: voter } = useGetVoteCastedById(objID);
  const formattedAddress = formatAddress(voterAddress);
  const formattedName = accountInfo?.name && formatName(accountInfo?.name);
  const votes = voter ? getVoteTypeWithMostVotes(voter)?.[0] : null;
  const isSmallOrAbove = useBreakpoint("sm");
  const explorerLink = useExplorerLink({
    id: voterAddress || "",
    type: "address",
  });

  if (isTopVoter) {
    if (!votes) return null;
    return (
      <div className="relative flex max-w-[118px] flex-col items-start gap-2024_R">
        <div className="absolute left-0 top-[-1px] mx-auto flex h-5 w-5 items-center justify-center rounded-16 bg-2024_fillBackground-secondary-Highlight">
          <Text variant="B7/semibold" color="fillContent-primary">
            {position}
          </Text>
        </div>
        <div className="flex max-w-[118px] flex-col items-center justify-center gap-2024_R">
          <Avatar address={voterAddress} className="h-[44px] w-[44px]" />
          <NSAmount
            amount={votes.votes}
            isMedium
            roundedCoinFormat
            centerAlign
          />
          <VoteIndicator votedStatus={votes.key as VoteType} onlyStatus />
          <Link href={explorerLink} target="_blank">
            <Text
              variant="B6/bold"
              color="fillContent-primary"
              className="w-full text-center"
            >
              {formattedName ??
                truncatedText({ text: formattedAddress, maxLength: 6 })}
            </Text>
          </Link>
        </div>
      </div>
    );
  }

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
  const {
    data: list,
    hasNextPage,
    hasPreviousPage,

    fetchNextPage,
    fetchPreviousPage,
    isFetching,
    isPending: isPendingOwnedObjects,
  } = useGetAllVoters({
    parentId: resp?.fields.voters.fields.id.id,
  });

  if (!list) return null;
  const voters = list?.pages.flatMap((page) => page.data);

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
        {voters?.map((voter, index) => (
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
              position={index + 1}
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
              variant="green_pink_blue"
              animateOnHover
              className="flex w-full items-center justify-center rounded-2024_S border-2 bg-[#62519c66] px-2024_L py-2024_R"
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
              className="flex min-h-[30px] min-w-[50px] items-center justify-center rounded-2024_3XS border border-2024_fillContent-tertiary bg-transparent px-2"
              disabled={!hasPreviousPage}
              onClick={() => fetchPreviousPage}
            >
              <Text
                variant="B7/semibold"
                color={
                  hasPreviousPage
                    ? "fillContent-secondary"
                    : "fillContent-tertiary"
                }
                className="leading-none"
              >
                PREV
              </Text>
            </button>
            {/* <button className="bg-transparent rounded-2024_3XS border w-[30px] h-[30px] flex items-center justify-center border-2024_fillContent-tertiary">
            <Text
                  variant="B7/semibold"
                  color="fillContent-secondary"
                  className="leading-none">
                    1
            </Text>
            
            </button>
            <button className="bg-transparent rounded-2024_3XS border w-[30px] h-[30px] flex items-center justify-center border-2024_fillContent-tertiary">
            <Text
                  variant="B7/semibold"
                  color="fillContent-secondary"
                  className="leading-none">
                   2
            </Text>
            
            </button>
            <button className="bg-transparent rounded-2024_3XS border w-[30px] h-[30px] flex items-center justify-center border-2024_fillContent-tertiary">
            <Text
                  variant="B7/semibold"
                  color="fillContent-secondary"
                  className="leading-none">
                   ...
            </Text>
            
            </button>
            <button className="bg-transparent rounded-2024_3XS border w-[30px] h-[30px] flex items-center justify-center border-2024_fillContent-tertiary" >
            <Text
                  variant="B7/semibold"
                  color="fillContent-secondary"
                  className="leading-none">
                   200
            </Text>
            
            </button> */}
            <button
              className="flex min-h-[30px] min-w-[50px] items-center justify-center rounded-2024_3XS border border-2024_fillContent-tertiary bg-transparent px-2"
              disabled={!hasNextPage}
              onClick={() => fetchNextPage}
            >
              <Text
                variant="B7/semibold"
                color={
                  hasNextPage ? "fillContent-secondary" : "fillContent-tertiary"
                }
                className="leading-none"
              >
                NEXT
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

function TopVoters({
  proposalId,
  allVotersSwitch,
}: {
  proposalId: string;
  allVotersSwitch: () => void;
}) {
  const { data: resp } = useGetProposalDetail({ proposalId });
  const {
    data: list,
    hasNextPage,
    hasPreviousPage,

    fetchNextPage,
    fetchPreviousPage,
    isFetching,
    isPending: isPendingOwnedObjects,
  } = useGetAllVoters({
    parentId: resp?.fields.voters.fields.id.id,
  });

  if (!list) return null;
  const voters = list?.pages.flatMap((page) => page.data);

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
          Top Voters
        </Heading>

        <div className="grid grid-cols-3 gap-2024_3XL md:grid-cols-5">
          {voters?.map((voter, index) => (
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
                position={index + 1}
                isTopVoter
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
              variant="green_pink_blue"
              animateOnHover
              className="flex w-full items-center justify-center rounded-2024_S border-2 bg-[#62519c66] px-2024_L py-2024_R"
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
