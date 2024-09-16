import {
  DropdownMenuContent,
  DropdownMenuItem,
  Root,
  Trigger,
} from "@radix-ui/react-dropdown-menu";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { isPast } from "date-fns";
import SvgChevronDown from "@/icons/ChevronDown";
import SvgChevronRight from "@/icons/ChevronRight";
import FileText from "@/icons/FileText";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useGetProposalsIds } from "@/hooks/useGetProposals";
import { ProposalStatus } from "./ui/ProposalStatus";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { Text } from "@/components/ui/Text";
import { GradientBorder } from "./gradient-border";
import { Heading } from "./ui/Heading";
import { Divide } from "@/components/ui/Divide";
import { truncatedText } from "@/utils/truncatedText";
import { useGetAllBalances } from "@/hooks/useGetAllBalances";
import { useGetBalance } from "@/hooks/useGetBalance";

function ProposalPreview({
  proposalId,
  isActive,
}: {
  proposalId: string;
  isActive?: boolean;
}) {
  const { data, isLoading } = useGetProposalDetail({ proposalId });

  if (!data || isLoading) return null;
  const isClosed = isPast(
    new Date(Number(data.fields.valid_until_timestamp_ms ?? 0)),
  );
  const fields = data.fields;
  const truncatedDescription = truncatedText({ text: fields.description });

  const PreviewContent = (
    <div className="flex flex-col gap-2024_R">
      <ProposalStatus status={isClosed ? "closed" : "active"} />
      <Text variant="B4/bold" color="fillContent-primary">
        {fields.title}
      </Text>
      <Text variant="B4/regular" color="fillContent-secondary">
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
      <Link href={`/proposals/${proposalId}`}>{PreviewContent}</Link>
    </div>
  );
}

export function ProposalsMenu() {
  const isSmallOrAbove = useBreakpoint("sm");
  const { data } = useGetProposalsIds();
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  // TODO: sort proposals by most recent
  const proposals = data ? Object.values(data) : [];
  // TODO: use type
  const { data: rawCoinBalances, isPending } = useGetBalance({
    coinType:
      "0xe3c2291f345d6dd96855e0f9415e58fd981cf95fd18331f0fb899d91a8969293::ns::NS",
    owner: address,
  });
  const { data: raw } = useGetAllBalances(address ?? "");
  console.log(rawCoinBalances, "rawCoinBalances", raw);

  return (
    <Root>
      <Trigger asChild>
        <button className='group relative flex w-full items-center justify-between gap-2 rounded-2024_M bg-2024_fillContent-tertiary p-2024_S shadow-previewMenu before:absolute before:inset-[2px] before:rounded-[99px] before:bg-[#2e2747] before:content-[""] hover:bg-2024_button-gradient focus:outline-none data-[state=open]:bg-[] data-[state="open"]:bg-2024_button-gradient before:data-[state=open]:bg-2024_gradient-active md:p-2024_M'>
          <FileText className="relative h-2024_XL w-2024_XL" />

          <div className="h-2024_M w-2024_M">
            <SvgChevronDown className="relative h-2024_M w-2024_M text-2024_fillContent-tertiary group-hover:text-2024_fillContent-primary group-data-[state=open]:text-2024_fillContent-primary" />
          </div>
        </button>
      </Trigger>
      <DropdownMenuContent
        sideOffset={12}
        alignOffset={isSmallOrAbove ? 0 : -182}
        align="end"
        asChild
        className="z-50 w-2024_menuWidth max-sm:w-[90vw]"
      >
        {proposals && proposals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full text-left"
          >
            {proposals?.length &&
              proposals.map((proposalsList, index) => (
                <div
                  className="relative flex h-full w-full min-w-full flex-col items-start justify-start gap-2024_2XL overflow-hidden rounded-2024_R border border-2024_fillContent-tertiary bg-2024_fillBackground-searchBg p-2024_2XL text-left focus:outline-none focus:placeholder:text-transparent md:w-2024_menuWidth md:min-w-[416px]"
                  key={index}
                >
                  <Heading
                    variant="H6/super"
                    className="w-full text-left font-[750]"
                  >
                    Proposals
                  </Heading>
                  <div className="flex flex-col gap-2024_M">
                    <Text variant="B6/bold" color="fillContent-primary">
                      {index === 0
                        ? `NEW (${index + 1})`
                        : `PREVIOUS (${index + 1})`}
                    </Text>
                    {proposalsList?.map((proposalId) => (
                      <DropdownMenuItem key={proposalId}>
                        <ProposalPreview proposalId={proposalId} isActive />
                      </DropdownMenuItem>
                    ))}
                  </div>
                </div>
              ))}
          </motion.div>
        )}
      </DropdownMenuContent>
    </Root>
  );
}
