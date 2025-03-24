"use client";

import React, { ReactNode, useState, useMemo, useEffect } from "react";
import { StakingBatchWithVotingPower } from "@/hooks/staking/useGetStakingBatches";
import { useStakeMutation } from "@/hooks/staking/useStakeMutation";
import { useLockMutation } from "@/hooks/staking/useLockMutation";
import { useUnstakeMutation } from "@/hooks/staking/useUnstakeMutation";
import { toast } from "sonner";

type StakingData = {
  lockedNS: number;
  lockedPower: number;
  stakedNS: number;
  stakedPower: number;
  totalPower: number;
  availableNS: number;
};

export function StakeContent({
  stakeBatches,
}: {
  stakeBatches: StakingBatchWithVotingPower[];
}) {
  const stakingData = useMemo((): StakingData => {
    let lockedNS = 0;
    let lockedPower = 0;
    let stakedNS = 0;
    let stakedPower = 0;
    let totalPower = 0;

    stakeBatches.forEach(batch => {
      if (batch.isLocked) {
        lockedNS += batch.amountNS;
        lockedPower += batch.votingPower;
      } else if (batch.isStaked) {
        stakedNS += batch.amountNS;
        stakedPower += batch.votingPower;
      }
      totalPower += batch.votingPower;
    });

    const availableNS = 1000; // TODO: get from wallet

    return { lockedNS, lockedPower, stakedNS, stakedPower, totalPower, availableNS };
  }, [stakeBatches]);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <PanelOverview stakingData={stakingData} />
      <PanelStake stakeBatches={stakeBatches} stakingData={stakingData} />
      <PanelParticipation />
    </div>
  );
}

function PanelOverview({
  stakingData,
}: {
  stakingData: StakingData;
}) {
  const { lockedNS, lockedPower, stakedNS, stakedPower, totalPower, availableNS } = stakingData;

  return (
    <Panel>
      <div>
        <p>Total Locked: {lockedNS.toLocaleString()} NS ({lockedPower.toLocaleString()} Votes)</p>
      </div>
      <div>
        <p>Total Staked: {stakedNS.toLocaleString()} NS ({stakedPower.toLocaleString()} Votes)</p>
      </div>
      <div>
        <p>Available Tokens: {availableNS.toLocaleString()} NS</p>
      </div>
      <div>
        <p>Your Total Votes: {totalPower.toLocaleString()}</p>
      </div>
    </Panel>
  );
}

function PanelStake({
  stakeBatches,
  stakingData,
}: {
  stakeBatches: StakingBatchWithVotingPower[];
  stakingData: StakingData;
}) {
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeMode, setStakeMode] = useState<"stake" | "lock">("stake");

  const onOpenStakeModal = (mode: "stake" | "lock") => {
    setStakeMode(mode);
    setShowStakeModal(true);
  };

  const buttons = <>
    <Btn onClick={() => onOpenStakeModal("stake")}>Stake</Btn>
    <Btn onClick={() => onOpenStakeModal("lock")}>Lock</Btn>
  </>;

  return (
    <Panel>
      <H2>Staked & Locked (count: {stakeBatches.length})</H2>
      {stakeBatches.length === 0 ? (
        <div>
          <H3>No Stakes or Locks</H3>
          <p>Start Staking your NS to participate in governance, earn rewards, and shape the future of SuiNS</p>
          {buttons}
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: "10px" }}>
            {buttons}
          </div>
          {stakeBatches.map((batch) => (
            <BatchCard key={batch.objectId} batch={batch} />
          ))}
        </div>
      )}

      {showStakeModal && (
        <StakeModal
          mode={stakeMode}
          onClose={() => setShowStakeModal(false)}
          onModeChange={setStakeMode}
          availableNS={stakingData.availableNS}
        />
      )}
    </Panel>
  );
}

