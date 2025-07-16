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
      "0x9a78fcb5c1155e8818bfd8b1023223ac5b998c4ddd0ace1e2c9446a34b146574",
    governanceObjId:
      "0xbff767a448bff1232de45e05a6a9f497a720a71b5d41d6beb1fc692ad566f385",
    stakingConfigObjId:
      "0xb4f45ae129f4e8e1cd5efb38040c34be82fb60d3fb256000a70346cae3d13efe",
    statsObjId:
      "0x61f068e2b6e22533fedf01f56a0601ceb120d8a10fcd0f37283d9ee012e9d4be",
    coinType:
      "0x5fe8ac9b6293ba9308a79ad05d70520f12c889c757d1a6581b49141e1f6a1d5a::ns::NS",
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
