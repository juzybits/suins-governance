import { Modal } from "@/components/ui/modal";
import { ModalFooter } from "@/components/ui/modal/modal-footer";
import Typography from "@/components/ui/typography";
import {
  useLockMutation,
  type LockRequest,
} from "@/hooks/staking/useLockMutation";

import { type Batch, batchHelpers } from "@/types/Batch";
import { formatNSBalance } from "@/utils/coins";
import { useState } from "react";
import { toast } from "sonner";
import { StakingBatchItem } from "./staking-batch-item";
import Radio from "@/components/ui/radio";
import Table from "@/components/ui/table";
import { ONE_NS_RAW } from "@/constants/common";
import { makeId } from "@/utils/id";
import { id } from "date-fns/locale";

export function StakingBatchItemModal({
  batch,
  onClose,
}: {
  batch: Batch;
  onClose: () => void;
}) {
  const lockMutation = useLockMutation();

  const onLock = async (data: LockRequest) => {
    try {
      await lockMutation.mutateAsync(data);
      toast.success("Successfully locked tokens");
    } catch (error) {
      toast.error((error as Error).message || "Failed to lock batch");
    } finally {
      onClose();
    }
  };

  const currentMonths = batch.lockDurationDays / 30;
  const validMonths = [1, 2, 6, 12].filter((month) => month > currentMonths);
  const [months, setMonths] = useState(validMonths[0] ?? 1);

  return (
    <Modal
      onClose={onClose}
      title={`${batch.isStaked ? "Lock Tokens" : "Extend Lock"}`}
      subtitle={`${batch.isStaked
          ? "Lock your staked NS tokens "
          : "Extend the lock period of your locked NS tokens "}
        to receive an immediate boost to your voting power!`}
    >
      <div className="my-xl">
        <StakingBatchItem batch={batch} noAction />
      </div>
      <hr className="border-tertiary" />
      <div className="my-2xl flex flex-col gap-xs">
        <h3>
          <Typography variant="heading/Small Bold">Lock Tokens</Typography>
        </h3>
        <p>
          <Typography variant="paragraph/Regular" className="text-secondary">
            Locked tokens cannot be unstaked until commitment date has
            been reached.
          </Typography>
        </p>
        <Table
          minimalist
          header={[
            <Typography
              variant="label/Small Medium"
              key={makeId(id, "duration")}
            >
              Duration
            </Typography>,
            <>Multiplier</>,
            <>Votes</>,
          ]}
          content={validMonths.flatMap((month, index) => {
            const powerPreview = batchHelpers.calculateBalanceVotingPower({
              mode: "lock",
              months: month,
              balance: batch.balanceNS,
            });
            const multiplierPreview =
              Number(
                batchHelpers.calculateBalanceVotingPower({
                  balance: BigInt(ONE_NS_RAW),
                  months: month,
                  mode: "lock",
                }),
              ) / ONE_NS_RAW;
            const days = month * 30;
            const label = `${days} days`;

            return [
              [
                <div
                  className="flex gap-s"
                  key={makeId("lock", "cell", index, 0)}
                >
                  <Radio
                    value={months === month}
                    toggle={() => setMonths(month)}
                  />
                  <Typography variant="label/Large Medium">{label}</Typography>
                </div>,
                <Typography
                  variant="label/Large Bold"
                  key={makeId("lock", "cell", index, 1)}
                  className="text-right text-primary-main"
                >
                  {multiplierPreview.toFixed(2)}x
                </Typography>,
                <Typography
                  variant="label/Large Bold"
                  key={makeId("lock", "cell", index, 2)}
                  className="text-right text-semantic-good"
                >
                  {formatNSBalance(powerPreview)}
                </Typography>,
              ],
            ];
          })}
        />
      </div>
      <ModalFooter
        actionText="Lock Tokens"
        onClose={onClose}
        onAction={() => onLock({ batchId: batch.objectId, months })}
      />
    </Modal>
  );
}
