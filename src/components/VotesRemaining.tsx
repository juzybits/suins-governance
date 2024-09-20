"use client";

import { Text } from "@/components/ui/Text";
import { NETWORK } from "@/constants/env";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useGetBalance } from "@/hooks/useGetBalance";
import Loader from "@/components/ui/Loader";

export function VotesRemaining() {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;

  const { data: balance, isLoading } = useGetBalance({
    owner: address,
    coinType: SUINS_PACKAGES[NETWORK].votingTokenType,
  });

  if (!address) {
    return null;
  }

  return (
    <div className="flex w-full items-center justify-center rounded-[56px] border-2 border-2024_fillContent-tertiary bg-transparent p-2024_M md:w-fit">
      {isLoading ? (
        <Loader className="h-3 w-3" />
      ) : (
        <Text
          variant="B5/bold"
          color="fillContent-primary"
          className="0.16px leading-[112.5%]"
        >
          {balance?.formatted} NS
        </Text>
      )}
    </div>
  );
}
