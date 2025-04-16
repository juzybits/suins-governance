import { NS_DECIMALS } from "@/constants/common";
import BigNumber from "bignumber.js";

export function parseAmount(amount: string | number, decimals: number) {
  try {
    amount = typeof amount === "string" ? amount.replaceAll(",", "") : amount;
    return BigInt(
      new BigNumber(amount).shiftedBy(decimals).integerValue().toString(),
    );
  } catch {
    return 0n;
  }
}

export function parseNSAmount(amount: string | number) {
  return parseAmount(amount, NS_DECIMALS);
}