function BatchCard({ batch }: { batch: StakingBatchWithVotingPower }) {
  const [showLockModal, setShowLockModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);

  const status = batch.isLocked
    ? "Locked"
    : batch.isInCooldown
    ? "Cooling Down"
    : batch.isVoting
    ? "Voting"
    : "Staked";

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusText = () => {
    if (batch.isLocked) {
      return `Locked for ${batch.lockDurationDays} Days`;
    } else if (batch.isInCooldown) {
      return `Cooling Down`;
    } else if (batch.isVoting) {
      return `Used for Voting`;
    } else {
      const daysSinceStake = Math.floor((Date.now() - batch.startDate.getTime()) / (1000 * 60 * 60 * 24));
      return `Staked for ${daysSinceStake} Days`;
    }
  };

  const getInfoText = () => {
    if (batch.isLocked) {
      return `Unlocks: ${formatDate(batch.unlockDate)}`;
    } else if (batch.isInCooldown) {
      return `Cooldown ends: ${formatDate(batch.cooldownEndDate!)}`;
    } else {
      return `Started: ${formatDate(batch.startDate)}`;
    }
  };

  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "10px",
      marginBottom: "10px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <strong>{batch.amountNS.toLocaleString()} NS</strong>
        </div>
        <div>
          <strong>{Math.floor(batch.votingPower).toLocaleString()} Votes</strong>
        </div>
      </div>

      <div style={{
        fontSize: "14px",
        marginTop: "10px",
        color: "#666",
      }}>
        <div>Status: {getStatusText()}</div>
        <div>{getInfoText()}</div>
      </div>

      {status === "Staked" && (
        <div style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "flex-end"
        }}>
          <Btn onClick={() => setShowLockModal(true)}>Lock</Btn>
          <Btn onClick={() => setShowUnstakeModal(true)}>Unstake</Btn>
        </div>
      )}

      {showLockModal && (
        <LockBatchModal
          batch={batch}
          onClose={() => setShowLockModal(false)}
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

function LockBatchModal({
  batch,
  onClose,
}: {
  batch: StakingBatchWithVotingPower;
  onClose: () => void;
}) {
  const { mutateAsync: lockBatch, isSuccess } = useLockMutation({
    onError: (error) => {
      toast.error(error.message || "Failed to lock batch");
      onClose();
    }
  });
  const [months, setMonths] = useState(1);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully locked tokens");
      onClose();
    }
  }, [isSuccess, onClose]);

  const calculateVotes = () => 123456; // TODO
  const votes = calculateVotes();
  const daysSinceStake = Math.floor((Date.now() - batch.startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Modal>
      <ModalHeader title="Lock Tokens" onClose={onClose} />

      <p>Lock your already Staked NS tokens to receive an immediate Votes multiplier.</p>

      <div style={{ padding: "10px", border: "1px solid #ddd", margin: "10px 0" }}>
        <div>Staked for {daysSinceStake} Days</div>
        <div>{batch.amountNS.toLocaleString()} NS</div>
        <div>Votes {Math.floor(batch.votingPower).toLocaleString()}</div>
      </div>

      <div>
        <div>Select Lock Period</div>
        <div style={{
          padding: "10px",
          border: "1px solid #ddd",
          margin: "10px 0",
          display: "flex",
          justifyContent: "space-between"
        }}>
          <MonthSelector months={months} setMonths={setMonths} />
        </div>
      </div>

      <div>
        <div>Votes {votes.toLocaleString()}</div>
      </div>

      <ModalFooter
        onClose={onClose}
        actionText="Lock Tokens"
        onAction={() => lockBatch({ batchId: batch.objectId, months })}
      />
    </Modal>
  );
}

