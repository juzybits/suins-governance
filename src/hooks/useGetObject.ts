import { type SuiObjectDataOptions } from "@mysten/sui/client";
import { normalizeSuiAddress } from "@mysten/sui/utils";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/app/SuinsClient";

const DEFAULT_OPTIONS: SuiObjectDataOptions = {
  showType: true,
  showContent: true,
  showOwner: true,
  showStorageRebate: true,
  showDisplay: true,
};

export function getObject(objectId: string, options = DEFAULT_OPTIONS) {
  return client.getObject({
    id: normalizeSuiAddress(objectId),
    options,
  });
}

export function useGetObject(
  objectId?: string | null,
  options = DEFAULT_OPTIONS,
) {
  const normalizedObjId = objectId ? normalizeSuiAddress(objectId) : "";
  return useQuery({
    queryKey: ["object", normalizedObjId],
    queryFn: () => getObject(normalizedObjId, options),
    enabled: !!normalizedObjId.length,
  });
}
