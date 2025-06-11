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
      "0x2df7fb6fce94faeb1fb819d51f73fe4549e5d6f827828a641b2806a6dbf2d21b", // v1
    governanceObjId:
      "0x059ba00a90537a197066fc092508f6ddfc3e754e7874763edff3b1d6e702f542",
    stakingConfigObjId: "",
    statsObjId: "",
    coinType:
      "0xe3c2291f345d6dd96855e0f9415e58fd981cf95fd18331f0fb899d91a8969293::ns::NS",
  },
  devnet: {
    votingPkgId:
      "0x0acdeefe4272348e59038ffb81b1a3866155d0bf8859437918ce13f28c1e9316",
    governanceObjId:
      "0x6b5f9b735149658759f6a20ef906b69f1c95157fbe6d27689d71e0b3861e5053",
    stakingConfigObjId:
      "0x4680041115c1698e3e00b2da916ac89d9597878d4df7a2e7ac406311632243ee",
    statsObjId:
      "0x16bd64f0f5ccd333b9c61e2c5182a5d90271ebd955b28711cfd3b4c2ce51e21d",
    coinType:
      "0x6d7bb34b21e5a3a34ccc59e9e93a40b90c6293a94b611d4f3bc7d0f1a2474b09::ns::NS",
  },
  // see dev/publish.sh
  localnet: {
    votingPkgId:
      "0xad24263748aae0abc2d516b0d6176e13895715a87f9eb6d43f89796dfd66cb36",
    governanceObjId:
      "0x6437159223f97eb52b08fb96cc9bb8584baef49c42c7055172a4d5236abf1f93",
    stakingConfigObjId:
      "0x9890749ab83897b9472b1e15de32508132f521daa4b6fda380d349bc1170b71f",
    statsObjId:
      "0xdb9bfc87ad2d5f7355477d6b6d7036bfaf6cefa3c7abd472fdbd2d8bddb5ba96",
    coinType:
      "0x49ae347fc965c97e11797166729641474eb30667406dc6424196c4afb92cf6cf::ns::NS",
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
