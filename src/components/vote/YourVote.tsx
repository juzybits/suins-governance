import { useCurrentAccount } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";
import { formatName } from "@/utils/common";
import { useGetAccountInfo } from "@/hooks/useGetAccountInfo";
import { Avatar } from "@/components/Avatar";

import { useGetVoteCastedByProposalId } from "@/hooks/useGetVoteCasted";
import { VotingState } from "./VotingStatus";
import { NSAmount } from "../ui/legacy/NSAmount";
import { VoteIndicator } from "../ui/legacy/VoteIndicator";
import { useIsPersonVote } from "@/hooks/useIsPersonVote";
import Typography from "../ui/typography";

export function YourVote({ proposalId }: { proposalId: string }) {
  const currentAccount = useCurrentAccount();
  const isPersonVote = useIsPersonVote(proposalId);
  const address = currentAccount?.address;

  const { data: voteCasted } = useGetVoteCastedByProposalId({
    proposalId: proposalId,
    address: address ?? "",
  });

  const { data } = useGetAccountInfo({ address });

  if (!address || !voteCasted) {
    return null;
  }
  const formattedAddress = formatAddress(address);
  const formattedName = data?.name && formatName(data?.name);
  const hasVotedMultipleCategories =
    [voteCasted.yesVote, voteCasted.noVote, voteCasted.abstainVote].filter(
      (vote) => vote > 0,
    ).length > 1;

  return (
    <div className="flex flex-col items-center justify-between gap-2xl">
      <hr className="w-full border-primary-inactive" />
      <Typography
        variant="label/Large Bold"
        className="w-full text-start text-primary-main"
      >
        Your Vote
      </Typography>
      {hasVotedMultipleCategories ? (
        <div className="flex w-full flex-col justify-start gap-m rounded-l-xs rounded-r-xs bg-[#62519C66] p-s">
          <div className="flex items-center gap-s">
            <Avatar address={address} className="h-[36px] w-[36px]" />
            <Typography
              variant="label/Small Medium"
              className="w-full text-start text-primary-main"
            >
              {formattedName ?? formattedAddress}
            </Typography>
          </div>
          <hr className="border-secondary/10" />
          {voteCasted.yesVote ? (
            <div className="flex justify-between">
              <VoteIndicator
                size="small"
                votedStatus="Yes"
                isPersonVote={isPersonVote}
              />
              <NSAmount amount={voteCasted.yesVote} />
            </div>
          ) : null}
          {voteCasted.noVote ? (
            <div className="flex justify-between">
              <VoteIndicator
                size="small"
                votedStatus="No"
                isPersonVote={isPersonVote}
              />
              <NSAmount amount={voteCasted.noVote} />
            </div>
          ) : null}
          {voteCasted.abstainVote ? (
            <div className="flex justify-between">
              <VoteIndicator
                size="small"
                votedStatus="Abstain"
                isPersonVote={isPersonVote}
              />
              <NSAmount amount={voteCasted.abstainVote} />
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex w-full flex-col justify-start gap-m rounded-l-xs rounded-r-xs bg-[#62519C66] p-s">
          <div className="flex w-full items-center justify-start gap-s">
            <Avatar address={address} className="h-[36px] w-[36px]" />
            <div className="flex w-full items-center justify-between gap-m">
              <div className="flex flex-col items-start justify-start gap-xs">
                <Typography
                  variant="label/Small Bold"
                  className="w-full text-start text-primary-main"
                >
                  {formattedName ?? formattedAddress}
                </Typography>
              </div>
            </div>
          </div>
          <hr className="border-secondary/10" />
          {!!voteCasted.yesVote && (
            <div className="flex justify-between">
              <VoteIndicator
                size="small"
                votedStatus="Yes"
                isPersonVote={isPersonVote}
              />
              <NSAmount amount={voteCasted.yesVote} />
            </div>
          )}
          {!!voteCasted.noVote && (
            <div className="flex justify-between">
              <VoteIndicator
                votedStatus="No"
                size="small"
                isPersonVote={isPersonVote}
              />
              <NSAmount amount={voteCasted.noVote} />
            </div>
          )}
          {!!voteCasted.abstainVote && (
            <div className="flex justify-between">
              <VoteIndicator
                votedStatus="Abstain"
                size="small"
                isPersonVote={isPersonVote}
              />
              <NSAmount amount={voteCasted.abstainVote} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
