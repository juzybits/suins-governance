"use client";

import { useState, useMemo, useEffect } from "react";
import { type StakingBatch } from "@/hooks/staking/useGetStakingBatches";
import { useStakeOrLockMutation } from "@/hooks/staking/useStakeOrLockMutation";
import { useLockMutation } from "@/hooks/staking/useLockMutation";
import { useRequestUnstakeMutation } from "@/hooks/staking/useRequestUnstakeMutation";
import { toast } from "sonner";
import { formatNSBalance } from "@/utils/formatNumber";
import { stakingBatchHelpers } from "@/utils/stakingBatchHelpers";
import { parseNSAmount } from "@/utils/parseAmount";
import { useUnstakeMutation } from "@/hooks/staking/useUnstakeMutation";
import {
  Modal,
  ModalHeader,
  ModalFooter,
  MonthSelector,
} from "@/components/ui/dummy-ui/dummy-ui";

type StakingData = {
  availableNS: bigint;
  lockedNS: bigint;
  lockedPower: bigint;
  stakedNS: bigint;
  stakedPower: bigint;
  totalPower: bigint;
};

export function StakeContent({
  batches,
  availableNS,
}: {
  batches: StakingBatch[];
  availableNS: bigint;
}) {
  const stakingData = useMemo((): StakingData => {
    let lockedNS = 0n;
    let lockedPower = 0n;
    let stakedNS = 0n;
    let stakedPower = 0n;
    let totalPower = 0n;

    batches.forEach((batch) => {
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
      availableNS,
    };
  }, [batches]);

  return (
    <>
      <PanelOverview stakingData={stakingData} />
      <PanelStake batches={batches} stakingData={stakingData} />
      <PanelParticipation />
    </>
  );
}

function PanelOverview({ stakingData }: { stakingData: StakingData }) {
  const {
    lockedNS,
    lockedPower,
    stakedNS,
    stakedPower,
    totalPower,
    availableNS,
  } = stakingData;

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
        <p>Available Tokens: {formatNSBalance(availableNS)} NS</p>
        <p>Your Total Votes: {formatNSBalance(totalPower)}</p>
      </div>
    </div>
  );
}

function PanelStake({
  batches,
  stakingData,
}: {
  batches: StakingBatch[];
  stakingData: StakingData;
}) {
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeMode, setStakeMode] = useState<"stake" | "lock">("stake");

  const onOpenStakeModal = (mode: "stake" | "lock") => {
    setStakeMode(mode);
    setShowStakeModal(true);
  };

  const buttons = (
    <div className="button-group">
      <button onClick={() => onOpenStakeModal("stake")}>Stake</button>
      <button onClick={() => onOpenStakeModal("lock")}>Lock</button>
    </div>
  );

  return (
    <div className="panel">
      <h2>Staked & Locked (count: {batches.length})</h2>
      {batches.length === 0 ? (
        <>
          <h3>No Stakes or Locks</h3>
          <p>
            Start Staking your NS to participate in governance, earn rewards,
            and shape the future of SuiNS
          </p>
          {buttons}
        </>
      ) : (
        <>
          <div>{buttons}</div>
          {batches.map((batch) => (
            <BatchCard key={batch.objectId} batch={batch} />
          ))}
        </>
      )}

      {showStakeModal && (
        <StakeModal
          mode={stakeMode}
          onClose={() => setShowStakeModal(false)}
          onModeChange={setStakeMode}
          availableNS={stakingData.availableNS}
        />
      )}
    </div>
  );
}

function BatchCard({ batch }: { batch: StakingBatch }) {
  const [showLockModal, setShowLockModal] = useState(false);
  const [showRequestUnstakeModal, setShowRequestUnstakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);

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
      const daysSinceStake = Math.floor(
        (Date.now() - batch.startDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      return `Staked for ${daysSinceStake} Days`;
    }
  };

  return (
    <div className="batch">
      <div className="batch-header">
        <div>
          <strong>{formatNSBalance(batch.balanceNS)} NS</strong>
        </div>
        <div>
          <strong>{formatNSBalance(batch.votingPower)} Votes</strong>
        </div>
      </div>

      <div className="batch-status">
        <div>{getStatusText()}</div>
      </div>

      {batch.isStaked && (
        <div className="batch-actions">
          {!batch.isCooldownRequested && (
            <div className="button-group">
              <button onClick={() => setShowRequestUnstakeModal(true)}>
                Request Unstake
              </button>
              <button onClick={() => setShowLockModal(true)}>Lock</button>
            </div>
          )}
          {batch.isCooldownOver && (
            <button onClick={() => setShowUnstakeModal(true)}>
              Unstake Now
            </button>
          )}
          {/* TODO: add extend lock duration for locked batches if < max months */}
        </div>
      )}

      {showLockModal && (
        <LockBatchModal batch={batch} onClose={() => setShowLockModal(false)} />
      )}

      {showRequestUnstakeModal && (
        <RequestUnstakeBatchModal
          batch={batch}
          onClose={() => setShowRequestUnstakeModal(false)}
        />
      )}

      {showUnstakeModal && (
        <UnstakeBatchModal
          batch={batch}
          onClose={() => setShowUnstakeModal(false)}
        />
      )}
    </div>
  );
}

