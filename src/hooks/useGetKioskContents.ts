import { useSuiClientContext } from "@mysten/dapp-kit";
import {
  KIOSK_ITEM,
  KIOSK_OWNER_CAP,
  type KioskClient,
  type KioskItem,
  type KioskOwnerCap,
  type Network,
  PERSONAL_KIOSK_RULE_ADDRESS,
} from "@mysten/kiosk";
import {
  type SuiClient,
  type SuiObjectData,
  type SuiObjectResponse,
} from "@mysten/sui/client";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import { NAME_OBJECT_TYPE, SUB_NAME_STRUCT_TYPE } from "@/constants/common";
import { KioskClientContext } from "@/app/KioskClientProvider";

export const ORIGINBYTE_KIOSK_MODULE =
  "0x95a441d389b07437d00dd07e0b6f05f513d7659b13fd7c5d3923c7d9d847199b::ob_kiosk";

export const ORIGINBYTE_KIOSK_OWNER_TOKEN = `${ORIGINBYTE_KIOSK_MODULE}::OwnerToken`;

export function isKioskOwnerToken(
  network: Network,
  object?: SuiObjectResponse | SuiObjectData | null,
) {
  if (!object) return false;
  const objectData =
    "data" in object && object.data ? object.data : (object as SuiObjectData);
  return [
    KIOSK_OWNER_CAP,
    `${PERSONAL_KIOSK_RULE_ADDRESS[network]}::personal_kiosk::PersonalKioskCap`,
    ORIGINBYTE_KIOSK_OWNER_TOKEN,
  ].includes(objectData?.type ?? "");
}

export function getKioskIdFromOwnerCap(
  object: SuiObjectResponse | SuiObjectData,
) {
  const objectData =
    "data" in object && object.data ? object.data : (object as SuiObjectData);
  const fields =
    objectData.content?.dataType === "moveObject"
      ? (objectData.content.fields as {
          for?: string;
          kiosk?: string;
          cap?: { fields: { for: string } };
        })
      : null;

  return fields?.for ?? fields?.kiosk ?? fields?.cap?.fields.for ?? null;
}
export function useKioskClient() {
  const kioskClient = useContext(KioskClientContext);
  if (!kioskClient) {
    throw new Error(
      "Kiosk client not found. Please make sure KioskClientProvider is set up.",
    );
  }
  return kioskClient;
}

export enum KioskTypes {
  SUI = "sui",
  ORIGINBYTE = "originByte",
}

export type Kiosk = {
  items: KioskItem[];
  itemIds: string[];
  kioskId: string;
  type: KioskTypes;
  ownerCap?: KioskOwnerCap;
};

export async function getOriginByteKioskContents(
  address: string,
  client: SuiClient,
) {
  const data = await client.getOwnedObjects({
    owner: address,
    filter: {
      StructType: ORIGINBYTE_KIOSK_OWNER_TOKEN,
    },
    options: {
      showContent: true,
    },
  });
  const ids = data.data.map((object) =>
    getKioskIdFromOwnerCap(object),
  ) as string[];

  // fetch the user's kiosks
  const ownedKiosks = await client.multiGetObjects({
    ids: ids.flat(),
    options: {
      showContent: true,
    },
  });

  const contents = await Promise.all(
    ownedKiosks
      .map(async (kiosk) => {
        if (!kiosk.data) return;
        const objects = await client.getDynamicFields({
          parentId: kiosk.data.objectId,
        });

        const objectIds = objects.data
          .filter((obj) => obj.name.type === KIOSK_ITEM)
          .map((obj) => obj.objectId);

        // fetch the contents of the objects within a kiosk
        const kioskContent = await client.multiGetObjects({
          ids: objectIds,
          options: {
            showContent: true,
            showDisplay: true,
            showType: true,
          },
        });

        return {
          itemIds: objectIds,
          items: kioskContent.map((item) => ({
            ...item,
            kioskId: kiosk.data?.objectId,
            objectId: item.data?.objectId,
          })),
          kioskId: kiosk.data.objectId,
          type: KioskTypes.ORIGINBYTE,
        };
      })
      .filter(Boolean) as Promise<Kiosk>[],
  );
  return contents;
}

export async function getSuiKioskContents(
  address: string,
  kioskClient: KioskClient,
) {
  const ownedKiosks = await kioskClient.getOwnedKiosks({ address });
  const contents = await Promise.all(
    ownedKiosks.kioskIds.map(async (id: string) => {
      const kiosk = await kioskClient.getKiosk({
        id,
        options: {
          withObjects: true,
          objectOptions: {
            showDisplay: true,
            showContent: true,
            showType: true,
          },
        },
      });
      return {
        itemIds: kiosk.itemIds,
        items: kiosk.items,
        kioskId: id,
        type: KioskTypes.SUI,
        ownerCap: ownedKiosks.kioskOwnerCaps.find((k) => k.kioskId === id),
      };
    }),
  );
  return contents;
}

// Get all the SuiNS kiosk contents for a given address.
export async function getSuiNSKioskContents(
  address: string,
  kioskClient: KioskClient,
  suiClient: SuiClient,
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

  return {
    kioskData,
    suiNSData: kioskData
      .flatMap((kiosk) => kiosk.items)
      .filter(
        (item) =>
          item?.type?.includes(`::${NAME_OBJECT_TYPE}`) ||
          item?.type?.includes(`::${SUB_NAME_STRUCT_TYPE}`),
      ),
  };
}

export function useGetKioskContents(
  address?: string | null,
  disableOriginByteKiosk?: boolean,
) {
  const { client: suiClient } = useSuiClientContext();
  const kioskClient = useKioskClient();
  return useQuery({
    queryKey: ["get-kiosk-contents", address, disableOriginByteKiosk],
    queryFn: async () => {
      const suiKiosks = await getSuiKioskContents(address!, kioskClient);
      const obKiosks = await getOriginByteKioskContents(address!, suiClient);
      return [...suiKiosks, ...obKiosks];
    },
    select(data) {
      const kiosks = new Map<string, Kiosk>();
      const lookup = new Map<string, string>();

      data.forEach((kiosk) => {
        kiosks.set(kiosk.kioskId, kiosk);
        kiosk.itemIds.forEach((id) => {
          lookup.set(id, kiosk.kioskId);
        });
      });

      return {
        kiosks,
        list: data.flatMap((kiosk) => kiosk.items),
        lookup,
      };
    },
    enabled: !!address?.length,
  });
}

// Returns the owned kiosks for an address.
// Allows us to map a kioskId with an OwnerCap.
export function useGetOwnedKiosks(address: string) {
  const kioskClient = useKioskClient();
  return useQuery({
    queryKey: ["owned-kiosks", address],
    queryFn: () => kioskClient.getOwnedKiosks({ address }),
  });
}
