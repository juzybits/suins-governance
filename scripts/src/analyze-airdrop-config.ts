/**
 * Analyze the output of `generate-airdrop-config.ts`.
 */

import { readFileSync } from "fs";
import type { AirdropConfig } from "./generate-airdrop-config";
import { formatNSBalance } from "../../src/utils/formatNumber";

function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Error: provide a JSON file path as an argument.");
    process.exit(1);
  }

  const data = readFileSync(filePath, "utf8");
  const configs: AirdropConfig[] = JSON.parse(data);

  if (!configs || !Array.isArray(configs) || configs.length === 0) {
    throw new Error("No valid airdrop config found in the file.");
  }

  analyzeAirdropDistribution(configs);
}

function analyzeAirdropDistribution(configs: AirdropConfig[]) {
  // general stats
  const totalRecipients = configs.length;
  let totalAirdrops = 0;
  let totalAmount = BigInt(0);
  const airdropAmounts = new Map<string, bigint>(); // date -> amount

  // reward range tracking (in raw units)
  const ranges = new Map([
    ["0-0.1", { min: 0n, max: 100_000n, count: 0 }],
    ["0.1-0.5", { min: 100_000n, max: 500_000n, count: 0 }],
    ["0.5-1", { min: 500_000n, max: 1_000_000n, count: 0 }],
    ["1-2", { min: 1_000_000n, max: 2_000_000n, count: 0 }],
    ["2-5", { min: 2_000_000n, max: 5_000_000n, count: 0 }],
    ["5-10", { min: 5_000_000n, max: 10_000_000n, count: 0 }],
    ["10-25", { min: 10_000_000n, max: 25_000_000n, count: 0 }],
    ["25-50", { min: 25_000_000n, max: 50_000_000n, count: 0 }],
    ["50-100", { min: 50_000_000n, max: 100_000_000n, count: 0 }],
    ["100-250", { min: 100_000_000n, max: 250_000_000n, count: 0 }],
    ["250-500", { min: 250_000_000n, max: 500_000_000n, count: 0 }],
    ["500-1k", { min: 500_000_000n, max: 1_000_000_000n, count: 0 }],
    ["1k-10k", { min: 1_000_000_000n, max: 10_000_000_000n, count: 0 }],
    [
      "10k+",
      { min: 10_000_000_000n, max: BigInt(Number.MAX_SAFE_INTEGER), count: 0 },
    ],
  ]);

  for (const config of configs) {
    totalAirdrops += config.airdrops.length;

    // calculate total reward for this recipient
    for (const airdrop of config.airdrops) {
      const amount = BigInt(airdrop.amount_raw);
      totalAmount += amount;

      // track reward range
      for (const range of ranges.values()) {
        if (amount >= range.min && amount < range.max) {
          range.count++;
          break;
        }
      }

      // group by start_ms to track amounts per proposal
      const date = new Date(airdrop.start_ms).toISOString().split("T")[0]!;
      airdropAmounts.set(
        date,
        (airdropAmounts.get(date) || BigInt(0)) + amount,
      );
    }
  }

  // output results
  console.log("\n### Airdrop summary ###\n");
  console.log(`Total recipients:          ${totalRecipients.toLocaleString()}`);
  console.log(`Total airdrops:           ${totalAirdrops.toLocaleString()}`);
  console.log(
    `Total NS to distribute:    ${formatNSBalance(totalAmount)} (raw: ${totalAmount.toLocaleString()})`,
  );

  console.log("\n### Airdrop size distribution (in NS) ###\n");
  console.log(
    "NS reward".padEnd(10) +
      "Batches".padStart(10) +
      "% of Total".padStart(15) +
      "\n",
  );
  for (const [range, data] of ranges) {
    const percentage = ((data.count / totalAirdrops) * 100).toFixed(2);
    console.log(
      `${range.padEnd(10)}` +
        `${data.count.toString().padStart(10)}` +
        `${percentage.padStart(14)}%`,
    );
  }

  console.log("\n### NS distributed per proposal ###\n");
  console.log("Date".padEnd(20) + "Amount".padStart(10) + "\n");
  for (const [date, amount] of Array.from(airdropAmounts.entries()).sort()) {
    console.log(`${date.padEnd(20)}${formatNSBalance(amount).padStart(10)}`);
  }
}

main();
