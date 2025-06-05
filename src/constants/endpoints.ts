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
      "0xeb56f4eda7111f03b889c187ca84f8f86b3bf03763e8cc0738178c5211d93827",
    governanceObjId:
      "0xd8904d98abc78a182764b3dd60f25779e1e156d7edb684da11d2fc82d2f81a45",
    stakingConfigObjId:
      "0xd89d2640a3b5e3a167be58e9273b8df1c95244f97273ae6f3e07bd530f678df5",
    statsObjId:
      "0xe38b160efe414c08559bbc558037936f95b72dbcef10e9ac0b03aa3e62cc49e5",
    coinType:
      "0x141803f95775bbf7e5060bc7f959638261760d3977516307977235c671653c24::ns::NS",
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
