"use client";

import { type ReactNode } from "react";
import { registerStashedWallet } from "@mysten/zksend";
import { SuiClientProvider } from "@mysten/dapp-kit";
import { KioskClientProvider } from "@/app/KioskClientProvider";
import { SuinsClientProvider } from "@/app/SuinsClient";
import { SUINS_ENDPOINTS } from "@/constants/endpoints";
import { env } from "@/env";
import { NETWORK } from "@/constants/env";
import { TRPCReactProvider } from "@/trpc/react";
import { suiNSTheme } from "@/app/themes";
import dynamic from "next/dynamic";
import { SUPPORTED_NETWORKS } from "@/constants/endpoints";

export const DAPP_KIT_WALLET_STORAGE_KEY = "dapp-kit-wallet-m";

const WalletProvider = dynamic(
  () => import("@mysten/dapp-kit").then((p) => p.WalletProvider),
  {
    ssr: false,
  },
);

if (env.NEXT_PUBLIC_VITE_NETWORK === "mainnet") {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  registerStashedWallet("SuiNS", {});
}

export function Providers({ children }: { children: ReactNode }) {
  const networkConfig = Object.fromEntries(
    SUPPORTED_NETWORKS.map((network) => [
      network,
      { url: SUINS_ENDPOINTS[network] },
    ]),
  );

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
