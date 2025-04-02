"use client";

import { useState, useMemo, useEffect } from "react";
import { type Batch } from "@/types/Batch";
import {
  type StakeRequest,
  useStakeOrLockMutation,
} from "@/hooks/staking/useStakeOrLockMutation";
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
import { parseNSAmount } from "@/utils/parseAmount";
import {
  type UnstakeRequest,
  useUnstakeMutation,
} from "@/hooks/staking/useUnstakeMutation";
import {
  Modal,
  ModalFooter,
  MonthSelector,
} from "@/components/ui/dummy-ui/dummy-ui";
import Loader from "@/components/ui/Loader";
import { useGetBatches } from "@/hooks/staking/useGetBatches";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { useGetBalance } from "@/hooks/useGetBalance";
import { NETWORK } from "@/constants/env";

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

  const balance = useGetBalance({
    owner: currAcct?.address,
    coinType: SUINS_PACKAGES[NETWORK].votingTokenType,
  });
  const availableNS = balance.data ? BigInt(balance.data.totalBalance) : 0n;

  const batches = useGetBatches(currAcct?.address);
  const batchesData = batches.data ?? [];
  const stakingData = useMemo((): StakingData => {
    let lockedNS = 0n;
    let lockedPower = 0n;
    let stakedNS = 0n;
    let stakedPower = 0n; // should this include cooldown batches, given they cannot vote?
    let totalPower = 0n;

    batchesData.forEach((batch) => {
      if (batch.isLocked) {
        lockedNS += batch.balanceNS;
        lockedPower += batch.votingPower;
      } else if (batch.isStaked) {
        stakedNS += batch.balanceNS;
        stakedPower += batch.votingPower;
      }
      totalPower += batch.votingPower;
    });

    return {
      lockedNS,
      lockedPower,
      stakedNS,
      stakedPower,
      totalPower,
    };
  }, [batchesData]);

  if (balance.isLoading || batches.isLoading) {
    return <Loader className="h-5 w-5" />;
  }

  if (balance.error || batches.error) {
    return <div>Error: {balance.error?.message ?? batches.error?.message}</div>;
  }

  return (
    <>
      <PanelOverview availableNS={availableNS} stakingData={stakingData} />
      <PanelBatches availableNS={availableNS} batches={batchesData} />
      <PanelParticipation />
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
  const [modalAction, setModalAction] = useState<null | "stake" | "lock">(null);

  return (
    <div className="panel">
      <h2>Staked & Locked (count: {batches.length})</h2>

      {batches.length === 0 && (
        <>
          <h3>No Stakes or Locks</h3>
          <p>
            Start Staking your NS to participate in governance, earn rewards,
            and shape the future of SuiNS
          </p>
        </>
      )}

      <div className="button-group">
        <button onClick={() => setModalAction("stake")}>Stake</button>
        <button onClick={() => setModalAction("lock")}>Lock</button>
      </div>

      {batches.length > 0 && (
        <>
          {batches.map((batch) => (
            <CardBatch key={batch.objectId} batch={batch} />
          ))}
        </>
      )}

      {modalAction && (
        <ModalStakeOrLockNewBatch
          availableNS={availableNS}
          action={modalAction}
          onActionChange={setModalAction}
          onClose={() => setModalAction(null)}
        />
      )}
    </div>
  );
}

