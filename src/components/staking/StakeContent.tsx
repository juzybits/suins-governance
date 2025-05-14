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
import { useGetUserStakingData } from "@/hooks/staking/useGetUserStakingData";
import { useCurrentAccount, useCurrentWallet } from "@mysten/dapp-kit";
import { useGetOwnedNSBalance } from "@/hooks/useGetOwnedNSBalance";
import { formatTimeDiff, TimeUnit } from "@polymedia/suitcase-core";
import { useStakeModal } from "@/components/staking/StakeModalContext";
import { PanelRecentProposals } from "@/components/staking/PanelRecentProposals";
import { StakeUserStats } from "@/components/staking/StakeUserStats";

type BatchAction = "view" | "lock" | "requestUnstake" | "unstake";

export function StakeContent() {
  const currAcct = useCurrentAccount();
  const userStaking = useGetUserStakingData(currAcct?.address);
  const balance = useGetOwnedNSBalance(currAcct?.address);

  if (balance.isLoading || userStaking.isLoading) {
    return <Loader className="h-5 w-5" />;
  }

  if (balance.error || userStaking.error) {
    return (
      <div>
        Error:{" "}
        {balance.error?.message ??
          userStaking.error?.message ??
          "Something went wrong"}
      </div>
    );
  }

  return (
    <>
      <StakeUserStats showTokens={true} />
      <PanelBatches />
      <PanelRecentProposals />
    </>
  );
}

function PanelBatches() {
  const { openModal } = useStakeModal();
  const currAcct = useCurrentAccount();
  const { isConnecting, isDisconnected } = useCurrentWallet();
  const userStaking = useGetUserStakingData(currAcct?.address);
  const balance = useGetOwnedNSBalance(currAcct?.address);

  if (userStaking.data === undefined || balance.data === undefined) {
    return null;
  }

  const isLoggedOut = (!currAcct && !isConnecting) ?? isDisconnected;

  const ownedBatches = userStaking.data.batches;
  const votingBatches = ownedBatches.filter((batch) => batch.isVoting);
  const availableBatches = ownedBatches.filter((batch) => batch.canVote);
  const unavailableBatches = ownedBatches.filter(
    (batch) => batch.isCooldownRequested,
  );

  return (
    <div className="panel">
      {userStaking.data?.batches.length === 0 &&
        (isLoggedOut ? (
          <>
            <p>Connect your wallet to stake or lock NS tokens</p>
          </>
        ) : balance.data.raw === 0n ? (
          <>
            <h3>No NS tokens found</h3>
            <p>Stake or lock NS tokens to participate in SuiNS governance</p>
          </>
        ) : (
          <>
            <h3>Stake or lock NS to Vote</h3>
            <p>
              Start Staking your NS to Participate in governance, earn rewards,
              and shape the future of SuiNS
            </p>
            <div className="button-group">
              <button onClick={openModal}>Stake</button>
              <button onClick={openModal}>Lock</button>
            </div>
          </>
        ))}

      <BatchGroup batches={votingBatches} title="Voting on latest proposal" />
      <BatchGroup batches={availableBatches} title="Available for voting" />
      <BatchGroup batches={unavailableBatches} title="Unavailable for voting" />
    </div>
  );
}

function BatchGroup({ batches, title }: { batches: Batch[]; title: string }) {
  const [sortBy, setSortBy] = useState<"Votes" | "Newest" | "Oldest">("Votes");

  if (batches.length === 0) {
    return null;
  }

  batches.sort((a, b) => {
    if (sortBy === "Votes") {
      return Number(b.votingPower - a.votingPower);
    }
    if (sortBy === "Newest") {
      return b.startDate.getTime() - a.startDate.getTime();
    }
    // oldest
    return a.startDate.getTime() - b.startDate.getTime();
  });

  return (
    <div className="batch-group">
      {title === "Voting on latest proposal" && (
        <i>
          The Staked and Locked NS tokens participating in voting will be
          unavailable until the voting finishes.
        </i>
      )}
      <h2>{title}</h2>
      {batches.length > 1 && (
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
      )}
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
