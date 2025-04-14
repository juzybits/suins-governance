export const SUPPORTED_NETWORKS = ["localnet", "testnet", "mainnet"] as const;

export type SupportedNetwork = typeof SUPPORTED_NETWORKS[number];

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
      "0x749a3cce0636f6034790acf054a03b6fb216bdf9a6ea7f326aa2e717c5638a7e",
    governanceObjId:
      "0x181be21d5b2e025de7e2dd6f133050e7718abd64b14255bd573d18981458c983",
    stakingConfigId:
      "0x29d184432738e3eb4a17e523398261753d221058466c358568b3a9dd087595de",
    stakingStatsId:
      "0x717c3bdfee2e73c612a10ea62f03dc6dee8b26ce93370406a154162d4b127fd6",
    coinType:
      "0xffcc10b8b2b1e3acdee1f85e488b2d6af5791b4519eb982fe1ccfd3fde6d6a0a::ns::NS",
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

export const SUINS_ENDPOINTS = {
  localnet: {
    fullNodes: "http://127.0.0.1:9000",
  },
  testnet: {
    fullNodes: "https://suins-rpc.testnet.sui.io:443",
    backend: "https://api-testnet.suins.io",
  },
  mainnet: {
    fullNodes: "https://suins-rpc.mainnet.sui.io:443",
    backend: "https://api-mainnet.suins.io",
  },
};
