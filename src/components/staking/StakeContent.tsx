"use client";

import { useState } from "react";
import { type Batch } from "@/types/Batch";
import {
  type LockRequest,
  useLockMutation,
} from "@/hooks/staking/useLockMutation";
import {
  type RequestUnstakeRequest,
  useRequestUnstakeMutation,
} from "@/hooks/staking/useRequestUnstakeMutation";
import { toast } from "sonner";
import { formatNSBalance } from "@/utils/formatNumber";
import { MAX_LOCK_DURATION_DAYS, batchHelpers } from "@/types/Batch";
import {
  type UnstakeRequest,
  useUnstakeMutation,
} from "@/hooks/staking/useUnstakeMutation";
import {
  Modal,
  ModalFooter,
  LockMonthSelector,
} from "@/components/ui/dummy-ui/dummy-ui";
import Loader from "@/components/ui/Loader";
import { useGetOwnedBatches } from "@/hooks/staking/useGetOwnedBatches";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useGetOwnedNSBalance } from "@/hooks/useGetOwnedNSBalance";
import { formatTimeDiff, TimeUnit } from "@polymedia/suitcase-core";
import { useStakeModal } from "./StakeModalContext";
import { PanelRecentProposals } from "./PanelRecentProposals";

type StakingData = {
  lockedNS: bigint;
  lockedPower: bigint;
  stakedNS: bigint;
  stakedPower: bigint;
  totalPower: bigint;
};

type BatchAction = "view" | "lock" | "requestUnstake" | "unstake";

export function StakeContent() {
  const currAcct = useCurrentAccount();
  const currAddr = currAcct?.address;

  const balance = useGetOwnedNSBalance(currAddr);
  const availableNS = balance.data ? BigInt(balance.data.totalBalance) : 0n;

  const batches = useGetOwnedBatches(currAddr);

  if (
    balance.isLoading ||
    batches.isLoading ||
    typeof batches.data === "undefined"
  ) {
    return <Loader className="h-5 w-5" />;
  }

  if (balance.error || batches.error) {
    return (
      <div>
        Error:{" "}
        {balance.error?.message ??
          batches.error?.message ??
          "Something went wrong"}
      </div>
    );
  }

  return (
    <>
      <PanelOverview
        availableNS={availableNS}
        stakingData={batches.data.summary}
      />
      <PanelBatches availableNS={availableNS} batches={batches.data.batches} />
      <PanelRecentProposals />
    </>
  );
}

function PanelOverview({
  stakingData,
  availableNS,
}: {
  stakingData: StakingData;
  availableNS: bigint;
}) {
  const { lockedNS, lockedPower, stakedNS, stakedPower, totalPower } =
    stakingData;

  return (
    <div className="panel">
      <div>
        <p>
          Total Locked: {formatNSBalance(lockedNS)} NS (
          {formatNSBalance(lockedPower)} Votes)
        </p>
        <p>
          Total Staked: {formatNSBalance(stakedNS)} NS (
          {formatNSBalance(stakedPower)} Votes)
        </p>
        <p>Your Total Votes: {formatNSBalance(totalPower)}</p>
        <p>Available Tokens: {formatNSBalance(availableNS)} NS</p>
      </div>
    </div>
  );
}

function PanelBatches({
  availableNS,
  batches,
}: {
  availableNS: bigint;
  batches: Batch[];
}) {
  const { openModal } = useStakeModal();

  const votingBatches = batches.filter((batch) => batch.isVoting);
  const availableBatches = batches.filter((batch) => batch.canVote);
  const unavailableBatches = batches.filter(
    (batch) => batch.isCooldownRequested,
  );

  return (
    <div className="panel">
      {batches.length === 0 &&
        (availableNS === 0n ? (
          <>
            <h3>No NS tokens found</h3>
            <p>Stake or Lock NS tokens to participate in SuiNS governance</p>
          </>
        ) : (
          <>
            <h3>Stake or Lock NS to Vote</h3>
            <p>
              Start Staking your NS to Participate in governance, earn rewards,
              and shape the future of SuiNS
            </p>
            <div className="button-group">
              <button onClick={() => openModal("stake")}>Stake</button>
              <button onClick={() => openModal("lock")}>Lock</button>
            </div>
          </>
        ))}

      <BatchGroup batches={votingBatches} title="Voting on latest proposal" />
      <BatchGroup batches={availableBatches} title="Available for voting" />
      <BatchGroup batches={unavailableBatches} title="Unavailable for voting" />
    </div>
  );
}

// TODO-J: add "sort by"
function BatchGroup({ batches, title }: { batches: Batch[]; title: string }) {
  if (batches.length === 0) {
    return null;
  }

  return (
    <div className="batch-group">
      {title === "Voting on latest proposal" && (
        <i>
          The Staked and Locked NS tokens participating in voting will be
          unavailable until the voting finishes.
        </i>
      )}
      <h2>{title}</h2>
      {batches.map((batch) => (
        <CardBatch key={batch.objectId} batch={batch} />
      ))}
    </div>
  );
}

function CardBatch({ batch }: { batch: Batch }) {
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
    <div className="batch" onClick={onBatchClick}>
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

  const [months, setMonths] = useState(1);

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
        <div className="box">
          <LockMonthSelector
            months={months}
            setMonths={setMonths}
            currentMonths={batch.lockDurationDays / 30}
          />
        </div>
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
        actionText="Start Cooldown"
        onClose={onClose}
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
