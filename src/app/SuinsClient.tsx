import { SuinsClient } from "@mysten/suins";
import { SuiClient } from "@mysten/sui/client";
import { createContext, type ReactNode, useContext } from "react";
import { NETWORK } from "@/constants/env";
import { SUINS_ENDPOINTS } from "@/constants/endpoints";

export const client = new SuiClient({
  url: SUINS_ENDPOINTS[NETWORK].fullNodes,
});

// Now you can use it to create a SuiNS client.
export const suinsClient = new SuinsClient({
  client,
  network: NETWORK === "testnet" ? "testnet" : "mainnet",
});

type SuinsClientProps = {
  client: SuinsClient;
};

const SuinsClientContext = createContext<SuinsClientProps | null>(null);

export function useSuinsClient() {
  const context = useContext(SuinsClientContext);
  if (context === null) {
    throw new Error("useSuinsClient must be used within a SuinsClientProvider");
  }
  return context;
}

export function SuinsClientProvider({ children }: { children: ReactNode }) {
  return (
    <SuinsClientContext.Provider
      value={{
        client: suinsClient,
      }}
    >
      {children}
    </SuinsClientContext.Provider>
  );
}
