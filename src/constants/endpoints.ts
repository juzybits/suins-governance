export const SUINS_PACKAGES = {
  localnet: {
    votingPkgId:
      "0xc726d7e9afcba54067f1cba71c9dff48805794183092cd37da53a8264d6e4ec0",
    governanceObjId:
      "0x1e2a737a5f84323cb6a23d1f8a86478c104aac17bb96d1d17aad1b174879b8f4",
    stakingConfigId:
      "0x887d12ca31c3424df159698742cb98e21a20eed5049089b657928e0405f3f26c",
    stakingStatsId:
      "0x2ef3af8a45c7a6adaa4b003931a37f6ab8ea99440292cb7082e7c8a5a997b8f7",
    coinType:
      "0xaac3ff33be042b8dce6fb3c366115147b6886b6ea174977ed88e9dda0b074151::ns::NS",
    votingTokenType:
      "0xaac3ff33be042b8dce6fb3c366115147b6886b6ea174977ed88e9dda0b074151::ns::NS",
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