function StakeModal({
  mode,
  onClose,
  onModeChange,
  availableNS,
}: {
  mode: "stake" | "lock";
  onClose: () => void;
  onModeChange: (mode: "stake" | "lock") => void;
  availableNS: bigint;
}) {
  const { mutateAsync: stakeOrLock, isSuccess } = useStakeOrLockMutation({
    onError: (error) => {
      toast.error(error.message || "Failed to stake tokens");
      onClose();
    },
  });
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState(mode === "lock" ? 1 : 0);

  useEffect(() => {
    setMonths(mode === "lock" ? 1 : 0);
  }, [mode]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        `Successfully ${mode === "lock" ? "locked" : "staked"} tokens`,
      );
      onClose();
    }
  }, [isSuccess, onClose, mode]);

  const votes = stakingBatchHelpers.calculateLockedVotingPower({
    balance: parseNSAmount(amount),
    lockMonths: months,
  });
  const actionText = mode === "lock" ? "Lock Tokens" : "Stake Tokens";

  return (
    <Modal>
      <ModalHeader
        title={`${mode === "lock" ? "Lock" : "Stake"} Tokens`}
        onClose={onClose}
      />

      <p>
        Stake your NS tokens to receive Votes, which increases over time, with
        an immediate boost based on a lockup period of 1-12 months.
      </p>

      <div className="radio-group">
        <label>
          <input
            type="radio"
            checked={mode === "stake"}
            onChange={() => onModeChange("stake")}
          />
          Stake
        </label>

        <label>
          <input
            type="radio"
            checked={mode === "lock"}
            onChange={() => onModeChange("lock")}
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

      {mode === "lock" && (
        <div className="box">
          <MonthSelector months={months} setMonths={setMonths} />
        </div>
      )}

      <div>
        <div>Votes {formatNSBalance(votes)}</div>
      </div>

      <ModalFooter
        onClose={onClose}
        actionText={actionText}
        onAction={() => stakeOrLock({ amount, months })}
      />
    </Modal>
  );
}

function LockBatchModal({
  batch,
  onClose,
}: {
  batch: StakingBatch;
  onClose: () => void;
}) {
  const { mutateAsync: lockBatch, isSuccess } = useLockMutation({
    onError: (error) => {
      toast.error(error.message || "Failed to lock batch");
      onClose();
    },
  });
  const [months, setMonths] = useState(1);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully locked tokens");
      onClose();
    }
  }, [isSuccess, onClose]);

  const votes = stakingBatchHelpers.calculateLockedVotingPower({
    balance: batch.balanceNS,
    lockMonths: months,
  });
  const daysSinceStake = Math.floor(
    (Date.now() - batch.startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <Modal>
      <ModalHeader title="Lock Tokens" onClose={onClose} />

      <p>
        Lock your already Staked NS tokens to receive an immediate Votes
        multiplier.
      </p>

      <div className="box">
        <div>Staked for {daysSinceStake} Days</div>
        <div>{formatNSBalance(batch.balanceNS)} NS</div>
        <div>Votes {formatNSBalance(batch.votingPower)}</div>
      </div>

      <div>
        <div>Select Lock Period</div>
        <div className="box">
          <MonthSelector months={months} setMonths={setMonths} />
        </div>
      </div>

      <div>
        <div>Votes {formatNSBalance(votes)}</div>
      </div>

      <ModalFooter
        onClose={onClose}
        actionText="Lock Tokens"
        onAction={() => lockBatch({ batchId: batch.objectId, months })}
      />
    </Modal>
  );
}

function RequestUnstakeBatchModal({
  batch,
  onClose,
}: {
  batch: StakingBatch;
  onClose: () => void;
}) {
  const { mutateAsync: requestUnstake, isSuccess } = useRequestUnstakeMutation({
    onError: (error) => {
      toast.error(error.message || "Failed to request cooldown");
      onClose();
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully initiated cooldown");
      onClose();
    }
  }, [isSuccess, onClose]);

  return (
    <Modal>
      <ModalHeader title="Request Unstake" onClose={onClose} />

      <p>Unstaking initiates a 3-day cooldown period.</p>

      <div className="box">
        <div>{formatNSBalance(batch.balanceNS)} NS</div>
        <div>Votes: {formatNSBalance(batch.votingPower)}</div>
        <div>Started: {batch.startDate.toLocaleDateString()}</div>
      </div>

      <ModalFooter
        onClose={onClose}
        actionText="Start Cooldown"
        onAction={() => requestUnstake({ batchId: batch.objectId })}
      />
    </Modal>
  );
}

function UnstakeBatchModal({
  batch,
  onClose,
}: {
  batch: StakingBatch;
  onClose: () => void;
}) {
  const { mutateAsync: unstake, isSuccess } = useUnstakeMutation({
    onError: (error) => {
      toast.error(error.message || "Failed to unstake batch");
      onClose();
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully unstaked");
      onClose();
    }
  }, [isSuccess, onClose]);

  return (
    <Modal>
      <ModalHeader title="Unstake Batch" onClose={onClose} />

      <p>Destroy the batch and get your NS back.</p>

      <div className="box">
        <div>{formatNSBalance(batch.balanceNS)} NS</div>
        <div>Votes: {formatNSBalance(batch.votingPower)}</div>
        <div>Started: {batch.startDate.toLocaleDateString()}</div>
      </div>

      <ModalFooter
        onClose={onClose}
        actionText="Unstake"
        onAction={() => unstake({ batchId: batch.objectId })}
      />
    </Modal>
  );
}

function PanelParticipation({}: {}) {
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
