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
      "0xc1f4ab9b55cb4498866ab9040a0bf9b5d516e2ff7b68c4960e18b00509214c76",
    governanceObjId:
      "0x8a785c33675ae540c6d90f2939d9eb0332c724f2eb77da911c63920682953bc8",
    stakingConfigId:
      "0xee5fc9d162634505a5d57d5e32e02c269e2b677d40979cff08c01a8586d1b35f",
    statsId:
      "0xd1e94f1e89bb6ff79d7950a80a75cffe63006d1e6af6ae4faaa752939fc1702b",
    coinType:
      "0x1a06fd265f6761e339c6a82e5b0a195a73d8df4c9676728e99bef50cba1e9125::ns::NS",
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
