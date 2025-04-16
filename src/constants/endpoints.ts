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
      "0x66da0bcd817b030d5e58bf3f50eeb579cd2321b55fe9017dc43c6b3c4597587c",
    governanceObjId:
      "0x4d5bf9c57fd70c74a28aa7cfd8bca3fa6683547380790ae47f59ec29f15d0dc3",
    stakingConfigId:
      "0x3b9695338ef58b750b19b0f1b0ecdc599412d264ecfe568531d1c3b7578ca339",
    stakingStatsId:
      "0x7ac408bb2f0e29b3b68b04cb5f7b09ec26cb9c8de38e8c87ca057a1c9c69c2cd",
    coinType:
      "0xcbf233541b6cae90a3e8dd73214340c76ed7ada8687fe5254be6a1c77174aa28::ns::NS",
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
