import { NETWORK } from "@/constants/env";

const EXPLORER_BASE_LINK = "https://suiscan.xyz";
const EXPLORER_BASE_LINK_TESTNET = "https://suiscan.xyz/testnet";

type ExplorerLinkOptions = {
  id?: string;
  type: "address" | "object" | "transaction";
};

const formattedType: Record<ExplorerLinkOptions["type"], string> = {
  address: "address",
  object: "object",
  transaction: "tx",
};

export const useExplorerLink = (opts: ExplorerLinkOptions) => {
  const { id, type } = opts;
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  if (!id) null;
  const explorerType = formattedType[type];
  const baseLink =
    NETWORK === "mainnet" ? EXPLORER_BASE_LINK : EXPLORER_BASE_LINK_TESTNET;

  return `${baseLink}/${explorerType}/${id}`;
};
