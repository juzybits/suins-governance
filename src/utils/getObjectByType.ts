import { type KioskClient } from "@mysten/kiosk";
import { type SuiClient } from "@mysten/sui/client";

import { client } from "@/app/SuinsClient";
import {
  getOriginByteKioskContents,
  getSuiKioskContents,
} from "@/hooks/useGetKioskContents";

export async function getNFTsWithByTypes(address: string, types: string[]) {
  let hasNextPage = true;
  let cursor = undefined;
  const data = [];

  while (hasNextPage) {
    const result = await client.getOwnedObjects({
      owner: address,
      limit: 50,
      cursor,
      options: {
        showType: true,
        showContent: true,
        showDisplay: true,
      },
      filter: {
        MatchAny: types.map((x) => ({
          StructType: x,
        })),
      },
    });
    data.push(...result.data);
    hasNextPage = result.hasNextPage;
    cursor = result.nextCursor;
  }

  return data;
}

export async function getNFTsWithByTypesInKiosk(
  address: string,
  kioskClient: KioskClient,
  suiClient: SuiClient,
  types: string[],
) {
  const [suiKiosksResult, obKiosksResult] = await Promise.allSettled([
    getSuiKioskContents(address || "", kioskClient),
    getOriginByteKioskContents(address || "", suiClient),
  ]);
  const suiKiosks =
    suiKiosksResult.status === "fulfilled" ? suiKiosksResult.value : null;
  const obKiosks =
    obKiosksResult.status === "fulfilled" ? obKiosksResult.value : null;
  const kioskData = [...(suiKiosks ?? []), ...(obKiosks ?? [])];

  return kioskData
    .flatMap((kiosk) => kiosk.items)
    .filter((item) => types.includes(item?.type));
}
