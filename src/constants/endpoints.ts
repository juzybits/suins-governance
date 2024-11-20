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
    packageId: "",
    coinType: "",
    /// Package ID for voting
    governance: "",
    votingTokenType: "",
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
