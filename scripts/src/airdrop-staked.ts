import { readFileSync } from "fs";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { getActiveEnv, getActiveKeypair, signAndExecuteTx } from "@polymedia/suitcase-node";
import { chunkArray } from "@polymedia/suitcase-core";
import { CoinFormat, formatBalance, NS_DECIMALS } from "../../src/utils/formatNumber";
import type { AirdropConfig } from "./generate-airdrop-config";
import { promptUser } from "./utils";
import { getRandomAirdropConfig } from "./getRandomAirdropConfig";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { SUINS_PACKAGES } from "../../src/constants/endpoints";

const AIRDROPS_PER_TX = 100;

async function main() {
    // const airdrops = readAirdropConfigFromFile();
    // const airdrops = getRandomAirdropConfig(84533);
    const airdrops = getRandomAirdropConfig(845);

    const proceed = await showSummaryAndConfirm(airdrops);
    if (!proceed) {
        console.log("Aborting.");
        process.exit(0);
    }

    await executeAirdrop(airdrops);
}

async function executeAirdrop(airdrops: AirdropConfig[]) {
    console.log("Proceeding...");

    const [network, signer] = await Promise.all([
        getActiveEnv(),
        getActiveKeypair(),
    ]);

    const networkConf = SUINS_PACKAGES.localnet; // TODO

    const client = new SuiClient({ url: getFullnodeUrl(network) });
    const stakingAdminCapId = await getStakingAdminCapId({ // TODO: discuss security implications
        client,
        packageId: networkConf.votingPkgId,
        owner: signer.toSuiAddress(),
    });
    if (!stakingAdminCapId) {
        throw new Error(`Staking admin cap not found for owner: ${signer.toSuiAddress()}`);
    }

    const dropsPerTx = chunkArray(airdrops, AIRDROPS_PER_TX);

    let dropNumber = 0;
    for (const txDrops of dropsPerTx) {
        console.log(`Processing drop ${dropNumber} of ${dropsPerTx.length}`);
        dropNumber++;

        const tx = new Transaction();
        tx.setSender(signer.toSuiAddress());
        for (const drop of txDrops) {
            const payCoin = coinWithBalance({
                type: networkConf.coinType,
                balance: BigInt(drop.amount_raw),
            });
            const batch = tx.moveCall({
                target: `${networkConf.votingPkgId}::staking_batch::admin_new`,
                typeArguments: [],
                arguments: [
                    tx.object(stakingAdminCapId),
                    tx.object(networkConf.stakingStatsId),
                    payCoin,
                    tx.pure.u64(drop.start_ms),
                    tx.pure.u64(drop.unlock_ms),
                ],
            });
            tx.moveCall({
                target: `${networkConf.votingPkgId}::staking_batch::admin_transfer`,
                typeArguments: [],
                arguments: [
                    tx.object(stakingAdminCapId),
                    batch,
                    tx.pure.address(drop.recipient),
                ],
            });
        }
        const resp = await signAndExecuteTx({ client, tx, signer });
        if (resp.effects?.status.status !== "success") {
            throw new Error(`Transaction status was '${resp.effects?.status.status}': ${resp.digest}. Response: ${JSON.stringify(resp, null, 2)}`);
        }
    }
}

// === utils ===

function readAirdropConfigFromFile(): AirdropConfig[] {
    const filePath = process.argv[2];

    if (!filePath) {
        console.error("Error: provide a JSON file path as an argument.");
        process.exit(1);
    }

    const data = readFileSync(filePath, "utf8");
    const airdrops: AirdropConfig[] = JSON.parse(data);

    if (!airdrops || !Array.isArray(airdrops) || airdrops.length === 0) {
        throw new Error("No valid voter data found in the file.");
    }

    return airdrops;
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

async function getStakingAdminCapId({
    client,
    packageId,
    owner,
}: {
    client: SuiClient,
    packageId: string,
    owner: string,
}): Promise<string | null> {
    const paginatedObjResp = await client.getOwnedObjects({
        owner,
        filter: {
            StructType: `${packageId}::staking_admin::StakingAdminCap`,
        },
        limit: 1,
    });
    for (const resp of paginatedObjResp.data) {
        return resp.data?.objectId ?? null;
    }
    return null;
}

// === main ===

main().catch(error => {
    throw error;
});
