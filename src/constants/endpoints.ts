export const SUINS_PACKAGES = {
  localnet: {
    votingPkgId:
      "0xde972eddd09caa5601dedf052b284726341db4827811562fed70c5fe8900650d",
    governanceObjId:
      "0x6e15a086063a500b6c094831c901fab2ea627fcae7deb177ec9fa348d98565a1",
    stakingConfigId:
      "0x144ae922c574e8138fe981ce189eb201801dbafd2b9d283851439fabf4dd6b50",
    coinType:
      "0xd6b5b01974cf20e86431d31fee66eebc14d09929303d1178efae288b3878e48b::ns::NS",
    votingTokenType:
      "0xd6b5b01974cf20e86431d31fee66eebc14d09929303d1178efae288b3878e48b::ns::NS",
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
