export const SUINS_PACKAGES = {
  localnet: {
    votingPkgId:
      "0xd09e280b9e3175000b54ab43187d003be6f9354a2306715bf9d47c6a2a53a345",
    governanceObjId:
      "0xe71c4b4b806a005ffef74e2f559e4132662e00d105aa27e33fc34f1b181d74ff",
    stakingConfigId:
      "0x0f7801a03cb8a6e57cba3b2aa1e16bc4e10a1eb8d60d910857fc478b3b590cd4",
    stakingStatsId:
      "0xe49645dce44676a09b52ad72c0dd36d883ed0ce2f559d803b2086043b55afd69",
    coinType:
      "0x71cf3273bd9f95c7e834841f43e5cc195f2369fd30c6b12f367692244fa5a650::ns::NS",
    votingTokenType:
      "0x71cf3273bd9f95c7e834841f43e5cc195f2369fd30c6b12f367692244fa5a650::ns::NS",
    faucet: "",
  },
  testnet: {
    votingPkgId:
      "0x2df7fb6fce94faeb1fb819d51f73fe4549e5d6f827828a641b2806a6dbf2d21b",
    governanceObjId:
      "0x059ba00a90537a197066fc092508f6ddfc3e754e7874763edff3b1d6e702f542",
    stakingConfigId: "",
    stakingStatsId: "",
    // DEMO Coin Type
    coinType:
      "0xe3c2291f345d6dd96855e0f9415e58fd981cf95fd18331f0fb899d91a8969293::ns::NS",
    votingTokenType:
      "0x2df7fb6fce94faeb1fb819d51f73fe4549e5d6f827828a641b2806a6dbf2d21b::token::TOKEN",
    faucet:
      "0xf6d7f2d00a2521f75fcbce03df5dd0d71887287a78296c3d786f36238122f8c9",
  },
  mainnet: {
    votingPkgId:
      "0xd43eeaa30cb62d94ecf7d2a2283913486bfd9288926f9f7ff237ac7a6cb44b41",
    governanceObjId:
      "0xbdaee786ef44ad0f0070829f11c884f1eff2941ebc4bc4e09f8d39544dcf2bdf",
    stakingConfigId: "",
    stakingStatsId: "",
    coinType:
      "0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS",
    // TODO-J: unify with coinType
    votingTokenType:
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
