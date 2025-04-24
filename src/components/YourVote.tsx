import { useCurrentAccount } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";
import { formatName } from "@/utils/common";
import { useGetAccountInfo } from "@/hooks/useGetAccountInfo";
import { Avatar } from "@/components/Avatar";

import { Text } from "@/components/ui/Text";
import { useGetVoteCasted } from "@/hooks/useGetVoteCasted";
import { Divide } from "./ui/Divide";
import { VotingState } from "./VotingStatus";
import { NSAmount } from "./ui/NSAmount";
import { VoteIndicator } from "./ui/VoteIndicator";
import { useIsPersonVote } from "@/hooks/useIsPersonVote";

export function YourVote({ proposalId }: { proposalId: string }) {
  const currentAccount = useCurrentAccount();
  const isPersonVote = useIsPersonVote(proposalId);
  const address = currentAccount?.address;

  const { data: voteCasted } = useGetVoteCasted({
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
    <div className="flex flex-col items-center justify-between gap-2024_M">
      <Divide />
      <Text
        variant="B4/bold"
        color="fillContent-primary"
        className="w-full text-start"
      >
        Your Vote
      </Text>
      {hasVotedMultipleCategories ? (
        <div className="flex w-full flex-col items-start justify-center gap-2024_R rounded-12 bg-2024_fillBackground-secondary-Highlight/40 p-2024_R">
          <div className="flex items-center gap-2024_R">
            <Avatar address={address} className="h-[36px] w-[36px]" />
            <Text
              variant="B6/bold"
              color="fillContent-primary"
              className="w-full text-start"
            >
              {formattedName ?? formattedAddress}
            </Text>
          </div>
          <Divide className="bg-[#62519C]" />
          {voteCasted.yesVote ? (
            <VotingState
              votedState="Yes"
              votes={voteCasted.yesVote}
              isPersonVote={isPersonVote}
            />
          ) : null}
          {voteCasted.noVote ? (
            <VotingState
              votedState="No"
              votes={voteCasted.noVote}
              isPersonVote={isPersonVote}
            />
          ) : null}
          {voteCasted.abstainVote ? (
            <VotingState
              votedState="Abstain"
              votes={voteCasted.abstainVote}
              isPersonVote={isPersonVote}
            />
          ) : null}
          <Divide className="bg-[#62519C]" />
          <Text
            variant="B7/regular"
            color="fillContent-secondary"
            className="w-full text-start"
          >
            Locked tokens will be returned to users automatically after voting
            concludes.
          </Text>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-start gap-2024_R rounded-12 bg-2024_fillBackground-secondary-Highlight/40 p-2024_R">
          <div className="flex w-full items-center justify-start gap-2024_R">
            <Avatar address={address} className="h-[36px] w-[36px]" />
            <div className="flex w-full items-center justify-between gap-2024_M">
              <div className="flex flex-col items-start justify-start gap-2024_XS">
                <Text
                  variant="B6/bold"
                  color="fillContent-primary"
                  className="w-full text-start"
                >
                  {formattedName ?? formattedAddress}
                </Text>

                <NSAmount
                  amount={
                    voteCasted.yesVote ||
                    voteCasted.noVote ||
                    voteCasted.abstainVote
                  }
                  className="!justify-start"
                />
              </div>
              {voteCasted.yesVote ? (
                <VoteIndicator
                  votedStatus="Yes"
                  size="small"
                  isPersonVote={isPersonVote}
                />
              ) : null}
              {voteCasted.noVote ? (
                <VoteIndicator
                  votedStatus="No"
                  size="small"
                  isPersonVote={isPersonVote}
                />
              ) : null}
              {voteCasted.abstainVote ? (
                <VoteIndicator
                  votedStatus="Abstain"
                  size="small"
                  isPersonVote={isPersonVote}
                />
              ) : null}
            </div>
          </div>
          <Divide className="bg-[#62519C]" />
          <Text
            variant="B7/regular"
            color="fillContent-secondary"
            className="w-full text-start"
          >
            Locked tokens will be returned to users automatically after voting
            concludes.
          </Text>
        </div>
      )}
    </div>
  );
}
