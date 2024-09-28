export const SUINS_PACKAGES = {
  testnet: {
    // DEMO Coin Type
    coinType:
      "0xe3c2291f345d6dd96855e0f9415e58fd981cf95fd18331f0fb899d91a8969293::ns::NS",
    /// Package ID for voting
    governancePackageId:
      "0xbf38d3107fbf24f2be4b6ac3e01613cc541fa92d34ecb37f346fd951d636b2c8::proposal::vote",
    governanceCap:
      "0x2bfd51ac74ad5c7a9ff2faba3c91666f0c81c4b45fa0a441383913c44d4d298a",
    // todo: update token object id
    votingTokenType:
      "0xbf38d3107fbf24f2be4b6ac3e01613cc541fa92d34ecb37f346fd951d636b2c8::token::TOKEN",
  },
  //TODO: update mainnet packageId
  mainnet: {
    coinType: "",
    /// Package ID for voting
    governancePackageId: "",
    governanceCap: "",
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
