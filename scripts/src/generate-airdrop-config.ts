import { readFileSync } from "fs";
import type { ReturnTokenEvent } from "./find-voters";
import { getRandomAirdropConfig } from "./getRandomAirdropConfig";

export type AirdropConfig = {
  recipient: string;
  amount_raw: string;
  start_ms: string;
  unlock_ms: string;
};

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

  // const airdrops = generateAirdropConfig(events);
  const airdrops = getRandomAirdropConfig(84533); // TODO: dev only
  console.log(JSON.stringify(airdrops, null, 2));
}

function generateAirdropConfig(events: ReturnTokenEvent[]): AirdropConfig[] {
  // TODO
  // Calculate how much NS each voter_addr voted with in total
  const voterTotals = new Map<string, bigint>();

  for (const event of events) {
    const { voter_addr, amount_raw } = event;
    const currentTotal = voterTotals.get(voter_addr) || BigInt(0);
    const amount = BigInt(amount_raw);
    voterTotals.set(voter_addr, currentTotal + amount);
  }

  // Calculate 1% of each voter's total and create airdrop config
  const airdropConfig: AirdropConfig[] = [];
  const start_ms = Date.now().toString(); // TODO: tbd
  const unlock_ms = start_ms; // staked, not locked

  for (const [voter, totalAmount] of voterTotals.entries()) {
    const airdropAmount = totalAmount / BigInt(100);
    if (airdropAmount > BigInt(0)) {
      airdropConfig.push({
        recipient: voter,
        amount_raw: airdropAmount.toString(),
        start_ms,
        unlock_ms,
      });
    }
  }

  airdropConfig.sort((a, b) =>
    BigInt(b.amount_raw) > BigInt(a.amount_raw) ? 1 : -1,
  );

  return airdropConfig;
}

main();
