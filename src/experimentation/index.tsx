import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import type { ReactNode } from "react";

export interface AppFeatures {
  "recognized-packages": string[];
  "wallet-balance-refetch-interval": number;
  "wallet-fee-address": string;
  "wallet-onramp-banxa": boolean;
  "wallet-onramp-coinbase": boolean;
  "wallet-onramp-moonpay": boolean;
  "wallet-onramp-transak": boolean;
  "token-name-overrides": {
    [coinType: string]: string;
  };
  "token-metadata-overrides": {
    [coinType: string]: {
      name?: string;
      iconUrl?: string;
    };
  };
  buynlargev2: {
    enabled: boolean;
    objectType: string;
    sheetTitle: string;
    sheetDescription: string;
    homeDescription: string;
    homeImage: string;
    backgroundColor: string;
  }[];
  "wallet-ad-campaign": {
    enabled: boolean;
    sheetImage: string;
    sheetButtonText: string;
    sheetButtonColor: string;
    sheetButtonLink: string;
    sheetDismissKey: string;
    homeDescription: string;
    homeImage: string;
    homeBannerBgColor: string;
  };
}

export const growthbook = new GrowthBook<AppFeatures>({
  // If you want to develop locally, you can set the API host to this:
  // apiHost: 'http://localhost:3003',
  apiHost: "https://apps-backend.sui.io",
  // clientKey: __DEV__ ? 'development' : 'production',
  // enableDevMode: __DEV__,
});

// Start loading features as soon as possible:
growthbook.loadFeatures();

export function ExperimentationProvider({ children }: { children: ReactNode }) {
  return (
    <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
  );
}
