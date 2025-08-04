import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import {
  useRequestUnstakeMutation,
  type RequestUnstakeRequest,
} from "@/hooks/staking/useRequestUnstakeMutation";
import {
  useUnstakeMutation,
  type UnstakeRequest,
} from "@/hooks/staking/useUnstakeMutation";
import NSToken from "@/icons/legacy/NSToken";
import LockSVG from "@/icons/lock";
import StakeSVG from "@/icons/stake";
import UnstakeSVG from "@/icons/unstake";
import { type Batch, MAX_LOCK_DURATION_DAYS } from "@/types/Batch";
import { formatNSBalance } from "@/utils/coins";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { StakingBatchItemModal } from "./staking-batch-item-modal";

type BatchAction = "view" | "lock" | "requestUnstake" | "unstake";

export function StakingBatchItem({
  batch,
  noAction,
}: {
  batch: Batch;
  noAction?: boolean;
}) {
  const [modalAction, setModalAction] = useState<BatchAction | null>(null);

  const onModalClose = () => {
    setModalAction(null);
  };

  const Icon = batch.isLocked ? LockSVG : StakeSVG;

  const batchOverview = (() => (
    <div className="flex justify-between gap-m">
      <div className="flex gap-xs text-secondary">
        <Icon width="100%" className="max-w-[0.75rem]" />
        {batch.isLocked ? (
          <>
            <p>
              <Typography variant="label/Small Bold">
                Unlocks On{" "}
                <span className="text-primary-main">
                  {batch.unlockDate.toLocaleDateString()}
                </span>
              </Typography>
            </p>
            <p className="hidden md:block">
              <Typography variant="label/Small Medium">
                Locked For{" "}
                <Typography
                  variant="label/Small Bold"
                  className="text-primary-main"
                >
                  {Math.floor(batch.lockDurationDays)} days
                </Typography>{" "}
                {!noAction && (
                  <span className="text-tertiary">
                    on: {batch.startDate.toLocaleDateString()} (
                    {batch.votingMultiplier.toFixed(2)}x multiplier)
                  </span>
                )}
              </Typography>
            </p>
          </>
        ) : (
          <>
            <p>
              <Typography variant="label/Small Bold">
                Staked for {Math.floor(batch.daysSinceStart)} days
              </Typography>
            </p>
            {batch.isCooldownOver && (
              <p className="hidden md:block">
                <Typography variant="label/Small Medium">
                  Cooled Down On{" "}
                  <Typography
                    variant="label/Small Bold"
                    className="text-primary-main"
                  >
                    {new Date(batch.startDate).toLocaleDateString()}
                  </Typography>
                </Typography>
              </p>
            )}
          </>
        )}
      </div>
      <div className="hidden gap-xs text-secondary md:block">
        <Typography variant="label/Small Medium">
          Votes:{" "}
          <Typography variant="label/Small Bold" className="text-primary-main">
            {formatNSBalance(batch.votingPower)}
          </Typography>
        </Typography>
      </div>
    </div>
  ))();

  return (
    <div className="flex flex-col gap-m rounded-l-s rounded-r-s bg-[#62519C2E] p-xs">
      <div className="flex gap-m">
        <NSToken width="4rem" />
        <div className="w-full">
          <div className="flex flex-col justify-center gap-xs">
            {batchOverview}
            <div className="flex items-center justify-between">
              <h3>
                <Typography
                  className="text-primary-main"
                  variant="display/XSmall Light"
                >
                  {formatNSBalance(batch.balanceNS)} NS
                </Typography>
              </h3>
              {!noAction && (
                <div className="hidden md:block">
                  <BatchActions batch={batch} onActionChange={setModalAction} />
                </div>
              )}
            </div>
          </div>
          {modalAction === "lock" && (
            <StakingBatchItemModal batch={batch} onClose={onModalClose} />
          )}
        </div>
      </div>
      <div className="flex flex-col justify-between gap-xs">
        {[
          {
            name: "Votes",
            value: formatNSBalance(batch.votingPower),
            className: "block md:hidden",
          },
          ...(batch.isLocked
            ? [
                {
                  name: "Locked For",
                  value: `${Math.floor(batch.lockDurationDays)} days`,
                },
                {
                  name: "Locked on",
                  value: `${batch.startDate.toLocaleDateString()} (${batch.votingMultiplier.toFixed(2)}x multiplier)`,
                },
              ]
            : batch.isCooldownOver
              ? [
                  {
                    name: "Cooled Down On",
                    value: new Date(batch.startDate).toLocaleDateString(),
                  },
                ]
              : []),
        ].map(({ name, value, className }, index) => (
          <div
            key={index}
            className={`flex justify-between border-t border-t-tertiary py-m ${className ?? ""}`}
          >
            <Typography className="text-secondary" variant="label/Small Medium">
              {name}
            </Typography>
            <Typography
              variant="label/Small Bold"
              className="text-primary-main"
            >
              {value}
            </Typography>
          </div>
        ))}
        {!batch.isCooldownOver && batch.cooldownEndDate && (
          <div className="flex justify-between border-t border-t-tertiary py-m">
            <Typography
              variant="label/Small Bold"
              className="text-semantic-warning"
            >
              In cooldown
            </Typography>
            <Typography
              variant="label/Small Medium"
              className="text-semantic-warning"
            >
              Available in {formatDistanceToNow(batch.cooldownEndDate)}
            </Typography>
          </div>
        )}
      </div>
      {!noAction && (
        <div className="block md:hidden">
          <BatchActions batch={batch} onActionChange={setModalAction} />
        </div>
      )}
    </div>
  );
}

