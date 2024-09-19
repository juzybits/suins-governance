export const SUINS_PACKAGES = {
  testnet: {
    // DEMO Coin Type
    coinType:
      "0xe3c2291f345d6dd96855e0f9415e58fd981cf95fd18331f0fb899d91a8969293::ns::NS",
    /// Package ID for voting
    governancePackageId:
      "0x70dc0c1b62885a97ac80012194b243d0d6c1b87d17dafb624f12817ab4bdcdee::proposal::vote",
    governanceObjectID:
      "0x3edce8e45ad0e6b1b73bb1b7e8886014e3136269f2c6acac84a05871158b403f",
    // todo: update token object id
    votingTokenType:
      "0x70dc0c1b62885a97ac80012194b243d0d6c1b87d17dafb624f12817ab4bdcdee::token::TOKEN",
  },
  //TODO: update mainnet packageId
  mainnet: {
    coinType: "",
    /// Package ID for voting
    governancePackageId: "",
    governanceObjectID: "",
    votingTokenType: "",
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
