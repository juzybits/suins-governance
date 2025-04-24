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
  const airdropAmounts = new Map<string, bigint>();  // date -> amount

  for (const config of configs) {
    totalAirdrops += config.airdrops.length;

    // calculate total reward for this recipient
    for (const airdrop of config.airdrops) {
      const amount = BigInt(airdrop.amount_raw);
      totalAmount += amount;

      // group by start_ms to track amounts per proposal
      const date = new Date(airdrop.start_ms).toISOString().split("T")[0]!;
      airdropAmounts.set(date, (airdropAmounts.get(date) || BigInt(0)) + amount);
    }
  }

  // output results
  console.log("\nAirdrop Distribution Analysis\n");
  console.log(`Total recipients:          ${totalRecipients.toLocaleString()}`);
  console.log(`Total airdrops:           ${totalAirdrops.toLocaleString()}`);
  console.log(`Total NS to distribute:    ${formatNSBalance(totalAmount)} (raw: ${totalAmount.toLocaleString()})`);

  console.log("\nAmount distributed per proposal:");
  console.log("Date                Amount");
  console.log("----                ------");
  for (const [date, amount] of Array.from(airdropAmounts.entries()).sort()) {
    console.log(
      `${date.padEnd(20)}${formatNSBalance(amount).padStart(10)}`
    );
  }
}

main();
