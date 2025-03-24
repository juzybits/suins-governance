import { z } from "zod";

export const stakingBatchSchema = z.object({
  objectId: z.string(),
  version: z.string(),
  digest: z.string(),
  type: z.string(),
  content: z.object({
    dataType: z.literal("moveObject"),
    type: z.string(),
    hasPublicTransfer: z.boolean(),
    fields: z.object({
      balance: z.string(),
      cooldown_end_ms: z.string(),
      id: z.object({
        id: z.string(),
      }),
      rewards: z.string(),
      start_ms: z.string(),
      unlock_ms: z.string(),
      voting_until_ms: z.string(),
    }),
  }),
});

export type StakingBatch = z.infer<typeof stakingBatchSchema>;

// Constants matching the Move contract
const MONTH_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
const MAX_LOCK_MONTHS = 12;
const MONTHLY_BOOST_BPS = 11000; // 1.1x or 10% boost (in basis points)
const MAX_BOOST_BPS = 30000;     // 3.0x for 12-month lock (in basis points)

// Helper functions to work with the schema data
export const stakingBatchHelpers = {
  isInCooldown: (batch: StakingBatch): boolean => {
    const cooldownEndMs = Number(batch.content.fields.cooldown_end_ms);
    return cooldownEndMs > 0 && cooldownEndMs > Date.now();
  },

  isVoting: (batch: StakingBatch): boolean => {
    const votingUntilMs = Number(batch.content.fields.voting_until_ms);
    return votingUntilMs > 0 && votingUntilMs > Date.now();
  },

  isLocked: (batch: StakingBatch): boolean => {
    const unlockMs = Number(batch.content.fields.unlock_ms);
    return unlockMs > Date.now();
  },

  getAmountInNS: (batch: StakingBatch): number => {
    return Number(batch.content.fields.balance) / 1_000_000;
  },

  getLockDurationDays: (batch: StakingBatch): number => {
    const startMs = Number(batch.content.fields.start_ms);
    const unlockMs = Number(batch.content.fields.unlock_ms);
    return Math.round((unlockMs - startMs) / (1000 * 60 * 60 * 24));
  },

  // Mirrors batch::power() in Move contract
  calculateVotingPower: (batch: StakingBatch): number => {
    const balance = Number(batch.content.fields.balance);
    const startMs = Number(batch.content.fields.start_ms);
    const unlockMs = Number(batch.content.fields.unlock_ms);

    // Calculate lock duration in months
    const lockMs = unlockMs - startMs;
    const lockMonths = Math.floor(lockMs / MONTH_MS);

    // Special case: locking for max months (12) gets the max boost (3x)
    if (lockMonths >= MAX_LOCK_MONTHS) {
      return (balance * MAX_BOOST_BPS) / 10000 / 1_000_000;
    }

    // Calculate total effective months (locked + staked)
    let totalMonths = lockMonths;

    // Add months from staking (if any)
    const now = Date.now();
    if (now > unlockMs) {
      const stakingMs = now - unlockMs;
      const stakingMonths = Math.floor(stakingMs / MONTH_MS);
      totalMonths += stakingMonths;
    }

    // Cap at max effective months (MAX_LOCK_MONTHS - 1 = 11 months)
    const maxEffectiveMonths = MAX_LOCK_MONTHS - 1;
    if (totalMonths > maxEffectiveMonths) {
      totalMonths = maxEffectiveMonths;
    }

    // Apply multiplier: 1.1^total_months
    let power = balance;
    for (let i = 0; i < totalMonths; i++) {
      power = (power * MONTHLY_BOOST_BPS) / 10000;
    }

    return Math.floor(power / 1_000_000); // Convert to NS units
  }
};
