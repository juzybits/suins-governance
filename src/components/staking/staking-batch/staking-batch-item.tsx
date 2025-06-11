import { Modal } from "@/components/ui/modal";
import { ModalFooter } from "@/components/ui/modal/modal-footer";
import {
  useLockMutation,
  type LockRequest,
} from "@/hooks/staking/useLockMutation";
import {
  useRequestUnstakeMutation,
  type RequestUnstakeRequest,
} from "@/hooks/staking/useRequestUnstakeMutation";
import {
  useUnstakeMutation,
  type UnstakeRequest,
} from "@/hooks/staking/useUnstakeMutation";
import {
  type Batch,
  MAX_LOCK_DURATION_DAYS,
  batchHelpers,
} from "@/types/Batch";
import { formatNSBalance } from "@/utils/coins";
import { formatTimeDiff, TimeUnit } from "@polymedia/suitcase-core";
import { useState } from "react";
import { toast } from "sonner";

type BatchAction = "view" | "lock" | "requestUnstake" | "unstake";

export function StakingBatchItem({ batch }: { batch: Batch }) {
  const [modalAction, setModalAction] = useState<BatchAction | null>(null);

  const onBatchClick = () => {
    if (modalAction === null) {
      setModalAction("view");
    }
  };

  const onModalClose = () => {
    setModalAction(null);
  };

  const batchOverview = (() => (
    <>
      <p>Votes: {formatNSBalance(batch.votingPower)}</p>
      <p>Multiplier: {batch.votingMultiplier.toFixed(2)}x</p>

      {batch.isLocked ? (
        <>
          <p>Locked for: {batch.lockDurationDays} days</p>
          <p>Locked on: {batch.startDate.toLocaleDateString()}</p>
          <p>Unlocks on: {batch.unlockDate.toLocaleDateString()}</p>
        </>
      ) : (
        // staked
        <>
          <p>Staked for: {batch.daysSinceStart} days</p>
          <p>Staked on: {batch.startDate.toLocaleDateString()}</p>
          {batch.isCooldownRequested && !batch.isCooldownOver && (
            <>
              <p>In cooldown</p>
              <p>
                Available in:{" "}
                {formatTimeDiff({
                  timestamp: batch.cooldownEndDate!.getTime(),
                  minTimeUnit: TimeUnit.ONE_MINUTE,
                })}
              </p>
            </>
          )}
        </>
      )}
    </>
  ))();

  return (
    <div
      onClick={onBatchClick}
      className="rounded-l-s rounded-r-s bg-[#62519C2E] p-s"
    >
      <div>
        <h3>{formatNSBalance(batch.balanceNS)} NS</h3>
        {batchOverview}
      </div>

      <div className="button-group">
        <BatchActions batch={batch} onActionChange={setModalAction} />
      </div>

      {modalAction === "view" && (
        <ModalViewBatch
          batch={batch}
          onActionChange={setModalAction}
          onClose={onModalClose}
        />
      )}

      {modalAction === "lock" && (
        <ModalLockBatch batch={batch} onClose={onModalClose} />
      )}

      {modalAction === "requestUnstake" && (
        <ModalRequestUnstakeBatch batch={batch} onClose={onModalClose} />
      )}

      {modalAction === "unstake" && (
        <ModalUnstakeBatch batch={batch} onClose={onModalClose} />
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
  const onBtnClick = (action: BatchAction, event: React.MouseEvent) => {
    event.stopPropagation();
    onActionChange(action);
  };

  if (batch.isVoting) {
    return null;
  }

  if (batch.isLocked) {
    if (batch.lockDurationDays < MAX_LOCK_DURATION_DAYS) {
      return (
        <button onClick={(e) => onBtnClick("lock", e)}>Extend Lock</button>
      );
    }
  }

  if (batch.isStaked) {
    return (
      <>
        {!batch.isCooldownRequested ? (
          <>
            <button onClick={(e) => onBtnClick("requestUnstake", e)}>
              Request Unstake
            </button>
            <button onClick={(e) => onBtnClick("lock", e)}>Lock</button>
          </>
        ) : batch.isCooldownOver ? (
          <button onClick={(e) => onBtnClick("unstake", e)}>Unstake Now</button>
        ) : null}
      </>
    );
  }

  return null;
}

function ModalViewBatch({
  batch,
  onActionChange,
  onClose,
}: {
  batch: Batch;
  onActionChange: (action: BatchAction) => void;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <h2>{batch.isStaked ? "Staked" : "Locked"}</h2>
      <h1>{formatNSBalance(batch.balanceNS)} NS</h1>
      <div>
        <p>Votes: {formatNSBalance(batch.votingPower)}</p>
        {batch.isStaked && (
          <>
            <p>Days Staked: {batch.daysSinceStart}</p>
            <p>Votes multiplier: {batch.votingMultiplier.toFixed(2)}x</p>
          </>
        )}
        {batch.isLocked && (
          <>
            <p>Locked for: {batch.lockDurationDays} days</p>
            <p>Votes multiplier: {batch.votingMultiplier.toFixed(2)}x</p>
            <p>Date Locked: {batch.startDate.toLocaleDateString()}</p>
            <p>Unlocks On: {batch.unlockDate.toLocaleDateString()}</p>
          </>
        )}
      </div>
      <div className="button-group">
        <BatchActions batch={batch} onActionChange={onActionChange} />
      </div>
    </Modal>
  );
}

/**
 * Lock a staked batch, or extend the lock period of a locked batch.
 */
function ModalLockBatch({
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

  const [months, setMonths] = useState(0);

  const votes = batchHelpers.calculateBalanceVotingPower({
    balance: batch.balanceNS,
    months,
    mode: "lock",
  });

  return (
    <Modal onClose={onClose}>
      <h2>Lock Tokens</h2>

      <p>
        {batch.isStaked
          ? "Lock your staked NS tokens "
          : "Extend the lock period of your locked NS tokens "}
        to receive an immediate boost to your voting power!
      </p>

      <div className="box">
        <div>
          {batch.isStaked
            ? `Staked for ${batch.daysSinceStart} Days`
            : `Locked for ${batch.lockDurationDays} Days`}
        </div>
        <div>Votes {formatNSBalance(batch.votingPower)}</div>
        <div>
          <h3>{formatNSBalance(batch.balanceNS)} NS</h3>
        </div>
      </div>

      <div>
        <div>Select Lock Period</div>
      </div>

      <div>
        <div>Votes {formatNSBalance(votes)}</div>
      </div>

      <ModalFooter
        actionText="Lock Tokens"
        onClose={onClose}
        onAction={() => onLock({ batchId: batch.objectId, months })}
      />
    </Modal>
  );
}

function ModalRequestUnstakeBatch({
  batch,
  onClose,
}: {
  batch: Batch;
  onClose: () => void;
}) {
  const requestUnstakeMutation = useRequestUnstakeMutation();

  const onRequestUnstake = async (data: RequestUnstakeRequest) => {
    try {
      await requestUnstakeMutation.mutateAsync(data);
      toast.success("Successfully initiated cooldown");
    } catch (error) {
      toast.error((error as Error).message || "Failed to request cooldown");
    } finally {
      onClose();
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2>Request Unstake</h2>
      <p>Unstaking initiates a 3-day cooldown period.</p>
      <div className="box">
        <div>{formatNSBalance(batch.balanceNS)} NS</div>
        <div>Votes: {formatNSBalance(batch.votingPower)}</div>
        <div>Started: {batch.startDate.toLocaleDateString()}</div>
      </div>
      <ModalFooter
        onClose={onClose}
        actionText="Start Cooldown"
        onAction={() => onRequestUnstake({ batchId: batch.objectId })}
      />
    </Modal>
  );
}

function ModalUnstakeBatch({
  batch,
  onClose,
}: {
  batch: Batch;
  onClose: () => void;
}) {
  const unstakeMutation = useUnstakeMutation();

  const onUnstake = async (data: UnstakeRequest) => {
    try {
      await unstakeMutation.mutateAsync(data);
      toast.success("Successfully unstaked");
    } catch (error) {
      toast.error((error as Error).message || "Failed to unstake batch");
    } finally {
      onClose();
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2>Unstake Batch</h2>

      <p>Destroy the batch and get your NS back.</p>

      <div className="box">
        <div>{formatNSBalance(batch.balanceNS)} NS</div>
        <div>Votes: {formatNSBalance(batch.votingPower)}</div>
        <div>Started: {batch.startDate.toLocaleDateString()}</div>
      </div>

      <ModalFooter
        actionText="Unstake"
        onClose={onClose}
        onAction={() => onUnstake({ batchId: batch.objectId })}
      />
    </Modal>
  );
}
