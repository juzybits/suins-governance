export const SUINS_PACKAGES = {
  testnet: {
    packageId:
      "0x79564cd76dd23e968136463eff836ae4a8950cf29e7a171b1f8b8946cc3a846a",
    // DEMO Coin Type
    coinType:
      "0xe3c2291f345d6dd96855e0f9415e58fd981cf95fd18331f0fb899d91a8969293::ns::NS",

    governance:
      "0x607bf8fda1eab7bca26b03cb0ac089ff9633804ab86fd0a09bf08024553db21e",

    // todo: update token object id
    votingTokenType:
      "0x79564cd76dd23e968136463eff836ae4a8950cf29e7a171b1f8b8946cc3a846a::token::TOKEN",
    faucet:
      "0x32b8b4304506636489efc262d680fa0d21ad45e1f375f23406dcdaa314ec7461",
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
