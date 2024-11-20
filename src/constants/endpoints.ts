export const SUINS_PACKAGES = {
  testnet: {
    packageId:
      "0xbdfe1214aac63e1d7d8aa24dccae50458227650516c46b779f09aa4a13707cdf",
    // DEMO Coin Type
    coinType:
      "0xe3c2291f345d6dd96855e0f9415e58fd981cf95fd18331f0fb899d91a8969293::ns::NS",

    governance:
      "0x739459c526282f71738037128ee6e3e2423941889ffc8e75a3717675148138c7",

    // todo: update token object id
    votingTokenType:
      "0x14800667ae13cf6f045f1d4a5f9df280d36567a28f3ca0963530fd08f4285dc3::token::TOKEN",
    faucet:
      "0x24771ab305244b85c534896ffcba46e6954bd9933e25a2fb6467e85db28cba13",
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
