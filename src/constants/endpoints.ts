import { getFullnodeUrl } from "@mysten/sui/client";

export const SUPPORTED_NETWORKS = [
  "localnet",
  "devnet",
  "testnet",
  "mainnet",
] as const;

export type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number];

export function isSupportedNetwork(str: string): str is SupportedNetwork {
  return SUPPORTED_NETWORKS.includes(str as SupportedNetwork);
}

export type NetworkConfig = {
  votingPkgId: string;
  governanceObjId: string;
  stakingConfigId: string;
  statsId: string;
  coinType: string;
};

export const SUINS_PACKAGES: {
  [network in SupportedNetwork]: NetworkConfig;
} = {
  localnet: {
    votingPkgId:
      "0x9432310a99f4cdba2eab4a29dbee97f4531f259615a040518a34f4caf93460a1",
    governanceObjId:
      "0xf58401a81d3f638e6bcdb16adf6a45fd62ecd3df66cfe1a34957dee17740fdec",
    stakingConfigId:
      "0xf387313d3c1919a88d2e852c35d660df404e99160b1daaf2fde36aeff0227d9f",
    statsId:
      "0xe3ee85eeb39b03bed149fe6e60da36eb33a3cba29ffb9a7f7354fbe6140b32c4",
    coinType:
      "0xaba946538a569de83b1c44d6d58e4c1e70ce4fe9c2a8c860c0610525fb5fd839::ns::NS",
  },
  devnet: {
    votingPkgId: "",
    governanceObjId: "",
    stakingConfigId: "",
    statsId: "",
    coinType: "",
  },
  testnet: {
    votingPkgId:
      "0x2df7fb6fce94faeb1fb819d51f73fe4549e5d6f827828a641b2806a6dbf2d21b",
    governanceObjId:
      "0x059ba00a90537a197066fc092508f6ddfc3e754e7874763edff3b1d6e702f542",
    stakingConfigId: "",
    statsId: "",
    coinType:
      "0xe3c2291f345d6dd96855e0f9415e58fd981cf95fd18331f0fb899d91a8969293::ns::NS",
  },
  mainnet: {
    votingPkgId:
      "0xd43eeaa30cb62d94ecf7d2a2283913486bfd9288926f9f7ff237ac7a6cb44b41",
    governanceObjId:
      "0xbdaee786ef44ad0f0070829f11c884f1eff2941ebc4bc4e09f8d39544dcf2bdf",
    stakingConfigId: "",
    statsId: "",
    coinType:
      "0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS",
  },
};

export const SUINS_ENDPOINTS: {
  [network in SupportedNetwork]: string;
} = {
  localnet: "http://127.0.0.1:9000",
  devnet: getFullnodeUrl("devnet"),
  testnet: "https://suins-rpc.testnet.sui.io:443",
  mainnet: "https://suins-rpc.mainnet.sui.io:443",
};
