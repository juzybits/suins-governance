import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useGetNameAvatar } from "./useGetNameAvatar";

export function useGetAccountInfo({ address }: { address?: string }) {
  const { data: resolveSuiNSName } = useSuiClientQuery(
    "resolveNameServiceNames",
    {
      address: address ?? "",
    },
    {
      enabled: !!address,
    },
  );

  const name = resolveSuiNSName?.data?.[0];
  const resp = useGetNameAvatar(name);
  return {
    ...resp,
    ...(!resp.isLoading
      ? {
          data: resp.data,
        }
      : {}),
  };
}
