export const SUINS_PACKAGES = {
  localnet: {
    votingPkgId:
      "0x8ff8bad1df818046509807cb0427bd91ee948cac0c1c37ea47c27ab431a1dab8",
    governanceObjId:
      "0xc705aa84d27055bd14a5d764b563d8d693354167d56f43e1ac9f899f9b392466",
    stakingConfigId:
      "0x963ca5375e9dd67ce9a0ee682581b4f84d43a0c01537694e98081438a9fbd43f",
    coinType:
      "0xb930419af072bf923e37449d444ad6c5f5326a128e06ac9fe1b0f9f3c5158e22::ns::NS",
    votingTokenType:
      "0xb930419af072bf923e37449d444ad6c5f5326a128e06ac9fe1b0f9f3c5158e22::ns::NS",
    faucet: "",
  },
  testnet: {
    votingPkgId:
      "0x2df7fb6fce94faeb1fb819d51f73fe4549e5d6f827828a641b2806a6dbf2d21b",
    governanceObjId:
      "0x059ba00a90537a197066fc092508f6ddfc3e754e7874763edff3b1d6e702f542",
    stakingConfigId:
      "",
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
    stakingConfigId:
      "",
    coinType:
      "0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS",
    votingTokenType: // TODO: unify with coinType
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
