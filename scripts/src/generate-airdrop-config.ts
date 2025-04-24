import { readFileSync } from "fs";
import type { ReturnTokenEvent } from "./find-voters";
import { getRandomAirdropConfig } from "./getRandomAirdropConfig";

type ProposalReward = {
  total_ns_voted: bigint
  total_ns_reward: bigint;
};

const PROPOSAL_REWARDS = new Map<string, ProposalReward>([
  ["2024-11-28", { total_ns_voted: 26_277_549_590_448n, total_ns_reward: 1_529_857_340_000n }],
  ["2024-12-21", { total_ns_voted: 31_595_015_428_494n, total_ns_reward: 1_839_435_830_000n }],
  ["2025-02-21", { total_ns_voted: 35_043_832_029_705n, total_ns_reward: 2_040_223_100_000n }],
]);

export type AirdropConfig = {
  recipient: string;
  airdrops: Airdrop[];
};

export type Airdrop = {
  amount_raw: string;
  start_ms: number;
  lock_months: number;
}

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
  // const airdrops = getRandomAirdropConfig(84533); // TODO: dev only
  console.log(JSON.stringify(airdrops, null, 2));
}

function generateAirdropConfig(events: ReturnTokenEvent[]): AirdropConfig[] {
  // first group votes by proposal date and voter
  const votesByProposalAndVoter = new Map<string, Map<string, bigint>>();

  // initialize maps for each proposal date
  for (const proposalDate of PROPOSAL_REWARDS.keys()) {
    votesByProposalAndVoter.set(proposalDate, new Map<string, bigint>());
  }

  // aggregate votes by proposal and voter
  for (const event of events) {
    const proposalDate = event.date.split("T")[0]!;
    const voterMap = votesByProposalAndVoter.get(proposalDate);
    if (!voterMap) {
      throw new Error(`No voter map found for proposal date: ${proposalDate}`);
    }

    const currentVotes = voterMap.get(event.voter_addr) || BigInt(0);
    voterMap.set(event.voter_addr, currentVotes + BigInt(event.amount_raw));
  }

  // track all unique voters and their airdrops
  const voterAirdrops = new Map<string, Airdrop[]>();

  // for each proposal
  for (const [proposalDate, voterVotes] of votesByProposalAndVoter.entries()) {
    const proposalReward = PROPOSAL_REWARDS.get(proposalDate);
    if (!proposalReward) {
      throw new Error(`No proposal reward found for proposal date: ${proposalDate}`);
    }

    // calculate each voter's share of this proposal's reward
    for (const [voter, votes] of voterVotes.entries()) {
      // calculate voter's percentage of total votes for this proposal
      const voterShare = (votes * BigInt(1_000_000_000)) / proposalReward.total_ns_voted;
      // calculate voter's reward for this proposal
      const voterReward = (proposalReward.total_ns_reward * voterShare) / BigInt(1_000_000_000);

      // create new airdrop for this proposal
      const airdrop: Airdrop = {
        amount_raw: voterReward.toString(),
        start_ms: new Date(proposalDate).getTime(),
        lock_months: 0,
      };

      // add to voter's airdrops
      if (!voterAirdrops.has(voter)) {
        voterAirdrops.set(voter, []);
      }
      voterAirdrops.get(voter)!.push(airdrop);
    }
  }

  // create final airdrop config
  const airdropConfig: AirdropConfig[] = [];

  for (const [voter, airdrops] of voterAirdrops.entries()) {
    airdropConfig.push({
      recipient: voter,
      airdrops,
    });
  }

  return airdropConfig;
}

main();
