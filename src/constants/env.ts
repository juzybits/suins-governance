import { env } from "../env.js";

export const NETWORK =
  env.NEXT_PUBLIC_VITE_NETWORK === "localnet" ? "localnet" :
  env.NEXT_PUBLIC_VITE_NETWORK === "testnet" ? "testnet"
  : "mainnet";

export const PACKAGE_NAME = "sui-ns-claim";
