"use client";

import { SUINS_PACKAGES } from "@/constants/endpoints";
import React, { ReactNode, useState, useMemo, useEffect } from "react";
import { StakingBatchWithVotingPower } from "@/hooks/staking/useGetStakingBatches";
import { useStakeMutation } from "@/hooks/staking/useStakeMutation";
import { useLockMutation } from "@/hooks/staking/useLockMutation";

export function StakeContent({
  stakeBatches,
}: {
  stakeBatches: StakingBatchWithVotingPower[];
}) {
  const tokenData = useMemo(() => {
    let locked = 0;
    let staked = 0;
    let power = 0;

    stakeBatches.forEach(batch => {
      if (batch.isLocked) {
        locked += batch.amountNS;
      } else if (batch.isStaked) {
        staked += batch.amountNS;
      }
      power += batch.votingPower;
    });

    const available = 1000; // TODO: get from wallet

    return { locked, staked, available, power };
  }, [stakeBatches]);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <PanelOverview tokenData={tokenData} />
      <PanelStake stakeBatches={stakeBatches} tokenData={tokenData} />
      <PanelParticipation />
    </div>
  );
}

function PanelOverview({
  tokenData,
}: {
  tokenData: { locked: number; staked: number; available: number; power: number; };
}) {
  const { locked, staked, available, power } = tokenData;
  const lockedVotesText = locked > 0 ? `(${Math.round(power * (locked / (locked + staked)))} Votes)` : "(0 Votes)";
  const stakedVotesText = staked > 0 ? `(${Math.round(power * (staked / (locked + staked)))} Votes)` : "(0 Votes)";

  return (
    <Panel>
      <div>
        <p>Total Locked: {locked.toLocaleString()} NS {lockedVotesText}</p>
      </div>
      <div>
        <p>Total Staked: {staked.toLocaleString()} NS {stakedVotesText}</p>
      </div>
      <div>
        <p>Available Tokens: {available.toLocaleString()} NS</p>
      </div>
      <div>
        <p>Your Total Votes: {power.toLocaleString()}</p>
      </div>
    </Panel>
  );
}

function PanelStake({
  stakeBatches,
  tokenData,
}: {
  stakeBatches: StakingBatchWithVotingPower[];
  tokenData: { locked: number; staked: number; available: number; power: number; };
}) {
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeMode, setStakeMode] = useState<"stake" | "lock">("stake");

  const onOpenStakeModal = (mode: "stake" | "lock") => {
    setStakeMode(mode);
    setShowStakeModal(true);
  };

  return (
    <Panel>
      <H2>Staked & Locked (count: {stakeBatches.length})</H2>
      {stakeBatches.length === 0 ? (
        <div>
          <H3>No Stakes or Locks</H3>
          <p>Start Staking your NS to participate in governance, earn rewards, and shape the future of SuiNS</p>
          <Btn onClick={() => onOpenStakeModal("stake")}>Stake</Btn>
          <Btn onClick={() => onOpenStakeModal("lock")}>Lock</Btn>
        </div>
      ) : (
        <div>
          {stakeBatches.map((batch) => (
            <BatchCard key={batch.objectId} batch={batch} />
          ))}
          <div style={{ marginTop: "10px" }}>
            <Btn onClick={() => onOpenStakeModal("stake")}>Stake More</Btn>
            <Btn onClick={() => onOpenStakeModal("lock")}>Lock More</Btn>
          </div>
        </div>
      )}

      {showStakeModal && (
        <StakeModal
          mode={stakeMode}
          onClose={() => setShowStakeModal(false)}
          onModeChange={setStakeMode}
          availableAmount={tokenData.available}
        />
      )}
    </Panel>
  );
}

function BatchCard({ batch }: { batch: StakingBatchWithVotingPower }) {
  const [showLockModal, setShowLockModal] = useState(false);

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

  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "10px",
      marginBottom: "10px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <strong>{batch.amountNS.toLocaleString()} NS</strong>
          <span style={{ marginLeft: "8px", color: "#666" }}>({status})</span>
        </div>
        <div>
          <strong>{Math.floor(batch.votingPower).toLocaleString()} Votes</strong>
        </div>
      </div>

      <div style={{
        fontSize: "14px",
        marginTop: "5px",
        color: "#666",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          {status === "Locked" ? (
            <>Unlocks: {formatDate(batch.unlockDate)}</>
          ) : status === "Cooling Down" ? (
            <>Cooldown ends: {formatDate(batch.cooldownEndDate!)}</>
          ) : (
            <>Started: {formatDate(batch.startDate)}</>
          )}
        </div>

        {status === "Staked" && (
          <Btn onClick={() => setShowLockModal(true)}>Lock</Btn>
        )}
      </div>

      {showLockModal && (
        <LockBatchModal
          batch={batch}
          onClose={() => setShowLockModal(false)}
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
  const { mutateAsync: lockBatch } = useLockMutation();
  const [months, setMonths] = useState(1);

  const calculateVotes = () => 123456; // TODO

  const votes = calculateVotes();

  const onLockBatch = async () => {
    try {
      await lockBatch({
        batchId: batch.objectId,
        months
      });
      onClose();
    } catch (error) {
      console.error("Failed to lock batch:", error);
    }
  };

  return (
    <PopUp>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <H2>Lock Tokens</H2>
        <button onClick={onClose}>×</button>
      </div>

      <p>Lock your already Staked NS tokens to receive an immediate Votes multiplier.</p>

      <div style={{ padding: "10px", border: "1px solid #ddd", margin: "10px 0" }}>
        <div>Staked for {Math.floor((Date.now() - batch.startDate.getTime()) / (1000 * 60 * 60 * 24))} Days</div>
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
          <select
            value={months}
            onChange={(e) => setMonths(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1} month{i + 1 === 1 ? "" : "s"}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div>Votes {votes.toLocaleString()}</div>
      </div>

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn onClick={onLockBatch}>Lock Tokens</Btn>
      </div>
    </PopUp>
  );
}

function StakeModal({
  mode,
  onClose,
  onModeChange,
  availableAmount,
}: {
  mode: "stake" | "lock";
  onClose: () => void;
  onModeChange: (mode: "stake" | "lock") => void;
  availableAmount: number;
}) {
  const { mutateAsync: stakeOrLock } = useStakeMutation();

  const [amount, setAmount] = useState("100");
  const [months, setMonths] = useState(mode === "lock" ? 1 : 0);

  useEffect(() => {
    setMonths(mode === "lock" ? 1 : 0);
  }, [mode]);

  const calculateVotes = () => 123456; // TODO
  const votes = calculateVotes();

  const onStakeOrLock = async () => {
    try {
      await stakeOrLock({ amount, months });
      onClose();
    } catch (error) {
      console.error("Failed to stake tokens:", error);
    }
  };

  return (
    <PopUp>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <H2>Stake or Lock Tokens</H2>
        <button onClick={onClose}>×</button>
      </div>

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
          /{availableAmount.toLocaleString()} NS
        </div>

        {mode === "lock" && (
          <div>
            <select
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} month{i + 1 === 1 ? "" : "s"}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <div>Votes {votes.toLocaleString()}</div>
      </div>

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn onClick={onStakeOrLock}>{mode === "lock" ? "Lock Tokens" : "Stake Tokens"}</Btn>
      </div>
    </PopUp>
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

function Btn({ children, onClick }: { children: ReactNode, onClick?: () => void }) {
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

function PopUp({
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
