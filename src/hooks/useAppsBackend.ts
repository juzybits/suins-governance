import { useCallback } from "react";

export const BACKEND_ENDPOINT = "https://apps-backend.sui.io";
//  process.env.NODE_ENV === 'development' ? 'http://localhost:3003' :
// TODO: Use the @mysten/core version of this file once we've moved all
// applications under a common repository.
export function useAppsBackend() {
  const request = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async <T>(
      path: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryParams?: Record<string, any>,
      options?: RequestInit,
    ): Promise<T> => {
      const res = await fetch(
        formatRequestURL(`${BACKEND_ENDPOINT}/${path}`, queryParams),
        options,
      );

      if (!res.ok) {
        throw new Error("Unexpected response");
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return res.json();
    },
    [],
  );

  return { request };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatRequestURL(url: string, queryParams?: Record<string, any>) {
  if (queryParams && Object.keys(queryParams).length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const searchParams = new URLSearchParams(queryParams);
    return `${url}?${searchParams.toString()}`;
  }
  return url;
}
