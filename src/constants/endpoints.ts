export const SUINS_PACKAGES = {
  localnet: {
    votingPkgId:
      "0xc1c048edbf9d741082a510ef15561f2f4bef96b32348ef9855a87d3c7d365c43",
    governanceObjId:
      "0x3ba0d473dafa186c533df1af5ce72f92376c14fb85871ecfcb85a7ca1f35926e",
    coinType:
      "0x1d4c11570f5dae18487fab508a57d1f4a66dec063d448a5d6d18c25ac0423095::ns::NS",
    votingTokenType:
      "0x1d4c11570f5dae18487fab508a57d1f4a66dec063d448a5d6d18c25ac0423095::ns::NS",
    faucet: "",
    stakingConfigId: "0x6e179c73f4be943455b002db38c828106d3d8c5ba3c458c6e9ba8fef176bdeb3"
  },
  testnet: {
    votingPkgId:
      "0x2df7fb6fce94faeb1fb819d51f73fe4549e5d6f827828a641b2806a6dbf2d21b",
    governanceObjId:
      "0x059ba00a90537a197066fc092508f6ddfc3e754e7874763edff3b1d6e702f542",
    // DEMO Coin Type
    coinType:
      "0xe3c2291f345d6dd96855e0f9415e58fd981cf95fd18331f0fb899d91a8969293::ns::NS",
    // todo: update token object id
    votingTokenType:
      "0x2df7fb6fce94faeb1fb819d51f73fe4549e5d6f827828a641b2806a6dbf2d21b::token::TOKEN",
    faucet:
      "0xf6d7f2d00a2521f75fcbce03df5dd0d71887287a78296c3d786f36238122f8c9",
      stakingConfigId: ""
  },
  //TODO: update mainnet votingPkgId
  mainnet: {
    votingPkgId:
      "0xd43eeaa30cb62d94ecf7d2a2283913486bfd9288926f9f7ff237ac7a6cb44b41",
    governanceObjId:
      "0xbdaee786ef44ad0f0070829f11c884f1eff2941ebc4bc4e09f8d39544dcf2bdf",
    coinType:
      "0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS",
    votingTokenType:
      "0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS",
    // No faucet for mainnet
    faucet: "",
    stakingConfigId: ""
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
