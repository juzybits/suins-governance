export const SUINS_PACKAGES = {
  testnet: {
    /// Package ID for voting
    governancePackageId:
      "0x70dc0c1b62885a97ac80012194b243d0d6c1b87d17dafb624f12817ab4bdcdee",
    governanceObjectID:
      "0x3edce8e45ad0e6b1b73bb1b7e8886014e3136269f2c6acac84a05871158b403f",
  },
  //TODO: update mainnet packageId
  mainnet: {
    /// Package ID for voting
    governancePackageId: "",
    governanceObjectID: "",
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
