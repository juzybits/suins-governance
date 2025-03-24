"use client";

import { SuiObjectResponse } from "@mysten/sui/client";
import { useCurrentAccount } from "@mysten/dapp-kit";
import React, { ReactNode } from "react";

export function StakeContent({
  stakeBatches,
}: {
  stakeBatches: SuiObjectResponse[];
}) {
  const currAcct = useCurrentAccount();
  const currAddr = currAcct?.address ?? null;
  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <PanelOverview currAddr={currAddr} />
      <PanelStake currAddr={currAddr} />
      <PanelParticipation currAddr={currAddr} />
    </div>
  );
}

function PanelOverview(
  {
    currAddr,
  }: {
    currAddr: string | null;
  }
) {
  const locked = 0;
  const staked = 0;
  const available = 0;
  const power = 0;
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
  currAddr,
}: {
  currAddr: string | null;
}) {
  const batches: { id: string }[] = [];
  return (
    <Panel>
      <H2>Staked & Locked (count: {batches.length})</H2>
      {batches.length === 0 ? (
        <div>
          <H3>No Stakes or Locks</H3>
          <p>Start Staking your SUI to Participate in governance, earn rewards, and shape the future of SuiNS</p>
          <Btn>Stake</Btn>
          <Btn>Lock</Btn>
        </div>
      ) : (
        <div>
          {batches.map((batch) => (
            <div key={batch.id}>{batch.id}</div>
          ))}
        </div>
      )}
    </Panel>
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
