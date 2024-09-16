import { useFeatureValue } from "@growthbook/growthbook-react";
import { useSuiClient } from "@mysten/dapp-kit";
import { CoinMetadata } from "@mysten/sui/client";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";
import { useQuery } from "@tanstack/react-query";

import { AppFeatures } from "@/experimentation";

export function useCoinMetadata({
  coinType,
  enabled = true,
}: {
  coinType?: string | null;
  enabled?: boolean;
}) {
  const suiClient = useSuiClient();
  const tokenMetadataOverrides = useFeatureValue<
    AppFeatures["token-metadata-overrides"]
  >("token-metadata-overrides", {});

  return useQuery({
    queryKey: ["coin-metadata", coinType, tokenMetadataOverrides],
    queryFn: async () => {
      if (!coinType) {
        throw new Error(
          "Fetching coin metadata should be disabled when coin type is disabled.",
        );
      }
      // Optimize the known case of SUI to avoid a network call:
      if (coinType === SUI_TYPE_ARG) {
        const metadata: CoinMetadata = {
          id: null,
          decimals: 9,
          description: "",
          iconUrl: null,
          name: "Sui",
          symbol: "SUI",
        };

        return metadata;
      }

      return suiClient.getCoinMetadata({ coinType });
    },
    select: (data) => {
      if (data?.name && coinType) {
        return {
          ...data,
          name: tokenMetadataOverrides[coinType]?.name || data.name,
          iconUrl: tokenMetadataOverrides[coinType]?.iconUrl || data.iconUrl,
        };
      }
      return data;
    },
    retry: false,
    enabled: !!coinType && enabled,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
  });
}
