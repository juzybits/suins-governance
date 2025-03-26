import BigNumber from "bignumber.js";

export enum CoinFormat {
  ROUNDED = "ROUNDED",
  FULL = "FULL",
}

export const NS_DECIMALS = 6;

export function formatBalance(
  balance: bigint | number | string,
  decimals: number,
  format: CoinFormat = CoinFormat.ROUNDED,
) {
  const bn = new BigNumber(balance.toString()).shiftedBy(-1 * decimals);

  if (format === CoinFormat.FULL) {
    return bn.toFormat();
  }

  return formatAmount(bn);
}

export function formatNSBalance(
  balance: bigint | number | string,
  format: CoinFormat = CoinFormat.ROUNDED,
) {
  return formatBalance(balance, NS_DECIMALS, format);
}

export function formatNumber(number: number, suffix?: string) {
  const bigNumber = new BigNumber(number);
  let formattedNumber;

  if (bigNumber.isLessThan(1000)) {
    formattedNumber = bigNumber.toString();
  } else if (bigNumber.isLessThan(1000000)) {
    formattedNumber = bigNumber.div(1000).toFormat(0) + "K";
  } else {
    formattedNumber = bigNumber.div(1000000).toFormat(0) + "M";
  }

  if (suffix) {
    formattedNumber += suffix;
  }

  return formattedNumber;
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
    .join(" ");
}
