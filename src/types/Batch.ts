import { type z } from "zod";
import { type batchSchema } from "../schemas/batchSchema";
import { DAY_MS, MONTH_MS } from "@/constants/common";

// === constants ===
// WARNING: these must be kept in sync with the StakingConfig Sui object.

const MAX_LOCK_MONTHS = 12;
const MONTHLY_BOOST_BPS = 110_00n; // 1.1x or 10% boost (in basis points)
const MAX_BOOST_BPS = 300_00n; // 3.0x for 12-month lock (in basis points)

export const MAX_LOCK_DURATION_DAYS = MAX_LOCK_MONTHS * 30;
export const VALID_MONTHS = [1, 2, 6, 12];

// === types ===

export type BatchObjResp = z.infer<typeof batchSchema>;

export type Batch = BatchObjResp & {
  balanceNS: bigint;
  votingPower: bigint;
  votingMultiplier: number;
  daysSinceStart: number;
  lockDurationDays: number;
  isLocked: boolean;
  isStaked: boolean;
  isCooldownRequested: boolean;
  isCooldownOver: boolean;
  isVoting: boolean;
  canVote: boolean;
  startDate: Date;
  unlockDate: Date;
  cooldownEndDate: Date | null;
  networkTime: number;
};

// === functions ===

export const enrichBatchObjResp = (
  obj: BatchObjResp,
  networkTime: number,
): Batch => {
  const balanceNS = BigInt(obj.content.fields.balance);
  const votingPower = batchHelpers.calculateBatchVotingPower(obj, networkTime);
  const isLocked = batchHelpers.isLocked(obj, networkTime);
  const isStaked = !isLocked;
  const cooldownEndMs = Number(obj.content.fields.cooldown_end_ms);

  return {
    ...obj,
    balanceNS,
    votingPower,
    votingMultiplier: Number(votingPower) / Number(balanceNS),
    daysSinceStart: batchHelpers.getDaysSinceStart(obj, networkTime),
    lockDurationDays: batchHelpers.getLockDurationDays(obj),
    isLocked,
    isStaked,
    isCooldownRequested: batchHelpers.isCooldownRequested(obj),
    isCooldownOver: batchHelpers.isCooldownOver(obj, networkTime),
    isVoting: batchHelpers.isVoting(obj, networkTime),
    canVote: batchHelpers.canVote(obj, networkTime),
    startDate: new Date(Number(obj.content.fields.start_ms)),
    unlockDate: new Date(Number(obj.content.fields.unlock_ms)),
    cooldownEndDate: cooldownEndMs > 0 ? new Date(cooldownEndMs) : null,
    networkTime,
  };
};

export const batchHelpers = {
  isLocked: (obj: BatchObjResp, networkTime: number): boolean => {
    const unlockMs = Number(obj.content.fields.unlock_ms);
    return unlockMs > networkTime;
  },

  isCooldownRequested: (obj: BatchObjResp): boolean => {
    const cooldownEndMs = Number(obj.content.fields.cooldown_end_ms);
    return cooldownEndMs > 0;
  },

  isCooldownOver: (obj: BatchObjResp, networkTime: number): boolean => {
    const cooldownEndMs = Number(obj.content.fields.cooldown_end_ms);
    return (
      batchHelpers.isCooldownRequested(obj) && networkTime >= cooldownEndMs
    );
  },

  canVote: (obj: BatchObjResp, networkTime: number): boolean => {
    return (
      !batchHelpers.isVoting(obj, networkTime) &&
      !batchHelpers.isCooldownRequested(obj)
    );
  },

  isVoting: (obj: BatchObjResp, networkTime: number): boolean => {
    const votingUntilMs = Number(obj.content.fields.voting_until_ms);
    return votingUntilMs > 0 && votingUntilMs > networkTime;
  },

  getDaysSinceStart: (obj: BatchObjResp, networkTime: number): number => {
    const startMs = Number(obj.content.fields.start_ms);
    return (networkTime - startMs) / DAY_MS;
  },

  getLockDurationDays: (obj: BatchObjResp): number => {
    const startMs = Number(obj.content.fields.start_ms);
    const unlockMs = Number(obj.content.fields.unlock_ms);
    return (unlockMs - startMs) / DAY_MS;
  },

  /**
   * Mirrors batch::power() in Sui contract
   */
  calculateBatchVotingPower: (
    obj: BatchObjResp,
    networkTime: number,
  ): bigint => {
    let power = BigInt(obj.content.fields.balance); // base power is the NS balance
    let months: number; // how many monthly boosts to apply

    if (batchHelpers.isLocked(obj, networkTime)) {
      const lockMs =
        Number(obj.content.fields.unlock_ms) -
        Number(obj.content.fields.start_ms);
      months = Math.floor(lockMs / MONTH_MS);
      // Locking for max months gets a higher multiplier
      if (months >= MAX_LOCK_MONTHS) {
        return (power * MAX_BOOST_BPS) / 100_00n;
      }
    } else {
      const stakeMs = networkTime - Number(obj.content.fields.start_ms);
      months = Math.floor(stakeMs / MONTH_MS);
      // Staking max boost is capped at max_months - 1
      if (months >= MAX_LOCK_MONTHS) {
        months = MAX_LOCK_MONTHS - 1;
      }
    }

    // Apply multiplier: monthly_boost^months
    for (let i = 0; i < months; i++) {
      power = (power * MONTHLY_BOOST_BPS) / 100_00n;
    }

    return power;
  },

  /**
   * Used to preview voting power in the app (e.g. when staking/locking a new batch)
   */
  calculateBalanceVotingPower: ({
    balance,
    months,
    mode,
  }: {
    balance: bigint;
    months: number;
    mode: "stake" | "lock";
  }): bigint => {
    // Special case: locking for max months gets a higher multiplier
    if (mode === "lock" && months >= MAX_LOCK_MONTHS) {
      return (balance * MAX_BOOST_BPS) / 100_00n;
    }

    if (months >= MAX_LOCK_MONTHS) {
      months = MAX_LOCK_MONTHS - 1; // 0th month doesn't multiply
    }

    // Apply multiplier: monthly_boost^months
    let power = balance;
    for (let i = 0; i < months; i++) {
      power = (power * MONTHLY_BOOST_BPS) / 100_00n;
    }

    return power;
  },
};
