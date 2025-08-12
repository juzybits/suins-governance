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
      "0x78e90d0f38f3880e6243742ca857f64e6896875e188abd5fa1356c1b48e4c71e",
    governanceObjId:
      "0x7c10dcbeff6ce12af94c4a440ee9bcd92d6e2bb94dc2bbd3ab39c56dd9b53b48",
    stakingConfigObjId:
      "0x7ac44505465616136c5aca6d9aa049ffd88db694290b76ac7f412d434aa27f11",
    statsObjId:
      "0xe23224303ad7c91e7ed3021ce7f9f7d3fd8f2317048c239370a521376cf4624e",
    coinType:
      "0x11ac5a1cd527f30c315b271374b6e5bfbd322c0f6ced164782ad6e5fdb248449::ns::NS",
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
