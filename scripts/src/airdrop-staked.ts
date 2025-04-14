import { readFileSync } from "fs";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { getActiveEnv, getActiveKeypair } from "@polymedia/suitcase-node";
import { CoinFormat, formatBalance, NS_DECIMALS } from "../../src/utils/formatNumber";
import type { AirdropConfig } from "./generate-airdrop-config";
import { promptUser } from "./utils";
import { getRandomAirdropConfig } from "./getRandomAirdropConfig";

async function main() {
    // const filePath = process.argv[2];

    // if (!filePath) {
    //     console.error("Error: provide a JSON file path as an argument.");
    //     process.exit(1);
    // }

    // const data = readFileSync(filePath, "utf8");
    // const airdrops: AirdropConfig[] = JSON.parse(data);

    // if (!airdrops || !Array.isArray(airdrops) || airdrops.length === 0) {
    //     throw new Error("No valid voter data found in the file.");
    // }

    const airdrops: AirdropConfig[] = getRandomAirdropConfig(84533);

    const proceed = await showSummaryAndConfirm(airdrops);
    if (!proceed) {
        console.log("Aborting.");
        process.exit(0);
    }

    await executeAirdrop(airdrops);
}

async function showSummaryAndConfirm(
    airdrops: AirdropConfig[],
): Promise<boolean> {
    let totalAmount = 0n;
    let totalRecipients = 0;
    airdrops.forEach((airdrop) => {
        totalAmount += BigInt(airdrop.amount_raw);
        totalRecipients++;
    });
    console.log(`Total amount: ${formatBalance(totalAmount, NS_DECIMALS, CoinFormat.FULL)}`);
    console.log(`Total recipients: ${totalRecipients}`);

    return await promptUser();
}

async function executeAirdrop(airdrops: AirdropConfig[]) { // TODO: discuss security implications

    console.log("Proceeding...");

    const [network, signer] = await Promise.all([
        getActiveEnv(),
        getActiveKeypair(),
    ]);
    const client = new SuiClient({ url: getFullnodeUrl(network) });

    console.log(airdrops.slice(0, 5));
}

main().catch(error => {
    throw error;
});
