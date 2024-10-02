import { useCurrentAccount } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";
import { formatName } from "@/utils/common";
import { useGetAccountInfo } from "@/hooks/useGetAccountInfo";
import { Avatar } from "@/components/Avatar";

import { Text } from "@/components/ui/Text";
import { useGetVoteCasted } from "@/hooks/useGetVoteCasted";
import { Divide } from "./ui/Divide";
import { VotingState } from "./VotingStatus";

export function YourVote({ proposalId }: { proposalId: string }) {
  const currentAccount = useCurrentAccount();
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
          <VotingState votedState="Yes" votes={voteCasted.yesVote} />
        ) : null}
        {voteCasted.noVote ? (
          <VotingState votedState="No" votes={voteCasted.noVote} />
        ) : null}
        {voteCasted.abstainVote ? (
          <VotingState votedState="Abstain" votes={voteCasted.abstainVote} />
        ) : null}
      </div>

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
