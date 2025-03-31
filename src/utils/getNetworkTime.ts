import { type SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

/**
 * Some users's devices have the wrong time, so we use the actual network time
 */
export async function getNetworkTime(suiClient: SuiClient) {
  const tx = new Transaction();
  tx.moveCall({
    target: "0x2::clock::timestamp_ms",
    arguments: [tx.object.clock()],
  });
  try {
    const resp = await suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender:
        "0x7777777777777777777777777777777777777777777777777777777777777777",
    });
    const returnValue = resp.results?.[0]?.returnValues?.[0]?.[0];
    if (!returnValue) {
      console.warn(
        "[getNetworkTime] Failed to get network time. Response: ",
        resp,
      );
      return Date.now();
    }

    const timestampBytes = Uint8Array.from(returnValue);
    const timestamp = Number(bcs.u64().parse(timestampBytes));
    return timestamp;
  } catch (error) {
    console.warn("[getNetworkTime] error:", error);
    return Date.now();
  }
}
