export const SUINS_PACKAGES = {
  localnet: {
    votingPkgId:
      "0x62be809723d77a3e799ad5dbc35c61855cbc9f5efe20ceb35bfa8ddaa8d4e195",
    governanceObjId:
      "0xb0607578ed13b94e850a0af2980152d084dd5e00714cf9d950b7f9df9d818b05",
    stakingConfigId:
      "0x0dc2c6deb0442e998e50a23d1444d687ba82bfa1142afcf1a674a7256a9d4944",
    coinType:
      "0xd7772ec9e74020a8f8aa9307d06f51a97fcb9014bbfe98b1213c54841549394f::ns::NS",
    votingTokenType:
      "0xd7772ec9e74020a8f8aa9307d06f51a97fcb9014bbfe98b1213c54841549394f::ns::NS",
    faucet: "",
  },
  testnet: {
    votingPkgId:
      "0x2df7fb6fce94faeb1fb819d51f73fe4549e5d6f827828a641b2806a6dbf2d21b",
    governanceObjId:
      "0x059ba00a90537a197066fc092508f6ddfc3e754e7874763edff3b1d6e702f542",
    stakingConfigId: "",
    // DEMO Coin Type
    coinType:
      "0xe3c2291f345d6dd96855e0f9415e58fd981cf95fd18331f0fb899d91a8969293::ns::NS",
    // todo: update token object id
    votingTokenType:
      "0x2df7fb6fce94faeb1fb819d51f73fe4549e5d6f827828a641b2806a6dbf2d21b::token::TOKEN",
    faucet:
      "0xf6d7f2d00a2521f75fcbce03df5dd0d71887287a78296c3d786f36238122f8c9",
  },
  //TODO: update mainnet votingPkgId
  mainnet: {
    votingPkgId:
      "0xd43eeaa30cb62d94ecf7d2a2283913486bfd9288926f9f7ff237ac7a6cb44b41",
    governanceObjId:
      "0xbdaee786ef44ad0f0070829f11c884f1eff2941ebc4bc4e09f8d39544dcf2bdf",
    stakingConfigId: "",
    coinType:
      "0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS",
    // TODO: unify with coinType
    votingTokenType:
      "0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS",
    // No faucet for mainnet
    faucet: "",
  },
};

export const SUINS_ENDPOINTS = {
  localnet: {
    fullNodes: "http://127.0.0.1:9000",
  },
  testnet: {
    fullNodes: "https://suins-rpc.testnet.sui.io:443",
    backend: "https://api-testnet.suins.io",
  },
  mainnet: {
    fullNodes: "https://suins-rpc.mainnet.sui.io:443",
    backend: "https://api-mainnet.suins.io",
  },
};
