"use client";

import { type ReactNode } from "react";
import { registerSlushWallet } from "@mysten/slush-wallet";
import { createNetworkConfig, SuiClientProvider } from "@mysten/dapp-kit";
import { KioskClientProvider } from "@/app/KioskClientProvider";
import { SuinsClientProvider } from "@/app/SuinsClient";
import { SUINS_ENDPOINTS } from "@/constants/endpoints";
import { env } from "@/env";
import { NETWORK } from "@/constants/env";
import { TRPCReactProvider } from "@/trpc/react";
import { suiNSTheme } from "@/app/themes";
import dynamic from "next/dynamic";

export const DAPP_KIT_WALLET_STORAGE_KEY = "dapp-kit-wallet-m";

const WalletProvider = dynamic(
  () => import("@mysten/dapp-kit").then((p) => p.WalletProvider),
  {
    ssr: false,
  },
);

if (env.NEXT_PUBLIC_VITE_NETWORK === "mainnet") {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  registerSlushWallet("SuiNS");
}

export function Providers({ children }: { children: ReactNode }) {
  const { networkConfig } = createNetworkConfig({
    testnet: { url: SUINS_ENDPOINTS.testnet.fullNodes },
    mainnet: { url: SUINS_ENDPOINTS.mainnet.fullNodes },
  });

  return (
    <TRPCReactProvider>
      <SuiClientProvider defaultNetwork={NETWORK} networks={networkConfig}>
        <WalletProvider
          autoConnect
          storageKey={DAPP_KIT_WALLET_STORAGE_KEY}
          theme={suiNSTheme}
        >
          <SuinsClientProvider>
            <KioskClientProvider>{children}</KioskClientProvider>
          </SuinsClientProvider>
        </WalletProvider>
      </SuiClientProvider>
    </TRPCReactProvider>
  );
}
