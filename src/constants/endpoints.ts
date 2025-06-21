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
      "0x009e29a62bf7c6738f866458ecbb5356b7fab1cc22aee35313efa12ad9e5ce9f",
    governanceObjId:
      "0x5407c633fbb4c94e1825922d7a3a3385c190eccc5fd4b089ed8b151fff520619",
    stakingConfigObjId:
      "0x870f97ae8b8ead8a7833590256440a953178ac65d4b49568c592a12144c779b6",
    statsObjId:
      "0x143d7ea3497e59e61bf52873f02e4694372e762e615f734a6785b0a8f5efc78c",
    coinType:
      "0x3560379dfb7cf87e8189a6533768ab302049daf4ca5e5c9775d5a127cb687735::ns::NS",
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
