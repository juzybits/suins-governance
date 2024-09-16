import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import type { ReactNode } from "react";

export interface AppFeatures {
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  "token-name-overrides": {
    [coinType: string]: string;
  };
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  "token-metadata-overrides": {
    [coinType: string]: {
      name?: string;
      iconUrl?: string;
    };
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
void growthbook.loadFeatures();

export function ExperimentationProvider({ children }: { children: ReactNode }) {
  return (
    <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
  );
}
