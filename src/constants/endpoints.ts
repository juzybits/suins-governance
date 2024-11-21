export const SUINS_PACKAGES = {
  testnet: {
    packageId:
      "0x2df7fb6fce94faeb1fb819d51f73fe4549e5d6f827828a641b2806a6dbf2d21b",
    // DEMO Coin Type
    coinType:
      "0xe3c2291f345d6dd96855e0f9415e58fd981cf95fd18331f0fb899d91a8969293::ns::NS",

    governance:
      "0x059ba00a90537a197066fc092508f6ddfc3e754e7874763edff3b1d6e702f542",

    // todo: update token object id
    votingTokenType:
      "0x2df7fb6fce94faeb1fb819d51f73fe4549e5d6f827828a641b2806a6dbf2d21b::token::TOKEN",
    faucet:
      "0xf6d7f2d00a2521f75fcbce03df5dd0d71887287a78296c3d786f36238122f8c9",
  },
  //TODO: update mainnet packageId
  mainnet: {
    packageId:
      "0x17e617d8de5d3eb59dc3f82802e2e2f5c7e8c4cbf42a16b2a0e5bc50e93cedf9",
    coinType:
      "0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS",
    /// Package ID for voting
    governance:
      "0xdfdcfe666bc1fc0648921fcdbcf8a3cba9b3c23cd541f7b9600e82ad9db4daf2",
    votingTokenType:
      "0x17e617d8de5d3eb59dc3f82802e2e2f5c7e8c4cbf42a16b2a0e5bc50e93cedf9::token::TOKEN",
    // No faucet for mainnet
    faucet: "",
  },
};

export const SUINS_ENDPOINTS = {
  testnet: {
    fullNodes: "https://suins-rpc.testnet.sui.io:443",
    backend: "https://api-testnet.suins.io",
  },
  mainnet: {
    fullNodes: "https://suins-rpc.mainnet.sui.io:443",
    backend: "https://api-mainnet.suins.io",
  },
};
