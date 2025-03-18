"use client";

import { SuiObjectResponse } from "@mysten/sui/client";

export function StakeContent({
  stakeBatches,
}: {
  stakeBatches: SuiObjectResponse[];
}) {
  return (
    <div className="flex w-full flex-col gap-2024_L px-2024_L sm:max-w-[1100px] lg:flex-row">
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-2024_3XL sm:gap-2024_5XL md:basis-2/3">
        <h1>Stake Batches: {stakeBatches.length}</h1>
      </div>
    </div>
  );
}
