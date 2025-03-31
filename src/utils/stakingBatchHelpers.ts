import { type StakingBatchRaw } from "@/schemas/stakingBatchSchema";

// WARNING: these constants must be kept in sync with the StakingConfig Sui object.

const MAX_LOCK_MONTHS = 12;
const MONTHLY_BOOST_BPS = 11000n; // 1.1x or 10% boost (in basis points)
const MAX_BOOST_BPS = 30000n; // 3.0x for 12-month lock (in basis points)

const MONTH_MS = 2592000000; // 30 days in milliseconds
const DAY_MS = 86400000; // 1 day in milliseconds

export const MAX_LOCK_DURATION_DAYS = MAX_LOCK_MONTHS * 30;

export const stakingBatchHelpers = {
  isLocked: (batch: StakingBatchRaw, chainTime: number): boolean => {
    const unlockMs = Number(batch.content.fields.unlock_ms);
    return unlockMs > chainTime;
  },

  isCooldownRequested: (batch: StakingBatchRaw): boolean => {
    const cooldownEndMs = Number(batch.content.fields.cooldown_end_ms);
    return cooldownEndMs > 0;
  },

  isCooldownOver: (batch: StakingBatchRaw, chainTime: number): boolean => {
    const cooldownEndMs = Number(batch.content.fields.cooldown_end_ms);
    return (
      stakingBatchHelpers.isCooldownRequested(batch) &&
      chainTime >= cooldownEndMs
    );
  },

  canVote: (batch: StakingBatchRaw, chainTime: number): boolean => {
    return (
      !stakingBatchHelpers.isVoting(batch, chainTime) &&
      !stakingBatchHelpers.isCooldownRequested(batch)
    );
  },

  isVoting: (batch: StakingBatchRaw, chainTime: number): boolean => {
    const votingUntilMs = Number(batch.content.fields.voting_until_ms);
    return votingUntilMs > 0 && votingUntilMs > chainTime;
  },

  getDaysSinceStart: (batch: StakingBatchRaw, chainTime: number): number => {
    const startMs = Number(batch.content.fields.start_ms);
    return Math.round((chainTime - startMs) / DAY_MS);
  },

  getLockDurationDays: (batch: StakingBatchRaw): number => {
    const startMs = Number(batch.content.fields.start_ms);
    const unlockMs = Number(batch.content.fields.unlock_ms);
    return Math.round((unlockMs - startMs) / DAY_MS);
  },

  // Mirrors batch::power() in Move contract
  calculateVotingPower: (batch: StakingBatchRaw, chainTime: number): bigint => {
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
