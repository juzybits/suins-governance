import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { formatNSBalance } from "../src/utils/formatNumber";

const governancePkgV1 = "0xd43eeaa30cb62d94ecf7d2a2283913486bfd9288926f9f7ff237ac7a6cb44b41";
const eventsPerQuery = 1;

const main = async () => {
    const client = new SuiClient({ url: getFullnodeUrl("mainnet") });
    // console.log(JSON.stringify(await queryTxs(client), null, 2));
    console.log(await queryTxs(client));
    // console.log(JSON.stringify(await queryEvents(client), null, 2));
};

type ReturnTokenEvent = {
    tx_digest: string;
    timestamp: string;
    voter_addr: string;
    amount_raw: string;
    amount_ns: string;
}

async function queryTxs(client: SuiClient) {
    let events: ReturnTokenEvent[] = [];
    let hasNextPage = true;
    let cursor: string | null | undefined = null;
    while (hasNextPage) {
        const txs = await client.queryTransactionBlocks({
            cursor,
            limit: eventsPerQuery,
            filter: {
                MoveFunction: {
                    package: governancePkgV1,
                    module: "proposal",
                    function: "return_tokens_bulk",
                },
            },
            options: {
                // showBalanceChanges: true,
                // showEffects: true,
                showEvents: true,
                // showInput: true,
                // showObjectChanges: true,
                // showRawEffects: true,
                // showRawInput: true,
            },
        });
        hasNextPage = txs.hasNextPage;
        cursor = txs.nextCursor;
        for (const tx of txs.data) {
            for (const event of tx.events!) {
                const json: any = event.parsedJson;
                events.push({
                    tx_digest: tx.digest,
                    timestamp: tx.timestampMs!,
                    voter_addr: json.voter,
                    amount_raw: json.amount,
                    amount_ns: formatNSBalance(json.amount),
                })
            }
        }
        break; // TODO: remove
    }
    return events;
}

// async function queryEvents(client: SuiClient) {
//     const events = await client.queryEvents({
//         query: {
//             MoveEventType: `${governancePkgV1}::proposal::ReturnTokenEvent`,
//         },
//         limit: 1,
//     });
//     return events;
// }

main();
