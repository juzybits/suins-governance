import { useSuiClientQuery } from "@mysten/dapp-kit";
import { type SuiObjectResponse } from "@mysten/sui/client";
import { z } from "zod";

import { NETWORK } from "@/constants/env";
import { useSuinsClient } from "@/app/SuinsClient";

const avatarContentSchema = z.object({
  dataType: z.literal("moveObject"),
  type: z.string(),
  hasPublicTransfer: z.boolean(),
  fields: z.object({
    id: z.object({
      id: z.string(),
    }),
    name: z.object({
      type: z.string(),
      fields: z.object({
        labels: z.array(z.string()),
      }),
    }),
    value: z.object({
      type: z.string(),
      fields: z.object({
        data: z.object({
          type: z.string(),
          fields: z.object({
            contents: z.array(
              z.object({
                type: z.string(),
                fields: z.object({
                  key: z.string(),
                  value: z.string(),
                }),
              }),
            ),
          }),
        }),
        expiration_timestamp_ms: z.string(),
        nft_id: z.string(),
        target_address: z.string(),
      }),
    }),
  }),
});

const extractAvatarAndNftId = (
  dynamicFieldObject?: SuiObjectResponse,
): { avatar?: string; nft_id?: string; expiration_timestamp_ms?: string } => {
  if (
    !dynamicFieldObject ||
    dynamicFieldObject?.data?.content?.dataType !== "moveObject"
  )
    return {};

  // const fields = dynamicFieldObject.data.content.fields as Record<string, any>;
  let avatar: string | undefined;
  let nft_id: string | undefined;
  let expiration_timestamp_ms: string | undefined;

  const safeParseContent = avatarContentSchema.safeParse(
    dynamicFieldObject.data.content,
  );
  const { data } = safeParseContent;

  if (!data) return {};

  // Extract avatar from contents
  // data.fields.value.fields.data.fields.contents
  //fields.value.fields.data.fields.contents

  for (const entry of data.fields.value.fields.data.fields.contents) {
    if (entry.fields.key === "avatar") {
      avatar = entry.fields.value;
      expiration_timestamp_ms =
        data.fields.value.fields.expiration_timestamp_ms;
      break;
    }
  }

  // Extract nft_id

  if (data.fields.value.fields.nft_id) {
    nft_id = data.fields.value.fields.nft_id;
    expiration_timestamp_ms = data.fields.value.fields.expiration_timestamp_ms;
  }

  return { avatar, nft_id, expiration_timestamp_ms };
};

// Names - domain, subname -> test.test
export function useGetNameAvatar(name?: string) {
  const { client } = useSuinsClient();
  const nameQuery = name?.replace(".sui", "")?.split(".");
  const { data: dynamicFieldObject, isLoading: dynamicFieldLoading } =
    useSuiClientQuery(
      "getDynamicFieldObject",
      {
        parentId: client.constants.registryTableId ?? "",
        name: {
          value: ["sui", ...(nameQuery?.reverse() ?? [])],
          type: `${client.constants.suinsPackageId?.v1 ?? ""}::domain::Domain`,
        },
      },
      {
        queryKey: ["name-avatar", name, "dfo"],
      },
    );

  const { avatar, nft_id, expiration_timestamp_ms } =
    extractAvatarAndNftId(dynamicFieldObject);
  const network = NETWORK === "mainnet" ? "mainnet" : "testnet";
  const endpointUrl = `https://api-${network}.suins.io/nfts/${name}/${expiration_timestamp_ms}`;

  const resp = useSuiClientQuery(
    "getObject",
    {
      id: avatar ?? nft_id ?? "",
      options: {
        showDisplay: true,
        showOwner: true,
        showType: true,
      },
    },
    {
      enabled: !!avatar || !!nft_id,
      select: (data) => {
        const imgUrl = data?.data?.display?.data?.image_url;

        return {
          url: !imgUrl || !avatar ? endpointUrl : imgUrl,
          isAvatar: !!avatar,
          expirationTimestampMs: expiration_timestamp_ms,
          avatarId: avatar,
          nftId: nft_id,
          name,
        };
      },
      queryKey: ["name-avatar", name, "object"],
    },
  );

  return {
    ...resp,
    isLoading: resp.isLoading || dynamicFieldLoading,
  };
}
