import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const governancePkgV1 = "0xd43eeaa30cb62d94ecf7d2a2283913486bfd9288926f9f7ff237ac7a6cb44b41";

const main = async () => {
    const client = new SuiClient({ url: getFullnodeUrl("mainnet") });
    console.log(JSON.stringify(await queryTxs(client), null, 2));
    // console.log(JSON.stringify(await queryEvents(client), null, 2));
};

async function queryTxs(client: SuiClient) {
    const txs = await client.queryTransactionBlocks({
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
        limit: 1,
    });
    return txs;
}

async function queryEvents(client: SuiClient) {
    const events = await client.queryEvents({
        query: {
            MoveEventType: `${governancePkgV1}::proposal::ReturnTokenEvent`,
        },
        limit: 1,
    });
    return events;
}

main();
