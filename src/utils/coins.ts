import { NS_DECIMALS } from "@/constants/common";
import BigNumber from "bignumber.js";

export enum CoinFormat {
  ROUNDED = "ROUNDED",
  FULL = "FULL",
}

export function formatAmountParts(
  amount?: BigNumber | bigint | number | string | null,
) {
  if (typeof amount === "undefined" || amount === null) {
    return ["--"];
  }

  let postfix = "";
  let bn = new BigNumber(amount.toString());
  const bnAbs = bn.abs();

  // use absolute value to determine the postfix
  if (bnAbs.gte(1_000_000_000)) {
    bn = bn.shiftedBy(-9);
    postfix = "B";
  } else if (bnAbs.gte(1_000_000)) {
    bn = bn.shiftedBy(-6);
    postfix = "M";
  } else if (bnAbs.gte(10_000)) {
    bn = bn.shiftedBy(-3);
    postfix = "K";
  }

  if (bnAbs.gte(1)) {
    bn = bn.decimalPlaces(2, BigNumber.ROUND_DOWN);
  }

  return [bn.toFormat(), postfix];
}

export function formatAmount(...args: Parameters<typeof formatAmountParts>) {
  return formatAmountParts(...args)
    .filter(Boolean)
    .join("");
}

export function formatBalance({
  balance,
  decimals,
  format = CoinFormat.ROUNDED,
}: {
  balance: bigint | number | string;
  decimals: number;
  format?: CoinFormat;
}) {
  let bn = new BigNumber(balance.toString()).shiftedBy(-1 * decimals);

  if (format === CoinFormat.FULL) {
    const scaledBnAbs = new BigNumber(bn.abs());
    if (scaledBnAbs.gte(100)) {
      bn = bn.decimalPlaces(0, BigNumber.ROUND_DOWN);
    } else {
      bn = bn.decimalPlaces(2, BigNumber.ROUND_DOWN);
    }
    return bn.toFormat();
  }

  return formatAmount(bn);
}

export function formatNSBalance(
  balance: bigint | number | string,
  format: CoinFormat = CoinFormat.FULL,
) {
  return formatBalance({
    balance,
    decimals: NS_DECIMALS,
    format,
  });
}
