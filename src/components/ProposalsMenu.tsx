"use client";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  Root,
  Trigger,
} from "@radix-ui/react-dropdown-menu";
import { useMemo } from "react";

import { isPast } from "date-fns";
import SvgChevronDown from "@/icons/ChevronDown";
import { api } from "@/trpc/react";
import SvgChevronRight from "@/icons/ChevronRight";
import FileText from "@/icons/FileText";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useGetProposalsIds } from "@/hooks/useGetProposals";
import { ProposalStatus } from "./ui/ProposalStatus";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { Text } from "@/components/ui/Text";
import { GradientBorder } from "./gradient-border";
import { Heading } from "./ui/Heading";
import { Divide } from "@/components/ui/Divide";
import { truncatedText } from "@/utils/truncatedText";

function ProposalPreview({
  proposalId,
  isActive,
}: {
  proposalId: string;
  isActive?: boolean;
}) {
  const { data, isLoading } = useGetProposalDetail({ proposalId });

  if (!data || isLoading) return null;

  const isClosed = isPast(new Date(Number(data.fields.end_time_ms ?? 0)));
  const fields = data.fields;
  const truncatedDescription = truncatedText({
    text: fields.description,
    maxLength: 100,
  });

  const PreviewContent = (
    <div className="flex cursor-pointer flex-col gap-2024_R">
      <ProposalStatus status={isClosed ? "closed" : "active"} />
      <Text
        variant="B4/bold"
        color="fillContent-primary"
        className="leading-none"
      >
        {fields.title}
      </Text>
      <Text
        variant="B4/regular"
        color="fillContent-secondary"
        className="leading-normal"
      >
        {truncatedDescription}
      </Text>
      <Divide />
      <div className="flex justify-between gap-1">
        <Text variant="B5/bold" color="fillContent-link">
          View Proposal
        </Text>
        <div className="h-2024_M w-2024_M">
          <SvgChevronRight className="relative h-2024_M w-2024_M text-2024_fillContent-tertiary group-hover:text-2024_fillContent-primary group-data-[state=open]:text-2024_fillContent-primary" />
        </div>
      </div>
    </div>
  );
  return isActive ? (
    <GradientBorder
      variant="green_pink_blue"
      className="flex w-full items-center justify-center rounded-2024_XS border-2 bg-[#62519c66] p-2024_M"
    >
      {PreviewContent}
    </GradientBorder>
  ) : (
    <div className="flex w-full items-center justify-center rounded-2024_XS border-0 bg-[#62519c66] p-2024_M">
      {PreviewContent}
    </div>
  );
}

export function ProposalsMenu() {
  const isSmallOrAbove = useBreakpoint("sm");
  const { data, isLoading: isLoadingIds } = useGetProposalsIds();
  const { data: activeProposal, isLoading } =
    api.post.getIsProposalActive.useQuery();
  // TODO: sort proposals by most recent
  const proposals = useMemo(() => {
    return data
      ? Object.values(data)
          .flatMap((x) => x)
          .filter((x) => x !== activeProposal?.isProposalActive)
      : [];
  }, [data, activeProposal?.isProposalActive]);
  const router = useRouter();

  if (proposals?.length < 1 || isLoadingIds || isLoading) return null;

  return (
    <Root>
      <Trigger asChild>
        <button className='group relative flex w-full items-center justify-between gap-2 rounded-2024_M bg-2024_fillContent-tertiary p-2024_S shadow-previewMenu before:absolute before:inset-[2px] before:rounded-[99px] before:bg-[#2e2747] before:content-[""] hover:bg-2024_button-gradient focus:outline-none data-[state=open]:bg-[] data-[state="open"]:bg-2024_button-gradient before:data-[state=open]:bg-2024_gradient-active md:p-2024_M'>
          <FileText className="relative h-2024_XL w-2024_XL" />
          {isSmallOrAbove && (
            <Text
              variant="B5/bold"
              color="fillContent-primary"
              className="relative leading-none"
            >
              View all proposals
            </Text>
          )}

          <div className="h-2024_M w-2024_M">
            <SvgChevronDown className="relative h-2024_M w-2024_M text-2024_fillContent-tertiary group-hover:text-2024_fillContent-primary group-data-[state=open]:text-2024_fillContent-primary" />
          </div>
        </button>
      </Trigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          sideOffset={12}
          alignOffset={isSmallOrAbove ? 0 : -112}
          align="start"
          asChild
          className="z-50 w-2024_menuWidth max-w-[416px] max-sm:w-[90vw]"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full text-left"
          >
            <div className="relative flex h-full w-full min-w-full flex-col items-start justify-start gap-2024_2XL overflow-hidden rounded-2024_R border border-2024_fillContent-tertiary bg-2024_fillBackground-searchBg p-2024_2XL text-left focus:outline-none focus:placeholder:text-transparent md:w-2024_menuWidth md:min-w-[416px]">
              <Heading
                variant="H6/super"
                className="w-full text-left font-[750]"
              >
                Proposals
              </Heading>
              {activeProposal?.isProposalActive && (
                <div className="flex flex-col gap-2024_M">
                  <Text variant="B6/bold" color="fillContent-primary">
                    New (1)
                  </Text>
                  <DropdownMenuItem
                    onSelect={() =>
                      router.push(
                        `/proposal/${activeProposal.isProposalActive}`,
                      )
                    }
                  >
                    <ProposalPreview
                      proposalId={activeProposal.isProposalActive}
                      isActive
                    />
                  </DropdownMenuItem>
                </div>
              )}
              {proposals.length > 0 && (
                <div className="flex flex-col gap-2024_M">
                  <Text variant="B6/bold" color="fillContent-primary">
                    PREVIOUS ({proposals.length})
                  </Text>
                  {proposals.map((proposalId, index) => (
                    <DropdownMenuItem
                      key={proposalId}
                      onSelect={() => router.push(`/proposal/${proposalId}`)}
                    >
                      <ProposalPreview
                        proposalId={proposalId}
                        key={proposalId}
                      />
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </Root>
  );
}
