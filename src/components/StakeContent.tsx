"use client";

import React, { ReactNode, useState, useMemo, useEffect } from "react";
import { StakingBatch } from "@/hooks/staking/useGetStakingBatches";
import { useStakeOrLockMutation } from "@/hooks/staking/useStakeOrLockMutation";
import { useLockMutation } from "@/hooks/staking/useLockMutation";
import { useRequestUnstakeMutation } from "@/hooks/staking/useRequestUnstakeMutation";
import { toast } from "sonner";
import { formatNSBalance } from "@/utils/formatNumber";
import { stakingBatchHelpers } from "@/utils/stakingBatchHelpers";
import { parseNSAmount } from "@/utils/parseAmount";
import { useUnstakeMutation } from "@/hooks/staking/useUnstakeMutation";

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

    batches.forEach(batch => {
      if (batch.isLocked) {
        lockedNS += batch.balanceNS;
        lockedPower += batch.votingPower;
      } else if (batch.isStaked) {
        stakedNS += batch.balanceNS;
        stakedPower += batch.votingPower;
      }
      totalPower += batch.votingPower;
    });

    return { lockedNS, lockedPower, stakedNS, stakedPower, totalPower, availableNS };
  }, [batches]);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <PanelOverview stakingData={stakingData} />
      <PanelStake batches={batches} stakingData={stakingData} />
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
        <p>Total Locked: {formatNSBalance(lockedNS)} NS ({formatNSBalance(lockedPower)} Votes)</p>
      </div>
      <div>
        <p>Total Staked: {formatNSBalance(stakedNS)} NS ({formatNSBalance(stakedPower)} Votes)</p>
      </div>
      <div>
        <p>Available Tokens: {formatNSBalance(availableNS)} NS</p>
      </div>
      <div>
        <p>Your Total Votes: {formatNSBalance(totalPower)}</p>
      </div>
    </Panel>
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

  const buttons = <>
    <Btn onClick={() => onOpenStakeModal("stake")}>Stake</Btn>
    <Btn onClick={() => onOpenStakeModal("lock")}>Lock</Btn>
  </>;

  return (
    <Panel>
      <H2>Staked & Locked (count: {batches.length})</H2>
      {batches.length === 0 ? (
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
          {batches.map((batch) => (
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
      const daysSinceStake = Math.floor((Date.now() - batch.startDate.getTime()) / (1000 * 60 * 60 * 24));
      return `Staked for ${daysSinceStake} Days`;
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
          <strong>{formatNSBalance(batch.balanceNS)} NS</strong>
        </div>
        <div>
          <strong>{formatNSBalance(batch.votingPower)} Votes</strong>
        </div>
      </div>

      <div style={{
        fontSize: "14px",
        marginTop: "10px",
        color: "#666",
      }}>
        <div>{getStatusText()}</div>
      </div>

      {batch.isStaked && (
        <div style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "flex-end"
        }}>
          {!batch.isCooldownRequested && <>
            <Btn onClick={() => setShowRequestUnstakeModal(true)}>Request Unstake</Btn>
            <Btn onClick={() => setShowLockModal(true)}>Lock</Btn>
          </>}
          {batch.isCooldownOver &&
            <Btn onClick={() => setShowUnstakeModal(true)}>Unstake Now</Btn>
          }
        </div>
      )}

      {showLockModal && (
        <LockBatchModal
          batch={batch}
          onClose={() => setShowLockModal(false)}
        />
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
    }
  });
  const [amount, setAmount] = useState("");
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

  const votes = stakingBatchHelpers.calculateLockedVotingPower({
    balance: parseNSAmount(amount),
    lockMonths: months,
  });
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
          /{formatNSBalance(availableNS)} NS
        </div>

        {mode === "lock" && (
          <div>
            <MonthSelector months={months} setMonths={setMonths} />
          </div>
        )}
      </div>

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
    }
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
  const daysSinceStake = Math.floor((Date.now() - batch.startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Modal>
      <ModalHeader title="Lock Tokens" onClose={onClose} />

      <p>Lock your already Staked NS tokens to receive an immediate Votes multiplier.</p>

      <div style={{ padding: "10px", border: "1px solid #ddd", margin: "10px 0" }}>
        <div>Staked for {daysSinceStake} Days</div>
        <div>{formatNSBalance(batch.balanceNS)} NS</div>
        <div>Votes {formatNSBalance(batch.votingPower)}</div>
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
    }
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

      <div style={{ padding: "10px", border: "1px solid #ddd", margin: "10px 0" }}>
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
    }
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

      <div style={{ padding: "10px", border: "1px solid #ddd", margin: "10px 0" }}>
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
