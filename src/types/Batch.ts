import { type z } from "zod";
import { type batchSchema } from "../schemas/batchSchema";

// === constants ===
// WARNING: these must be kept in sync with the StakingConfig Sui object.

const MAX_LOCK_MONTHS = 12;
const MONTHLY_BOOST_BPS = 11000n; // 1.1x or 10% boost (in basis points)
const MAX_BOOST_BPS = 30000n; // 3.0x for 12-month lock (in basis points)

const MONTH_MS = 2592000000; // 30 days in milliseconds
const DAY_MS = 86400000; // 1 day in milliseconds

export const MAX_LOCK_DURATION_DAYS = MAX_LOCK_MONTHS * 30;

// === types ===

export type BatchObjResp = z.infer<typeof batchSchema>;

export type Batch = BatchObjResp & {
  // Derived data
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
  // Human-readable dates
  startDate: Date;
  unlockDate: Date;
  cooldownEndDate: Date | null;
};

// === functions ===

export const enrichBatchObjResp = (
  obj: BatchObjResp,
  networkTime: number,
): Batch => {
  // Calculate derived data
  const balanceNS = BigInt(obj.content.fields.balance);
  const votingPower = batchHelpers.calculateVotingPower(obj, networkTime);
  const daysSinceStart = batchHelpers.getDaysSinceStart(obj, networkTime);
  const lockDurationDays = batchHelpers.getLockDurationDays(obj);
  const isLocked = batchHelpers.isLocked(obj, networkTime);
  const isStaked = !isLocked;
  const isCooldownRequested = batchHelpers.isCooldownRequested(obj);
  const isCooldownOver = batchHelpers.isCooldownOver(obj, networkTime);
  const isVoting = batchHelpers.isVoting(obj, networkTime);
  const canVote = batchHelpers.canVote(obj, networkTime);

  // Convert timestamps to Date objects
  const startDate = new Date(Number(obj.content.fields.start_ms));
  const unlockDate = new Date(Number(obj.content.fields.unlock_ms));
  const cooldownEndMs = Number(obj.content.fields.cooldown_end_ms);
  const cooldownEndDate = cooldownEndMs > 0 ? new Date(cooldownEndMs) : null;

  return {
    ...obj,
    balanceNS,
    votingPower,
    votingMultiplier: Number(votingPower) / Number(balanceNS),
    daysSinceStart,
    lockDurationDays,
    isLocked,
    isStaked,
    isCooldownRequested,
    isCooldownOver,
    isVoting,
    canVote,
    startDate,
    unlockDate,
    cooldownEndDate,
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
    return Math.round((networkTime - startMs) / DAY_MS);
  },

  getLockDurationDays: (obj: BatchObjResp): number => {
    const startMs = Number(obj.content.fields.start_ms);
    const unlockMs = Number(obj.content.fields.unlock_ms);
    return Math.round((unlockMs - startMs) / DAY_MS);
  },

  // Mirrors batch::power() in Move contract
  calculateVotingPower: (obj: BatchObjResp, networkTime: number): bigint => {
    const balance = BigInt(obj.content.fields.balance);
    const startMs = Number(obj.content.fields.start_ms);
    const unlockMs = Number(obj.content.fields.unlock_ms);

    // Calculate lock duration in months
    const lockMs = unlockMs - startMs;
    const lockMonths = Math.floor(lockMs / MONTH_MS);

    // Special case: locking for max months (12) gets the max boost (3x)
    if (lockMonths >= MAX_LOCK_MONTHS) {
      return (balance * MAX_BOOST_BPS) / 10000n;
    }

    // Calculate locked + staked months
    let totalMonths = lockMonths;

    // Add months from staking (if any)
    const now = networkTime;
    if (now > unlockMs) {
      const stakingMs = now - unlockMs;
      const stakingMonths = Math.floor(stakingMs / MONTH_MS);
      totalMonths += stakingMonths;
    }

    // e.g. if max_lock_months is 12, cap at 11 months (which gives 2.85x multiplier)
    const maxEffectiveMonths = MAX_LOCK_MONTHS - 1;
    if (totalMonths > maxEffectiveMonths) {
      totalMonths = maxEffectiveMonths;
    }

    // Apply multiplier: monthly_boost^total_months
    let power = balance;
    for (let i = 0; i < totalMonths; i++) {
      power = (power * MONTHLY_BOOST_BPS) / 10000n;
    }

    return power;
  },

  calculateLockedVotingPower: ({
    balance,
    lockMonths,
  }: {
    balance: bigint;
    lockMonths: number;
  }): bigint => {
    // Special case: locking for max months (12) gets the max boost (3x)
    if (lockMonths >= MAX_LOCK_MONTHS) {
      return (balance * MAX_BOOST_BPS) / 10000n;
    }
    // Apply multiplier: monthly_boost^total_months
    let power = balance;
    for (let i = 0; i < lockMonths; i++) {
      power = (power * MONTHLY_BOOST_BPS) / 10000n;
    }

    return power;
  },
};
