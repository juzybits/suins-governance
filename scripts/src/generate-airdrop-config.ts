/**
 * Generate airdrop config from voter data and predefined rewards.
 */

import { readFileSync } from "fs";
import type { ReturnTokenEvent } from "./fetch-events";

/**
 * 0.1 NS, as defined in
 * suins-contracts/packages/voting/sources/staking/config.move
 */
export const MIN_BALANCE_RAW = 100_000n;

export type AirdropConfig = {
  recipient: string;
  amount_raw: string;
  start_ms: number;
  lock_months: number;
};

type ProposalReward = {
  total_ns_voted: bigint;
  total_ns_reward: bigint;
};

const PROPOSAL_REWARDS = new Map<string, ProposalReward>([
  [
    "2024-11-28",
    {
      total_ns_voted: 26_277_549_590_448n,
      total_ns_reward: 1_529_857_340_000n,
    },
  ],
  [
    "2024-12-21",
    {
      total_ns_voted: 31_595_015_428_494n,
      total_ns_reward: 1_839_435_830_000n,
    },
  ],
  [
    "2025-02-21",
    {
      total_ns_voted: 35_043_832_029_705n,
      total_ns_reward: 2_040_223_100_000n,
    },
  ],
  [
    "2025-04-27",
    {
      total_ns_voted: 25_204_857_872_530n,
      total_ns_reward: 1_222_333_444_555n, // TODO
    },
  ],
]);

function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Error: provide a JSON file path as an argument.");
    process.exit(1);
  }

  const data = readFileSync(filePath, "utf8");
  const events: ReturnTokenEvent[] = JSON.parse(data);

  if (!events || !Array.isArray(events) || events.length === 0) {
    throw new Error("No valid voter data found in the file.");
  }

  const airdrops = generateAirdropConfig(events);
  console.log(JSON.stringify(airdrops, null, 2));
}

function generateAirdropConfig(events: ReturnTokenEvent[]): AirdropConfig[] {
  const airdrops: AirdropConfig[] = [];

  for (const event of events) {
    const date = event.date.split("T")[0]!;
    const proposal = PROPOSAL_REWARDS.get(date);
    if (!proposal) {
      throw new Error(`No proposal reward found for proposal date: ${date}`);
    }

    const userVotes = BigInt(event.amount_raw);
    const userShare =
      (userVotes * BigInt(1_000_000_000)) / proposal.total_ns_voted;
    const userReward =
      (proposal.total_ns_reward * userShare) / BigInt(1_000_000_000);

    if (userReward < MIN_BALANCE_RAW) {
      continue;
    }

    airdrops.push({
      recipient: event.voter_addr,
      amount_raw: userReward.toString(),
      start_ms: new Date(date).getTime(),
      lock_months: 0,
    });
  }

  return airdrops;
}

main();
