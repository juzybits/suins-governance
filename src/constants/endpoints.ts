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
      "0x99373128e65da35961543080a1a280ab37e3bf289da2404b5f7c82a09d23be22",
    governanceObjId:
      "0x9d2f38e3caa9e6102a335be5c9f7d94893b90b64a7572580b8220df5492c7dc9",
    stakingConfigId:
      "0xd62d5d48125d047d46ddbe22c9a42a868b73d37dd5b2f2d02850c77b64848606",
    stakingStatsId:
      "0x44e63f3c15b4e0dccde442c3552a884dd1e5a0ccb6f66ec3ad602be491af72cb",
    coinType:
      "0xbfc49f8d166feaafa55d374c9600d898604f5a94d89d12dee8a07827991e4c07::ns::NS",
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
