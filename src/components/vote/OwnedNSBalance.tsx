"use client";

import { Text } from "@/components/ui/legacy/Text";
import { useCurrentAccount } from "@mysten/dapp-kit";
import Loader from "@/components/ui/legacy/Loader";
import { useGetOwnedNSBalance } from "@/hooks/useGetOwnedNSBalance";

export function OwnedNSBalance() {
  const currentAccount = useCurrentAccount();
  const currAddr = currentAccount?.address;

  const { data: balance, isLoading } = useGetOwnedNSBalance(currAddr);

  if (!currAddr) {
    return null;
  }

  return (
    <div className="border-2024_fillContent-tertiary p-2024_M flex w-full items-center justify-center rounded-[56px] border-2 bg-transparent md:w-fit">
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
