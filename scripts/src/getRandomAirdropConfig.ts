import { generateRandomAddress } from "@polymedia/suitcase-core";
import type { AirdropConfig } from "./generate-airdrop-config";

export function getRandomAirdropConfig(recipients: number): AirdropConfig[] {
    return Array.from({ length: recipients }, () => {
        const start_ms = getRandomTimestamp().toString();
        return {
            recipient: generateRandomAddress(),
            amount_raw: getRandomNSAmount().toString(),
            start_ms,
            unlock_ms: start_ms,
        };
    });
}

function getRandomNSAmount(): number {
    const oneNS = 1_000_000;
    const minNS = oneNS;
    const maxNS = oneNS * 100;
    return getRandomNumber(minNS, maxNS);
}

function getRandomTimestamp(): number {
    const oneDayMs = 24 * 60 * 60 * 1000;
    const minMsAgo = oneDayMs * 1;
    const maxMsAgo = oneDayMs * 180;
    const msAgo = getRandomNumber(minMsAgo, maxMsAgo);
    const timestamp = Date.now() - msAgo;
    return timestamp;
}

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
