import { client } from "@/app/SuinsClient";
import { useQuery } from "@tanstack/react-query";
import { SUINS_PACKAGES } from "@/constants/endpoints";

import { NETWORK } from "@/constants/env";

export function useGetDiscountDynamicFieldsObjects() {
  const network = NETWORK === "mainnet" ? "mainnet" : "testnet";
  return useQuery({
    queryKey: ["discount-dynamic-fields-objects"],
    queryFn: async () => {
      const getProposalsContent = await client.getDynamicFields({
        parentId: SUINS_PACKAGES[network].governanceObjectID,
        limit: 20,
      });
      return Promise.allSettled(
        getProposalsContent.data.map((item) =>
          client.getDynamicFieldObject({
            parentId: item.objectId,
            name: item.name,
          }),
        ),
      );
    },
  });
}
