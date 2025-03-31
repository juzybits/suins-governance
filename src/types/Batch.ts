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

export type BatchRaw = z.infer<typeof batchSchema>;

export type Batch = BatchRaw & {
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

export const enrichRawBatch = (raw: BatchRaw): Batch => {
  // Calculate derived data
  const chainTime = Date.now(); // TODO-J
  const balanceNS = BigInt(raw.content.fields.balance);
  const votingPower = batchHelpers.calculateVotingPower(raw, chainTime);
  const daysSinceStart = batchHelpers.getDaysSinceStart(raw, chainTime);
  const lockDurationDays = batchHelpers.getLockDurationDays(raw);
  const isLocked = batchHelpers.isLocked(raw, chainTime);
  const isStaked = !isLocked;
  const isCooldownRequested = batchHelpers.isCooldownRequested(raw);
  const isCooldownOver = batchHelpers.isCooldownOver(raw, chainTime);
  const isVoting = batchHelpers.isVoting(raw, chainTime);
  const canVote = batchHelpers.canVote(raw, chainTime);

  // Convert timestamps to Date objects
  const startDate = new Date(Number(raw.content.fields.start_ms));
  const unlockDate = new Date(Number(raw.content.fields.unlock_ms));
  const cooldownEndMs = Number(raw.content.fields.cooldown_end_ms);
  const cooldownEndDate = cooldownEndMs > 0 ? new Date(cooldownEndMs) : null;

  return {
    ...raw,
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
  isLocked: (batch: BatchRaw, chainTime: number): boolean => {
    const unlockMs = Number(batch.content.fields.unlock_ms);
    return unlockMs > chainTime;
  },

  isCooldownRequested: (batch: BatchRaw): boolean => {
    const cooldownEndMs = Number(batch.content.fields.cooldown_end_ms);
    return cooldownEndMs > 0;
  },

  isCooldownOver: (batch: BatchRaw, chainTime: number): boolean => {
    const cooldownEndMs = Number(batch.content.fields.cooldown_end_ms);
    return (
      batchHelpers.isCooldownRequested(batch) &&
      chainTime >= cooldownEndMs
    );
  },

  canVote: (batch: BatchRaw, chainTime: number): boolean => {
    return (
      !batchHelpers.isVoting(batch, chainTime) &&
      !batchHelpers.isCooldownRequested(batch)
    );
  },

  isVoting: (batch: BatchRaw, chainTime: number): boolean => {
    const votingUntilMs = Number(batch.content.fields.voting_until_ms);
    return votingUntilMs > 0 && votingUntilMs > chainTime;
  },

  getDaysSinceStart: (batch: BatchRaw, chainTime: number): number => {
    const startMs = Number(batch.content.fields.start_ms);
    return Math.round((chainTime - startMs) / DAY_MS);
  },

  getLockDurationDays: (batch: BatchRaw): number => {
    const startMs = Number(batch.content.fields.start_ms);
    const unlockMs = Number(batch.content.fields.unlock_ms);
    return Math.round((unlockMs - startMs) / DAY_MS);
  },

  // Mirrors batch::power() in Move contract
  calculateVotingPower: (batch: BatchRaw, chainTime: number): bigint => {
    const balance = BigInt(batch.content.fields.balance);
    const startMs = Number(batch.content.fields.start_ms);
    const unlockMs = Number(batch.content.fields.unlock_ms);

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
    const now = chainTime;
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
