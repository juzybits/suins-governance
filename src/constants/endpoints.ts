import { getFullnodeUrl } from "@mysten/sui/client";

export const SUPPORTED_NETWORKS = [
  "mainnet",
  "testnet",
  "devnet",
  "localnet",
] as const;

export type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number];

export function isSupportedNetwork(str: string): str is SupportedNetwork {
  return SUPPORTED_NETWORKS.includes(str as SupportedNetwork);
}

export type NetworkConfig = {
  votingPkgId: string;
  governanceObjId: string;
  stakingConfigObjId: string;
  statsObjId: string;
  coinType: string;
};

export const SUINS_PACKAGES: {
  [network in SupportedNetwork]: NetworkConfig;
} = {
  mainnet: {
    votingPkgId:
      "0xd43eeaa30cb62d94ecf7d2a2283913486bfd9288926f9f7ff237ac7a6cb44b41", // v1
    governanceObjId:
      "0xbdaee786ef44ad0f0070829f11c884f1eff2941ebc4bc4e09f8d39544dcf2bdf", // v1
    stakingConfigObjId: "",
    statsObjId: "",
    coinType:
      "0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS",
  },
  testnet: {
    votingPkgId:
      "0x68b1efb0bcd7d831314826c4843574cd39f44d0caa23b5bf3d632fd93955770a",
    governanceObjId:
      "0x6b08cb337a1d28f4e1f73347e39422bbbd8f7598983ffac040116acd492f2cfd",
    stakingConfigObjId:
      "0xa229047611c5b6165c76eaf9a98279bc43fedcf67ebc2a22257ee1714ec334e5",
    statsObjId:
      "0xbbbb54ead6016572cb1cc9a266f1adf7be7516b5681307607fb6bf821f61979b",
    coinType:
      "0x3a47d8cf4dbb2b2050b91afee2dd50f88c3c63d02c60df4ce543e81542121260::ns::NS",
  },
  devnet: {
    votingPkgId:
      "0x82ae172f61718fc165db718680b7dde40e09b646bbcf84158a97ff114a5f9d54",
    governanceObjId:
      "0x7d8b16d644ceafde9ede1987630b87770d636e02ca7f0d7b0e6f57a4ea3e1bba",
    stakingConfigObjId:
      "0x011beadd16be5e383aef7783a9f6dfcdf64074a4655ea15137ecbbcf2e7429d2",
    statsObjId:
      "0x68ab9d3477f305225f0de8b54c4421cce3c9f51dfe1636f66813c0e5614294b4",
    coinType:
      "0x74fbde42f4ec45ab3fb3d12adba04476d8fcebaa7ffaafa861de93d7d2519cfc::ns::NS",
  },
  // see dev/publish.sh
  localnet: {
    votingPkgId: "",
    governanceObjId: "",
    stakingConfigObjId: "",
    statsObjId: "",
    coinType: "",
  },
};

export const SUINS_ENDPOINTS: {
  [network in SupportedNetwork]: string;
} = {
  mainnet: "https://suins-rpc.mainnet.sui.io:443",
  testnet: "https://suins-rpc.testnet.sui.io:443",
  devnet: getFullnodeUrl("devnet"),
  localnet: "http://127.0.0.1:9000",
};
