import { useCurrentAccount } from "@mysten/dapp-kit";
import { type FC } from "react";
import { ConnectWalletButton } from "./connect-wallet-button";

const ConnectWalletMobile: FC = () => {
  const currentAccount = useCurrentAccount();

  if (currentAccount) return null;

  return (
    <div className="md:hidden">
      <ConnectWalletButton className="w-full" />
    </div>
  );
};

export default ConnectWalletMobile;
