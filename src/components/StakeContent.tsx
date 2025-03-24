"use client";

import { SuiObjectResponse } from "@mysten/sui/client";
import React, { ReactNode } from "react";

export function StakeContent({
  stakeBatches,
}: {
  stakeBatches: SuiObjectResponse[];
}) {
  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <PaneOverview />
      <PaneStake />
      <PaneParticipation />
    </div>
  );
}

function PaneOverview() {
  return (
    <Pane>
      <H2>Overview</H2>
      <Btn>OK</Btn>
    </Pane>
  );
}

function PaneStake() {
  return (
    <Pane>
      <H2>Stake</H2>
      <p>You can stake your tokens here.</p>
    </Pane>
  );
}

function PaneParticipation() {
  return (
    <Pane>
      <H2>Participation</H2>
      <p>View your governance participation details.</p>
    </Pane>
  );
}

// basic styled components

function Pane({ children }: { children: ReactNode }) {
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