function BatchActions({
  batch,
  onActionChange,
}: {
  batch: Batch;
  onActionChange: (action: BatchAction) => void;
}) {
  const unstakeMutation = useUnstakeMutation();
  const requestUnstakeMutation = useRequestUnstakeMutation();

  const onRequestUnstake = async (data: RequestUnstakeRequest) => {
    try {
      await requestUnstakeMutation.mutateAsync(data);
      toast.success("Successfully initiated cooldown");
    } catch (error) {
      console.warn("[onRequestUnstake] failed:", error);
      toast.error("Failed to request cooldown");
    }
  };

  const onUnstake = async (data: UnstakeRequest) => {
    try {
      await unstakeMutation.mutateAsync(data);
      toast.success("Successfully unstaked");
    } catch (error) {
      toast.error((error as Error).message || "Failed to unstake batch");
    }
  };

  const openLockModal = (event: React.MouseEvent) => {
    event.stopPropagation();
    onActionChange("lock");
  };

  if (batch.isVoting) return null;

  if (batch.isLocked && batch.lockDurationDays < MAX_LOCK_DURATION_DAYS) {
    return (
      <Button
        variant="short/solid"
        className="w-full md:w-fit"
        onClick={(e) => openLockModal(e)}
        before={<LockSVG width="0.825rem" />}
      >
        <Typography variant="label/Small Bold">Extend Lock</Typography>
      </Button>
    );
  }

  if (batch.isStaked) {
    return (
      <div className="flex gap-xs">
        {!batch.isCooldownRequested ? (
          <>
            <Button
              variant="outline/small"
              before={<UnstakeSVG width="0.825rem" />}
              className="w-full whitespace-nowrap md:w-fit"
              onClick={() => onRequestUnstake({ batchId: batch.objectId })}
            >
              <Typography variant="label/Small Bold">
                Request Unstake
              </Typography>
            </Button>
            {batch.daysSinceStart < MAX_LOCK_DURATION_DAYS && (
              <Button
                variant="short/solid"
                className="w-full md:w-fit"
                before={<LockSVG width="0.825rem" />}
                onClick={(e) => openLockModal(e)}
              >
                <Typography variant="label/Small Bold">Lock</Typography>
              </Button>
            )}
          </>
        ) : batch.isCooldownOver ? (
          <Button
            variant="short/solid"
            className="w-full md:w-fit"
            before={<LockSVG width="0.825rem" />}
            onClick={() => onUnstake({ batchId: batch.objectId })}
          >
            <Typography variant="label/Small Bold">Unstake Now</Typography>
          </Button>
        ) : batch.cooldownEndDate ? (
          <div className="hidden flex-col items-end text-semantic-warning md:flex">
            <p>
              <Typography variant="label/Small Bold">In cooldown</Typography>
            </p>
            <p>
              <Typography variant="paragraph/XSmall">
                Available in {formatDistanceToNow(batch.cooldownEndDate)}
              </Typography>
            </p>
          </div>
        ) : null}
      </div>
    );
  }

  return null;
}
