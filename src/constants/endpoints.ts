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
  stakingStatsId: string;
  coinType: string;
};

export const SUINS_PACKAGES: {
  [network in SupportedNetwork]: NetworkConfig;
} = {
  localnet: {
    votingPkgId:
      "0x9a7d469a990c59639a2b7d282dc5d8538a4f1c28625eddb3b857128b2defdb7a",
    governanceObjId:
      "0x0b770313ba8db7515b0a3903733fa4aed9df9135a7c39f82e6e34e1cd7c48a3a",
    stakingConfigId:
      "0x671c497143de608cf3cacec12bbb5841548ed1432e6b9b1546942f29362ce542",
    stakingStatsId:
      "0x6a75006fd20dbf9a995c0703ad65002c2010994840272b0a2bf9f657e8d988fb",
    coinType:
      "0xb6f1a1b524d67b19f46c0331ef60212e12a9a87e2b5a477ba1f063f664a2e968::ns::NS",
  },
  devnet: {
    votingPkgId: "",
    governanceObjId: "",
    stakingConfigId: "",
    stakingStatsId: "",
    coinType: "",
  },
  testnet: {
    votingPkgId:
      "0x2df7fb6fce94faeb1fb819d51f73fe4549e5d6f827828a641b2806a6dbf2d21b",
    governanceObjId:
      "0x059ba00a90537a197066fc092508f6ddfc3e754e7874763edff3b1d6e702f542",
    stakingConfigId: "",
    stakingStatsId: "",
    coinType:
      "0xe3c2291f345d6dd96855e0f9415e58fd981cf95fd18331f0fb899d91a8969293::ns::NS",
  },
  mainnet: {
    votingPkgId:
      "0xd43eeaa30cb62d94ecf7d2a2283913486bfd9288926f9f7ff237ac7a6cb44b41",
    governanceObjId:
      "0xbdaee786ef44ad0f0070829f11c884f1eff2941ebc4bc4e09f8d39544dcf2bdf",
    stakingConfigId: "",
    stakingStatsId: "",
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
