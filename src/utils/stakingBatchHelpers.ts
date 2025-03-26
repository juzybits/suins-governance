import { StakingBatchRaw } from "@/schemas/stakingBatchSchema";

// WARNING: these constants must be kept in sync with the StakingConfig Sui object.

const MAX_LOCK_MONTHS = 12;
const MONTHLY_BOOST_BPS = 11000n; // 1.1x or 10% boost (in basis points)
const MAX_BOOST_BPS = 30000n;     // 3.0x for 12-month lock (in basis points)
const MONTH_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const stakingBatchHelpers = {

  isLocked: (batch: StakingBatchRaw): boolean => {
    const unlockMs = Number(batch.content.fields.unlock_ms);
    return unlockMs > Date.now();
  },

  isCooldownRequested: (batch: StakingBatchRaw): boolean => {
    const cooldownEndMs = Number(batch.content.fields.cooldown_end_ms);
    return cooldownEndMs > 0;
  },

  isCooldownOver: (batch: StakingBatchRaw): boolean => {
    const cooldownEndMs = Number(batch.content.fields.cooldown_end_ms);
    return stakingBatchHelpers.isCooldownRequested(batch) && Date.now() >= cooldownEndMs;
  },

  isVoting: (batch: StakingBatchRaw): boolean => {
    const votingUntilMs = Number(batch.content.fields.voting_until_ms);
    return votingUntilMs > 0 && votingUntilMs > Date.now();
  },

  getLockDurationDays: (batch: StakingBatchRaw): number => {
    const startMs = Number(batch.content.fields.start_ms);
    const unlockMs = Number(batch.content.fields.unlock_ms);
    return Math.round((unlockMs - startMs) / (1000 * 60 * 60 * 24));
  },

  // Mirrors batch::power() in Move contract
  calculateVotingPower: (batch: StakingBatchRaw): bigint => {
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
    const now = Date.now();
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
