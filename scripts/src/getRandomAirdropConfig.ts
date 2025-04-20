import { generateRandomAddress } from "@polymedia/suitcase-core";
import type { AirdropConfig } from "./generate-airdrop-config";

export function getRandomAirdropConfig(recipients: number): AirdropConfig[] {
  return Array.from({ length: recipients }, () => {
    return {
      recipient: generateRandomAddress(),
      amount_raw: getRandomNSAmount(),
      start_ms: getRandomTimestamp(),
      lock_months: 0,
    };
  });
}

function getRandomNSAmount(): string {
  const oneNS = 1_000_000;
  const minNS = oneNS;
  const maxNS = oneNS * 100;
  return getRandomInteger(minNS, maxNS).toString();
}

function getRandomTimestamp(): number {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const minMsAgo = oneDayMs * 1;
  const maxMsAgo = oneDayMs * 180;
  const msAgo = getRandomInteger(minMsAgo, maxMsAgo);
  const timestamp = Date.now() - msAgo;
  return timestamp;
}

function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
