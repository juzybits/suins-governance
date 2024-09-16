import { useCurrentAccount } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";
import { formatName } from "@/utils/common";
import { useGetAccountInfo } from "@/hooks/useGetAccountInfo";
import { Avatar } from "@/components/Avatar";
import { VoteIndicator } from "@/components/ui/VoteIndicator";

import { Text } from "@/components/ui/Text";
import { NSAmount } from "@/components/ui/NSAmount";

export function YourVote() {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const { data, isLoading } = useGetAccountInfo({ address });

  if (!address) {
    return null;
  }
  const formattedAddress = formatAddress(address);
  const formattedName = data?.name && formatName(data?.name);
  return (
    <div className="flex flex-col items-center justify-between gap-2024_M">
      <Text
        variant="B4/bold"
        color="fillContent-primary"
        className="w-full text-start"
      >
        Your Vote
      </Text>
      <div className="flex w-full items-center justify-start gap-2024_R rounded-12 bg-2024_fillBackground-secondary-Highlight/40 px-2024_R py-2024_S">
        <Avatar address={address} className="h-[36px] w-[36px]" />
        <div className="flex w-full items-center justify-between gap-2024_M">
          <div className="flex basis-3/4 flex-col items-start justify-center gap-2024_S">
            <Text
              variant="B6/bold"
              color="fillContent-primary"
              className="w-full text-start"
            >
              {formattedName ?? formattedAddress}
            </Text>
            <NSAmount amount={280.34} />
          </div>
          <VoteIndicator votedStatus="Yes" size="small" />
        </div>
      </div>
    </div>
  );
}
