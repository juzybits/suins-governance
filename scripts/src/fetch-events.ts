/**
 * Find addresses who voted on proposals 1-4, and how much NS they voted with.
 */

import { SuiClient } from "@mysten/sui/client";
import { SUINS_ENDPOINTS } from "../../src/constants/endpoints";
import { formatNSBalance } from "../../src/utils/coins";

const governancePkgV1 =
  "0xd43eeaa30cb62d94ecf7d2a2283913486bfd9288926f9f7ff237ac7a6cb44b41";

export type ReturnTokenEvent = {
  tx_digest: string;
  timestamp: string;
  date: string;
  voter_addr: string;
  amount_raw: string;
  amount_ns: string;
};

const main = async () => {
  const client = new SuiClient({ url: SUINS_ENDPOINTS.mainnet });
  const events = await queryTxs(client);
  console.log(JSON.stringify(events, null, 2));
};

async function queryTxs(client: SuiClient) {
  let events: ReturnTokenEvent[] = [];
  let hasNextPage = true;
  let cursor: string | null | undefined = null;
  while (hasNextPage) {
    const txs = await client.queryTransactionBlocks({
      cursor,
      filter: {
        MoveFunction: {
          package: governancePkgV1,
          module: "proposal",
          function: "return_tokens_bulk",
        },
      },
      options: {
        showEvents: true,
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
          date: new Date(Number(tx.timestampMs)).toISOString().slice(0, 10),
          voter_addr: json.voter,
          amount_raw: json.amount,
          amount_ns: formatNSBalance(json.amount),
        });
      }
    }
  }
  return events;
}

main();
