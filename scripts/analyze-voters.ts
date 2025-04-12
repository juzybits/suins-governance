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

    analyzeTopVotes(events);
    analyze154Votes(events);
}

function analyzeTopVotes(events: ReturnTokenEvent[]) {
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

function analyze154Votes(events: ReturnTokenEvent[]) {
    const amount154raw = "154000000";
    const voters = new Set<string>();
    const votersByDate = new Map<string, Set<string>>();

    for (const event of events) {
        if (event.amount_raw !== amount154raw) {
            continue;
        }

        voters.add(event.voter_addr);

        const date = String(event.date.split("T")[0]);
        if (!votersByDate.has(date)) {
            votersByDate.set(date, new Set<string>());
        }
        votersByDate.get(date)!.add(event.voter_addr);

    }

    console.log("\n\nAddresses that voted with 154 NS:\n");
    console.log("Date".padEnd(12) + "Unique Voters".padStart(15));
    console.log("----".padEnd(12) + "-------------".padStart(15));

    for (const date of Array.from(votersByDate.keys())) {
        const voterSet = votersByDate.get(date)!;
        console.log(`${date.padEnd(12)}${voterSet.size.toString().padStart(15)}`);
    }

    console.log(`\nTotal unique voters using 154 NS: ${voters.size}`);
}

main();
