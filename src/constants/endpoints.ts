export const SUINS_PACKAGES = {
  testnet: {
    packageId:
      "0x14800667ae13cf6f045f1d4a5f9df280d36567a28f3ca0963530fd08f4285dc3",
    // DEMO Coin Type
    coinType:
      "0xe3c2291f345d6dd96855e0f9415e58fd981cf95fd18331f0fb899d91a8969293::ns::NS",
    /// Package ID for voting
    governancePackageId:
      "0xfa7ff2c5a062486279511c6024d1caf219cde895d21065aa0b6b7ece5054f90f::proposal::vote",
    governance:
      "0xfa7ff2c5a062486279511c6024d1caf219cde895d21065aa0b6b7ece5054f90f",
    //NOT USED
    governanceCap:
      "0x0ac4a5333f8b1e0e2bda3b116593ca189cbc8ee7da38eda6306bf98f4b7cfa5a",
    // todo: update token object id
    votingTokenType:
      "0x14800667ae13cf6f045f1d4a5f9df280d36567a28f3ca0963530fd08f4285dc3::token::TOKEN",
    faucet:
      "0x6f05d8aa8c729278df14f2b69938428a50921f16eef38d046195266b5522c136",
  },
  //TODO: update mainnet packageId
  mainnet: {
    packageId: "",
    coinType: "",
    /// Package ID for voting
    governancePackageId: "",
    governance: "",
    governanceCap: "",
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