function UnstakeBatchModal({
  batch,
  onClose,
}: {
  batch: StakingBatchWithVotingPower;
  onClose: () => void;
}) {
  const { mutateAsync: requestUnstake, isSuccess } = useUnstakeMutation({
    onError: (error) => {
      toast.error(error.message || "Failed to unstake batch");
      onClose();
    }
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully initiated unstaking");
      onClose();
    }
  }, [isSuccess, onClose]);

  return (
    <Modal>
      <ModalHeader title="Unstake Tokens" onClose={onClose} />

      <p>Unstaking initiates a 3-day cooldown period.</p>

      <div style={{ padding: "10px", border: "1px solid #ddd", margin: "10px 0" }}>
        <div>{batch.amountNS.toLocaleString()} NS</div>
        <div>Votes: {Math.floor(batch.votingPower).toLocaleString()}</div>
        <div>Started: {batch.startDate.toLocaleDateString()}</div>
      </div>

      <ModalFooter
        onClose={onClose}
        actionText="Confirm Unstake"
        onAction={() => requestUnstake({ batchId: batch.objectId })}
      />
    </Modal>
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
  availableNS: number;
}) {
  const { mutateAsync: stakeOrLock, isSuccess } = useStakeMutation({
    onError: (error) => {
      toast.error(error.message || "Failed to stake tokens");
      onClose();
    }
  });

  const [amount, setAmount] = useState("100");
  const [months, setMonths] = useState(mode === "lock" ? 1 : 0);

  useEffect(() => {
    setMonths(mode === "lock" ? 1 : 0);
  }, [mode]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(`Successfully ${mode === "lock" ? "locked" : "staked"} tokens`);
      onClose();
    }
  }, [isSuccess, onClose, mode]);

  const calculateVotes = () => 123456; // TODO
  const votes = calculateVotes();
  const actionText = mode === "lock" ? "Lock Tokens" : "Stake Tokens";

  return (
    <Modal>
      <ModalHeader title={`${mode === "lock" ? "Lock" : "Stake"} Tokens`} onClose={onClose} />

      <p>Stake your NS tokens to receive Votes, which increases over time, with an immediate boost based on a lockup period of 1-12 months.</p>

      <div style={{ margin: "15px 0" }}>
        <label style={{ marginRight: "15px" }}>
          <input
            type="radio"
            checked={mode === "stake"}
            onChange={() => onModeChange("stake")}
            style={{ marginRight: "5px" }}
          />
          Stake
        </label>

        <label>
          <input
            type="radio"
            checked={mode === "lock"}
            onChange={() => onModeChange("lock")}
            style={{ marginRight: "5px" }}
          />
          Lock
        </label>
      </div>

      <div style={{
        border: "1px solid #ddd",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        margin: "10px 0"
      }}>
        <div>
          <InputText
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          /{availableNS.toLocaleString()} NS
        </div>

        {mode === "lock" && (
          <div>
            <MonthSelector months={months} setMonths={setMonths} />
          </div>
        )}
      </div>

      <div>
        <div>Votes {votes.toLocaleString()}</div>
      </div>

      <ModalFooter
        onClose={onClose}
        actionText={actionText}
        onAction={() => stakeOrLock({ amount, months })}
      />
    </Modal>
  );
}

function PanelParticipation({
}: {
}) {
  const votes: { id: string }[] = [];
  return (
    <Panel>
      <H2>Your Governance Participation</H2>
      {votes.length === 0 ? (
        <div>
          <H3>No Votes</H3>
          <p>Once you start voting, your participation will be showcased here</p>
        </div>
      ) : (
        <div>
          {votes.map((vote) => (
            <div key={vote.id}>{vote.id}</div>
          ))}
        </div>
      )}
    </Panel>
  );
}

// basic styled components, to be replaced with a pretty UI

function Panel({ children }: { children: ReactNode }) {
  return (
    <div style={{
      padding: "20px",
      margin: "10px 0",
      backgroundColor: "#fff",
      color: "#333"
    }}>
      {children}
    </div>
  );
}

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 style={{
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "10px"
    }}>
      {children}
    </h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return (
    <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>
      {children}
    </h3>
  );
}

function Btn({
  children,
  onClick,
}: {
  children: ReactNode,
  onClick?: () => void,
}) {
  return (
    <button
      style={{
        padding: "8px 16px",
        border: "1px solid #ddd",
        backgroundColor: "#f5f5f5",
        marginRight: "8px",
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function InputText({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      style={{
        padding: "2px 8px",
        border: "1px solid #ccc",
      }}
    />
  );
}

function Modal({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <div style={{
        backgroundColor: "#fff",
        padding: "20px",
        width: "90%",
        maxWidth: "450px",
        color: "#333",
      }}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <H2>{title}</H2>
      <button onClick={onClose}>×</button>
    </div>
  );
}

function ModalFooter({ onClose, actionText, onAction }: { onClose: () => void; actionText: string; onAction: () => void }) {
  return (
    <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
      <Btn onClick={onClose}>Cancel</Btn>
      <Btn onClick={onAction}>{actionText}</Btn>
    </div>
  );
}

function MonthSelector({ months, setMonths }: { months: number; setMonths: (months: number) => void }) {
  return (
    <select
      value={months}
      onChange={(e) => setMonths(parseInt(e.target.value))}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <option key={i + 1} value={i + 1}>{i + 1} month{i + 1 === 1 ? "" : "s"}</option>
      ))}
    </select>
  );
}
