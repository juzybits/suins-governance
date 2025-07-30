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
      "0xbdaee786ef44ad0f0070829f11c884f1eff2941ebc4bc4e09f8d39544dcf2bdf",
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
      "0x7700025ecea8877be12ec1ee8571b34e9dddeb7b140dabe50ecc94912cf9ff29",
    governanceObjId:
      "0x684686ac359a14ad2f775e808ab8d0fb5f042815e0908d7367008612835d7e4c",
    stakingConfigObjId:
      "0xf0f0ff7e9f5f52d1b925f62f3a9c61dc27ce59d3ff1f58a0df4d9c359f364249",
    statsObjId:
      "0xe866a1304c008a618dc59c9c9d249fef7184494851b7de9004ef249ea717b151",
    coinType:
      "0x2dde6e415831af144b8883453e6717b470afabb6082f5d86f50f33b04791b596::ns::NS",
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
