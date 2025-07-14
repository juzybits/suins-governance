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
      "0xed358203d9d6605d7f4e29c4f0caccac2be36f837896e255c9cd7b46f6a25159",
    governanceObjId:
      "0xd1645bc54d115d12071dc69176f5bd33bd9a894bc076ebd2a04f3fc8fcff203b",
    stakingConfigObjId:
      "0x90b9b5b4ae1b955a2723e54eef28d1f986bbae00abad53bde0e0b053b7e45852",
    statsObjId:
      "0x973b95a02510d33ca0823ad23dcd0742b170237f413c3345eef50b0f49b4f7b3",
    coinType:
      "0x11f9f1af8e1af2fd1fbf07bf2f52028beb7bbd3fe632589cf5d84082673a20af::ns::NS",
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
