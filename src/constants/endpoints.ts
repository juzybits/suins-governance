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
    votingPkgId: "",
    governanceObjId: "",
    stakingConfigObjId: "",
    statsObjId: "",
    coinType: "",
  },
  // see dev/publish.sh
  localnet: {
    votingPkgId:
      "0x08a3a675fe51c70a676ad8e92e8ee91e88b35abc6c31ac0eccfba9beb566049e",
    governanceObjId:
      "0xa22d0a4bd5f1d5486c9c553e6745ce4ee39e711e07e898542dc1ba8947912338",
    stakingConfigObjId:
      "0xeeced86c38a12b607b3ab3f090bcf69d8702524c395041b33954f2fa8ef9ab3e",
    statsObjId:
      "0x0a93fecb9a65319f9104a8ef1fa10b3391c23eabe49dd4012e42e6251fa0feab",
    coinType:
      "0xce8253595968dce607dcded32f423c3da323b2e20a6af272ba0c5f6cd5138bb0::ns::NS",
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
