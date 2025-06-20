"use client";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  Root,
  Trigger,
} from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

import { isPast } from "date-fns";
import SvgChevronDown from "@/icons/legacy/ChevronDown";
import SvgChevronRight from "@/icons/legacy/ChevronRight";
import FileText from "@/icons/legacy/FileText";

import { motion } from "framer-motion";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useGetProposalIds } from "@/hooks/useGetProposalIds";
import { ProposalStatus } from "../ui/legacy/ProposalStatus";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { Text } from "@/components/ui/legacy/Text";
import { GradientBorder } from "../gradient-border";
import { truncatedText } from "@/utils/truncatedText";
import Loader from "../ui/legacy/Loader";
import { formatContractText } from "@/utils/formatContractText";
import { ContentBlockParser } from "../ui/legacy/ContentBlockParser";
import { useParams } from "next/navigation";
import { useIsPersonVote } from "@/hooks/useIsPersonVote";
import Typography from "../ui/typography";

function ProposalPreview({
  proposalId,
  isActive,
}: {
  proposalId: string;
  isActive?: boolean;
}) {
  const { data, isLoading } = useGetProposalDetail({ proposalId });
  const isPersonVote = useIsPersonVote(proposalId);
  if (!data || isLoading) return null;

  const isClosed = isPast(new Date(Number(data.fields.end_time_ms ?? 0)));

  const fields = data.fields;
  const truncatedDescription = formatContractText(
    truncatedText({
      text: fields.description,
      maxLength: 100,
    }) ?? "",
  );

  const PreviewContent = (
    <div className="flex w-full cursor-pointer flex-col gap-s">
      <ProposalStatus
        status={
          isClosed
            ? isPersonVote && data?.fields.winning_option !== null
              ? "passed"
              : data.fields.winning_option?.fields.pos0 === "Yes"
                ? "passed"
                : data?.fields.winning_option === null && isClosed
                  ? "pending"
                  : "failed"
            : "active"
        }
      />
      <Typography
        variant="label/Large Bold"
        className="leading-none text-primary-main"
      >
        {fields.title}
      </Typography>
      <Typography variant="paragraph/Large" className="text-secondary">
        {truncatedDescription?.map((desc, index) => (
          <Text
            variant="B4/regular"
            color="fillContent-secondary"
            className="leading-normal"
            key={index + desc.substring(0, 20)}
          >
            <ContentBlockParser text={desc} />
          </Text>
        ))}
      </Typography>

      <hr className="border-secondary/10" />
      <div className="flex justify-between gap-1">
        <Typography variant="label/Regular Bold" className="text-link">
          View Proposal
        </Typography>
        <div className="h-m w-m">
          <SvgChevronRight className="relative h-m w-m text-tertiary group-hover:text-primary-main group-data-[state=open]:text-primary-main" />
        </div>
      </div>
    </div>
  );

  return isActive ? (
    <GradientBorder
      bg="#423766"
      variant="green_pink_blue"
      className="flex w-full items-center rounded-xs border-2 bg-[#62519C66] p-m"
    >
      {PreviewContent}
    </GradientBorder>
  ) : (
    <div className="flex w-full items-center rounded-xs border-0 bg-[#62519C66] p-m">
      {PreviewContent}
    </div>
  );
}

export function ProposalsMenu() {
  const isSmallOrAbove = useBreakpoint("sm");
  const { data, isLoading } = useGetProposalIds();
  const inactiveProposals = data?.filter((proposal) => !proposal.isActive);
  const params = useParams<{ proposal: string }>();

  if (!data || data?.length < 2) {
    return null;
  }

  return (
    <Root>
      <Trigger asChild>
        <button className='bg-bg-tertiary hover:bg-2024_button-gradient data-[state="open"]:bg-2024_button-gradient before:data-[state=open]:bg-2024_gradient-active md:p-2024_M group relative flex w-full items-center justify-between gap-2 rounded-m p-s before:absolute before:inset-[2px] before:rounded-[99px] before:bg-[#2e2747] before:content-[""] focus:outline-none data-[state=open]:bg-[]'>
          <FileText className="relative h-xl w-xl" />
          {isSmallOrAbove && (
            <Typography
              variant="label/Large Bold"
              className="relative leading-none text-primary-main"
            >
              View All
            </Typography>
          )}
          <div className="h-m w-m">
            <SvgChevronDown className="relative h-m w-m text-tertiary group-hover:text-primary-main group-data-[state=open]:text-primary-main" />
          </div>
        </button>
      </Trigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          sideOffset={12}
          alignOffset={isSmallOrAbove ? 0 : -112}
          align="start"
          className="w-2024_menuWidth z-50 max-w-[416px] max-sm:w-[90vw]"
        >
          <>
            {isLoading && <Loader className="h-6 w-6" />}
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full text-left"
              >
                <div className="relative flex h-full w-full min-w-full flex-col items-start justify-start gap-2xl overflow-x-hidden rounded-l-s rounded-r-s border border-tertiary bg-bg-modal p-2xl text-left focus:outline-none focus:placeholder:text-transparent md:w-[25rem] md:min-w-[416px]">
                  <Typography
                    variant="display/XSmall Light"
                    className="text-primary-main"
                  >
                    Proposals
                  </Typography>
                  <div className="flex h-full max-h-[800px] w-full flex-col gap-m overflow-y-auto">
                    {data?.[0]?.isActive && (
                      <div className="flex flex-col gap-m">
                        <Typography
                          variant="label/Small Bold"
                          className="uppercase text-secondary"
                        >
                          New (1)
                        </Typography>
                        <Link
                          className="block"
                          href={`/proposal/${data?.[0]?.fields.proposal_id}`}
                        >
                          <DropdownMenuItem className="focus:outline-none focus-visible:outline-none">
                            <ProposalPreview
                              proposalId={data?.[0]?.fields.proposal_id}
                              isActive={
                                params.proposal ===
                                  data?.[0]?.fields.proposal_id ||
                                !params.proposal
                              }
                            />
                          </DropdownMenuItem>
                        </Link>
                      </div>
                    )}
                    {inactiveProposals && inactiveProposals?.length > 0 && (
                      <div className="flex flex-col gap-m focus:outline-none focus-visible:outline-none">
                        <Typography
                          variant="label/Small Bold"
                          className="uppercase text-secondary"
                        >
                          PREVIOUS ({inactiveProposals?.length})
                        </Typography>
                        {inactiveProposals.map((proposals) => (
                          <DropdownMenuItem
                            asChild
                            key={proposals.fields.proposal_id}
                            className="focus:outline-none focus-visible:outline-none"
                          >
                            <Link
                              href={`/proposal/${proposals.fields.proposal_id}`}
                              className="block"
                            >
                              <ProposalPreview
                                proposalId={proposals.fields.proposal_id}
                                key={proposals.fields.proposal_id}
                                isActive={
                                  params.proposal ===
                                  proposals.fields.proposal_id
                                }
                              />
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </Root>
  );
}
