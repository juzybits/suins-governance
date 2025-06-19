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
    <div className="overflow flex flex-col gap-s rounded-l-s rounded-r-s bg-[#62519C2E]">
      <div className="flex items-center justify-between gap-m rounded-tl-s rounded-tr-s bg-[#62519C2E] p-m text-primary-main">
        <h2>
          <Typography variant="label/Regular Bold">{title}</Typography>
        </h2>
        {batches.length > 1 && (
          <div>
            <Typography variant="label/Regular Bold" className="text-secondary">
              <label htmlFor="sort-by">Sort by: </label>
              <select
                className="all-unset"
                id="sort-by"
                onChange={(e) =>
                  setSortBy(e.target.value as "Votes" | "Newest" | "Oldest")
                }
              >
                <option value="Votes">Votes</option>
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
              </select>
            </Typography>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-s px-m py-s">
        {title === "Voting on latest proposal" && (
          <div className="align-center rounded-2xs bg-primary-main px-m py-s text-bg-primary_dark text-secondary">
            The Staked and Locked NS tokens participating in voting will be
            unavailable until the voting finishes.
          </div>
        )}
        {batches.map((batch) => (
          <StakingBatchItem key={batch.objectId} batch={batch} />
        ))}
      </div>
    </div>
  );
}
