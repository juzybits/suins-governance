import Typography from "@/components/ui/typography";
import { type Batch } from "@/types/Batch";
import { useState } from "react";
import { StakingBatchItem } from "./staking-batch-item";

export function StakingBatch({
  batches,
  title,
}: {
  batches: Batch[];
  title: string;
}) {
  const [sortBy, setSortBy] = useState<"Votes" | "Newest" | "Oldest">("Votes");

  if (batches.length === 0) return null;

  batches.sort((a, b) => {
    if (sortBy === "Votes") return Number(b.votingPower - a.votingPower);

    if (sortBy === "Newest")
      return b.startDate.getTime() - a.startDate.getTime();

    return a.startDate.getTime() - b.startDate.getTime();
  });

  return (
    <div className="flex flex-1 flex-col gap-s overflow-hidden rounded-l-s rounded-r-s bg-[#62519C2E]">
      {title === "Voting on latest proposal" && (
        <i>
          The Staked and Locked NS tokens participating in voting will be
          unavailable until the voting finishes.
        </i>
      )}
      <div className="flex items-center justify-between gap-m bg-[#62519C2E] p-m text-primary-main">
        <h2>
          <Typography variant="label/Regular Bold">{title}</Typography>
        </h2>
        <div>
          <label htmlFor="sort-by">Sort by:</label>
          <select
            id="sort-by"
            onChange={(e) =>
              setSortBy(e.target.value as "Votes" | "Newest" | "Oldest")
            }
          >
            <option value="Votes">Votes</option>
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
          </select>
        </div>
      </div>
      {batches.map((batch) => (
        <StakingBatchItem key={batch.objectId} batch={batch} />
      ))}
    </div>
  );
}
