import { useQuery } from "@tanstack/react-query";

import { useAppsBackend } from "./useAppsBackend";

type ProductAnalyticsConfigResponse = { mustProvideCookieConsent: boolean };

// TODO: Use the @mysten/core version of this file once we've moved all
// applications under a common repository.
export function useProductAnalyticsConfig() {
  const { request } = useAppsBackend();
  return useQuery({
    queryKey: ["apps-backend", "product-analytics-config"],
    queryFn: () => request<ProductAnalyticsConfigResponse>("product-analytics"),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: Infinity,
  });
}
