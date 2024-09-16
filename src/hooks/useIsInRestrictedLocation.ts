import { useQuery } from "@tanstack/react-query";

import { BACKEND_ENDPOINT } from "@/hooks/useAppsBackend";

export function useRestrictedLocation() {
  const { data } = useQuery({
    queryKey: ["restricted-guard"],
    queryFn: async () => {
      const res = await fetch(BACKEND_ENDPOINT, {
        method: "GET",
      });

      if (res.status === 403) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const data = await res.json();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          return { restricted: data?.restricted || false };
        } catch {
          return { restricted: false };
        }
      }

      return { restricted: false };
    },
    initialData: { restricted: false },
    gcTime: Infinity,
    retry: 0,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return data.restricted as boolean;
}
