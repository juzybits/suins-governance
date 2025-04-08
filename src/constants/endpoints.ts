export const SUINS_PACKAGES = {
  localnet: {
    votingPkgId:
      "0x9feea1691fe01710c2317dc69557c7e964d4d06f8d54a479ad3802fdb2c153ae",
    governanceObjId:
      "0xe2cc92e68fdd466ccf10e43961fa38f6f72777f1a5b51674edc62e42f64e5577",
    stakingConfigId:
      "0xc1033c34c4308c18fe4f4d7454cce4ff64b249e61ae206e443c13ccebc5c717e",
    stakingStatsId:
      "0x44b9e5fec63ac257756288393a9723f065fd91e21c549ff740b0d4c1f2d92a3d",
    coinType:
      "0xe6a003ee00949ec17463a21875bc235d73714b1a9f1a48b0b2587fc0d2c4049b::ns::NS",
    votingTokenType:
      "0xe6a003ee00949ec17463a21875bc235d73714b1a9f1a48b0b2587fc0d2c4049b::ns::NS",
    faucet: "",
  },
  testnet: {
    votingPkgId:
      "0x2df7fb6fce94faeb1fb819d51f73fe4549e5d6f827828a641b2806a6dbf2d21b",
    governanceObjId:
      "0x059ba00a90537a197066fc092508f6ddfc3e754e7874763edff3b1d6e702f542",
    stakingConfigId: "",
    stakingStatsId: "",
    // DEMO Coin Type
    coinType:
      "0xe3c2291f345d6dd96855e0f9415e58fd981cf95fd18331f0fb899d91a8969293::ns::NS",
    votingTokenType:
      "0x2df7fb6fce94faeb1fb819d51f73fe4549e5d6f827828a641b2806a6dbf2d21b::token::TOKEN",
    faucet:
      "0xf6d7f2d00a2521f75fcbce03df5dd0d71887287a78296c3d786f36238122f8c9",
  },
  mainnet: {
    votingPkgId:
      "0xd43eeaa30cb62d94ecf7d2a2283913486bfd9288926f9f7ff237ac7a6cb44b41",
    governanceObjId:
      "0xbdaee786ef44ad0f0070829f11c884f1eff2941ebc4bc4e09f8d39544dcf2bdf",
    stakingConfigId: "",
    stakingStatsId: "",
    coinType:
      "0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS",
    // TODO-J: unify with coinType
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
