"use client";
import { useSuiClientContext } from "@mysten/dapp-kit";
import { KioskClient as Kiosk, Network } from "@mysten/kiosk";
import { createContext, type ReactNode, useMemo } from "react";

export const KioskClientContext = createContext<Kiosk | null>(null);

const suiToKioskNetwork: Record<string, Network> = {
  mainnet: Network.MAINNET,
  testnet: Network.TESTNET,
};

export type Props = {
  children: ReactNode;
};

export function KioskClientProvider({ children }: Props) {
  const { client, network } = useSuiClientContext();
  const kioskNetwork =
    suiToKioskNetwork[network.toLowerCase()] ?? Network.CUSTOM;
  const kioskClient = useMemo(
    () => new Kiosk({ client, network: kioskNetwork }),
    [client, kioskNetwork],
  );
  return (
    <KioskClientContext.Provider value={kioskClient}>
      {children}
    </KioskClientContext.Provider>
  );
}