function CardBatch({ batch }: { batch: Batch }) {
  const [modalAction, setModalAction] = useState<BatchAction | null>(null);

  const onBtnClick = (action: BatchAction, event: React.MouseEvent) => {
    event.stopPropagation();
    setModalAction(action);
  };

  const onBatchClick = () => {
    if (modalAction === null) {
      setModalAction("view");
    }
  };

  const onModalClose = () => {
    setModalAction(null);
  };

  const getStatusText = () => {
    if (batch.isLocked) {
      return `Locked for ${batch.lockDurationDays} Days`;
    } else if (batch.isCooldownOver) {
      return `Cooldown Over`;
    } else if (batch.isCooldownRequested) {
      return `Cooldown Requested`;
    } else if (batch.isVoting) {
      return `Used for Voting`;
    } else {
      return `Staked for ${batch.daysSinceStart} Days`;
    }
  };

  const batchActions = (() => {
    if (batch.isVoting) {
      // voting batches cannot take any actions until voting ends
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
            <button onClick={(e) => onBtnClick("unstake", e)}>
              Unstake Now
            </button>
          ) : null}
        </>
      );
    }
    return null;
  })();

  return (
    <div className="batch" onClick={onBatchClick}>
      <div className="batch-header">
        <b>{formatNSBalance(batch.balanceNS)} NS</b>
        <b>{formatNSBalance(batch.votingPower)} Votes</b>
      </div>

      <div className="batch-status">
        <div>{getStatusText()}</div>
      </div>

      {batchActions && (
        <div className="batch-actions">
          <div className="button-group">{batchActions}</div>
        </div>
      )}

      {modalAction === "view" && (
        <ModalViewBatch batch={batch} onClose={onModalClose} />
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

function ModalStakeOrLockNewBatch({
  action,
  availableNS,
  onActionChange,
  onClose,
}: {
  availableNS: bigint;
  action: "stake" | "lock";
  onActionChange: (action: "stake" | "lock") => void;
  onClose: () => void;
}) {
  const stakeOrLockMutation = useStakeOrLockMutation();

  const onStakeOrLock = async (data: StakeRequest) => {
    try {
      await stakeOrLockMutation.mutateAsync(data);
      toast.success(
        `Successfully ${action === "lock" ? "locked" : "staked"} tokens`,
      );
    } catch (error) {
      toast.error((error as Error).message || "Failed to stake tokens");
    } finally {
      onClose();
    }
  };

  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState(action === "lock" ? 1 : 0);

  useEffect(() => {
    setMonths(action === "lock" ? 1 : 0);
  }, [action]);

  const votes = batchHelpers.calculateLockedVotingPower({
    balance: parseNSAmount(amount),
    lockMonths: months,
  });
  const actionText = action === "lock" ? "Lock Tokens" : "Stake Tokens";

  return (
    <Modal onClose={onClose}>
      <h2>{`${action === "lock" ? "Lock" : "Stake"} Tokens`}</h2>

      <p>
        Stake your NS tokens to receive Votes, which increases over time, with
        an immediate boost based on a lockup period of 1-12 months.
      </p>

      <div className="radio-group">
        <label>
          <input
            type="radio"
            checked={action === "stake"}
            onChange={() => onActionChange("stake")}
          />
          Stake
        </label>

        <label>
          <input
            type="radio"
            checked={action === "lock"}
            onChange={() => onActionChange("lock")}
          />
          Lock
        </label>
      </div>

      <div className="box">
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        /{formatNSBalance(availableNS)} NS
      </div>

      {action === "lock" && (
        <div className="box">
          <MonthSelector
            months={months}
            setMonths={setMonths}
            currentMonths={0}
          />
        </div>
      )}

      <div>
        <div>Votes {formatNSBalance(votes)}</div>
      </div>

      <ModalFooter
        actionText={actionText}
        onClose={onClose}
        onAction={() => onStakeOrLock({ amount, months })}
      />
    </Modal>
  );
}

function ModalViewBatch({
  batch,
  onClose,
}: {
  batch: Batch;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <h2>{batch.isStaked ? "Staked" : "Locked"}</h2>
      <h1>{formatNSBalance(batch.balanceNS)} NS</h1>
      <div>
        <p>Votes: {formatNSBalance(batch.votingPower)}</p>
        <p>Votes multiplier: {batch.votingMultiplier.toFixed(2)}x</p>
        {batch.isStaked && (
          <>
            <p>Days Staked: {batch.daysSinceStart}</p>
          </>
        )}
        {batch.isLocked && (
          <>
            <p>Locked for: {batch.lockDurationDays} days</p>
            <p>Date Locked: {batch.startDate.toLocaleDateString()}</p>
            <p>Unlocks On: {batch.unlockDate.toLocaleDateString()}</p>
          </>
        )}
      </div>
    </Modal>
  );
}

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

  const votes = batchHelpers.calculateLockedVotingPower({
    balance: batch.balanceNS,
    lockMonths: months,
  });

  return (
    <Modal onClose={onClose}>
      <h2>Lock Tokens</h2>

      <p>
        Lock your already Staked NS tokens to receive an immediate Votes
        multiplier.
      </p>

      <div className="box">
        <div>Staked for {batch.daysSinceStart} Days</div>
        <div>{formatNSBalance(batch.balanceNS)} NS</div>
        <div>Votes {formatNSBalance(batch.votingPower)}</div>
      </div>

      <div>
        <div>Select Lock Period</div>
        <div className="box">
          <MonthSelector
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

function PanelParticipation() {
  const votes: { id: string }[] = [];
  return (
    <div className="panel">
      <h2>Your Governance Participation</h2>
      {votes.length === 0 ? (
        <>
          <h3>No Votes</h3>
          <p>
            Once you start voting, your participation will be showcased here
          </p>
        </>
      ) : (
        <>
          {votes.map((vote) => (
            <div key={vote.id}>{vote.id}</div>
          ))}
        </>
      )}
    </div>
  );
}
