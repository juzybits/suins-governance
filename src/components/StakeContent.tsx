"use client";

import { SuiObjectResponse } from "@mysten/sui/client";
import { useCurrentAccount } from "@mysten/dapp-kit";
import React, { ReactNode, useState } from "react";

type TokenData = {
  locked: number;
  staked: number;
  available: number;
  power: number;
};

export function StakeContent({
  stakeBatches,
}: {
  stakeBatches: SuiObjectResponse[];
}) {
  const currAcct = useCurrentAccount();
  const currAddr = currAcct?.address ?? null;

  const [tokenData] = useState<TokenData>({
    locked: 1000,
    staked: 2000,
    available: 4063,
    power: 3500,
  });

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <PanelOverview tokenData={tokenData} />
      <PanelStake tokenData={tokenData} />
      <PanelParticipation currAddr={currAddr} />
    </div>
  );
}

function PanelOverview({
  tokenData,
}: {
  tokenData: TokenData;
}) {
  const { locked, staked, available, power } = tokenData;
  return (
    <Panel>
      <div>
        <p>Total Locked: {locked} NS (X Votes)</p>
      </div>
      <div>
        <p>Total Staked: {staked} NS (X Votes)</p>
      </div>
      <div>
        <p>Available Tokens: {available} NS</p>
      </div>
      <div>
        <p>Your Total Votes: {power}</p>
      </div>
    </Panel>
  );
}

function PanelStake({
  tokenData,
}: {
  tokenData: TokenData;
}) {
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeMode, setStakeMode] = useState<"stake" | "lock">("stake");
  const batches: { id: string }[] = [];

  const onOpenStakeModal = (mode: "stake" | "lock") => {
    setStakeMode(mode);
    setShowStakeModal(true);
  };

  return (
    <Panel>
      <H2>Staked & Locked (count: {batches.length})</H2>
      {batches.length === 0 ? (
        <div>
          <H3>No Stakes or Locks</H3>
          <p>Start Staking your SUI to Participate in governance, earn rewards, and shape the future of SuiNS</p>
          <Btn onClick={() => onOpenStakeModal("stake")}>Stake</Btn>
          <Btn onClick={() => onOpenStakeModal("lock")}>Lock</Btn>
        </div>
      ) : (
        <div>
          {batches.map((batch) => (
            <div key={batch.id}>{batch.id}</div>
          ))}
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
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState(1);

  const calculateVotes = () => 0;
  const votes = calculateVotes();

  const onStakeOrLock = () => {
    onClose();
  };

  return (
    <PopUp>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <H2>Stake or Lock Tokens</H2>
        <button onClick={onClose}>×</button>
      </div>

      <p>Stake your NS tokens to receive Votes, which increases over time, with an immediate boost based on a lockup period of 1-12 months.</p>

      <div style={{ padding: "5px 0" }}>
        <label>
          <input
            type="radio"
            checked={mode === "stake"}
            onChange={() => onModeChange("stake")}
          />
          Stake
        </label>

        <label style={{ marginLeft: "5px" }}>
          <input
            type="radio"
            checked={mode === "lock"}
            onChange={() => onModeChange("lock")}
          />
          Lock
        </label>
      </div>

      <div style={{ padding: "5px 0" }}>
        <div>
          <InputText
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <span>/{availableAmount} NS</span>
        </div>

        <div>
          <span>Votes: {votes}</span>
        </div>
      </div>

      <div style={{ padding: "5px 0" }}>
        <label>{mode === "lock" ? "Lock Period" : "Stake Period"}</label>
        <select
          value={months}
          onChange={(e) => setMonths(parseInt(e.target.value))}
        >
          <option value="1">1 month</option>
          <option value="2">2 months</option>
          <option value="3">3 months</option>
          <option value="4">4 months</option>
          <option value="5">5 months</option>
          <option value="6">6 months</option>
          <option value="7">7 months</option>
          <option value="8">8 Months</option>
          <option value="9">9 Months</option>
          <option value="10">10 Months</option>
          <option value="11">11 Months</option>
          <option value="12">12 Months</option>
        </select>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn onClick={onStakeOrLock}>{mode === "lock" ? "Lock Tokens" : "Stake Tokens"}</Btn>
      </div>
    </PopUp>
  );
}

function PanelParticipation({
  currAddr,
}: {
  currAddr: string | null;
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
      border: "1px solid #ccc",
      borderRadius: "5px",
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
        borderRadius: "4px",
        backgroundColor: "#f5f5f5",
        cursor: "pointer"
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
        borderRadius: "5px",
        width: "90%",
        maxWidth: "450px",
        color: "#333",
      }}>
        {children}
      </div>
    </div>
  );
}
