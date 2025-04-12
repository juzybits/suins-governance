/**
 * Analyze the output of `find-voters.ts`
 */

import { readFileSync } from "fs";
import type { ReturnTokenEvent } from "./find-voters";
import { CoinFormat, formatBalance } from "../src/utils/formatNumber";

function main() {
    const filePath = process.argv[2];

    if (!filePath) {
        console.error("Error: provide a JSON file path as an argument.");
        console.log("Usage: bun analyze-voters.ts <json_file_path>");
        process.exit(1);
    }

    const data = readFileSync(filePath, "utf8");
    const events: ReturnTokenEvent[] = JSON.parse(data);

    if (!events || !Array.isArray(events) || events.length === 0) {
        throw new Error("No valid voter data found in the file.");
    }


    analyze(events);
}

function analyze(events: ReturnTokenEvent[]) {
    const uniqVoters = new Set<string>();
    const commonAmounts = new Map<string, number>();

    for (const event of events) {
        const { amount_raw, voter_addr } = event;
        commonAmounts.set(amount_raw, (commonAmounts.get(amount_raw) || 0) + 1);
        uniqVoters.add(voter_addr);
    }

    // sort by frequency, highest first
    const sortedAmounts = Array.from(commonAmounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 25);

    console.log("\nMost common NS amounts:\n");
    console.log("Amount".padStart(6) + "Occurrences".padStart(15) + "% of Total".padStart(15));
    console.log("------".padStart(6) + "-----------".padStart(15) + "----------".padStart(15));

    for (const [amount, count] of sortedAmounts) {
        const percentage = ((count / events.length) * 100).toFixed(2);
        console.log(
            `${formatBalance(amount, 6, CoinFormat.FULL).padStart(6)}` +
            `${count.toString().padStart(15)}` +
            `${percentage.toString().padStart(14)}%`
        );
    }

    console.log(`\nTotal votes: ${events.length}`);
    console.log(`Unique voters: ${uniqVoters.size}`);
    console.log(`Unique amounts: ${commonAmounts.size}`);
}

main();
