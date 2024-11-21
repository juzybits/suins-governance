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
  const bn = new BigNumber(balance.toString()).shiftedBy(-1 * decimals);

  if (format === CoinFormat.FULL) {
    return bn.toFormat();
  }

  return formatAmount(bn);
}
