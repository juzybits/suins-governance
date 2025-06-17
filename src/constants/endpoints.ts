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
      "0x4ae569f4a7f3aaa08e9ebed63ed253307f0510b546a7631a871196b9f3a642ba",
    governanceObjId:
      "0x2bf1699ca2a70e65601739f25bf5c809507922e29d1a078123ba5289730cec5d",
    stakingConfigObjId:
      "0x282262b9166b7bda822c538a373a1514b87b28bbc28fe31bfa775ce74e7cf1d0",
    statsObjId:
      "0x862df270718ecbaf0f41463736bf14765d96e2f7ca78708cc33b1507c6db2ce5",
    coinType:
      "0xd336f0aa51d703d0b7eef28a6a8e7d8255e03069d1d1191a37ae05d37edd7d93::ns::NS",
  },
  // see dev/publish.sh
  localnet: {
    votingPkgId:
      "0x07c56c62159bc5bc1f6679e894316eb0382346684e6b6edfe513463232d1ca7c",
    governanceObjId:
      "0xb1e75008115de567ed897dfbb9c36734887934acd7da85d0107240317cad1392",
    stakingConfigObjId:
      "0x93c1fb3c51c373362e585d6dccd71a8c3459088bb76811718b8dce50148bd3d2",
    statsObjId:
      "0x0fc1450a999a2044071b3ee69253b66165bd536fda3c55c05e24059f367f392a",
    coinType:
      "0xe452e095da383d4efd0725d6caa26f623fbfdb94bfaa3da7ee10fe75afc5c15d::ns::NS",
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
