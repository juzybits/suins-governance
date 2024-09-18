import { useCurrentAccount } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";
import { formatName } from "@/utils/common";
import { useGetAccountInfo } from "@/hooks/useGetAccountInfo";
import { Avatar } from "@/components/Avatar";
import { VoteIndicator } from "@/components/ui/VoteIndicator";

import { Text } from "@/components/ui/Text";
import { NSAmount } from "@/components/ui/NSAmount";
import { useGetVoteCasted } from "@/hooks/useGetVoteCasted";
import { Divide } from "./ui/Divide";
import { VotingState } from "./VotingStatus";

export function YourVote({ proposalId }: { proposalId: string }) {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const { data } = useGetAccountInfo({ address });
  //  "0xfe09cf0b3d77678b99250572624bf74fe3b12af915c5db95f0ed5d755612eb68",
  const { data: voteCasted } = useGetVoteCasted({
    proposalId: proposalId,
    address: address ?? "",
  });

  if (!address || !voteCasted) {
    return null;
  }
  const formattedAddress = formatAddress(address);
  const formattedName = data?.name && formatName(data?.name);
  const votes = [voteCasted.yesVote, voteCasted.noVote, voteCasted.abstainVote];
  const hasVotedMultipleCategories =
    votes.filter((vote) => vote > 0).length > 1;

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
              {formattedName ?? formattedAddress}x
            </Text>
          </div>
          <Divide className="bg-[#62519C]" />
          {voteCasted.yesVote ? (
            <VotingState votedState="Yes" votes={voteCasted.yesVote} />
          ) : null}
          {voteCasted.noVote ? (
            <VotingState votedState="Yes" votes={voteCasted.noVote} />
          ) : null}
          {voteCasted.abstainVote ? (
            <VotingState votedState="Abstain" votes={voteCasted.abstainVote} />
          ) : null}
        </div>
      ) : (
        <div className="flex w-full items-center justify-start gap-2024_R rounded-12 bg-2024_fillBackground-secondary-Highlight/40 p-2024_R">
          <Avatar address={address} className="h-[36px] w-[36px]" />
          <div className="flex w-full items-center justify-between gap-2024_M">
            <div className="flex basis-3/4 flex-col items-start justify-center gap-2024_S">
              <Text
                variant="B6/bold"
                color="fillContent-primary"
                className="w-full text-start"
              >
                {formattedName ?? formattedAddress}x
              </Text>

              <NSAmount amount={voteCasted.yesVote} />
            </div>

            <VoteIndicator votedStatus="Yes" size="small" />
          </div>
        </div>
      )}

      <Text
        variant="B7/regular"
        color="fillContent-secondary"
        className="w-full text-start"
      >
        Tokens and reward can be withdrawn at the end of the voting period
      </Text>
    </div>
  );
}
