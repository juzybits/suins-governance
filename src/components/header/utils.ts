import { CLAIM_AEON_URL, CLAIM_NS_URL, CONSTITUTION_URL, TOKENOMICS_URL } from "@/constants/urls";

export const MENU_NAVS = [
  {
      title: "Claim Your $NS",
      mobileTitle: "NS Claim",
      href: CLAIM_NS_URL,
  },
  {
      title: "SuiNS Governance Voting",
      mobileTitle: "Governance",
      href: "vote",
  },
  {
      title: "SuiNS Constitution",
      mobileTitle: "Constitution",
      href: CONSTITUTION_URL,
  },
  {
      title: "SuiNS Staking",
      mobileTitle: "Staking",
      href: "stake",
  },
  {
      title: "$NS Tokenomics",
      mobileTitle: "Tokenomics",
      href: TOKENOMICS_URL,
  },
  {
      title: "Claim Aeon NFT",
      mobileTitle: "Aeon NFT",
      href: CLAIM_AEON_URL,
  },
];
