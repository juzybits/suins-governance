"use client";

import React, { ReactNode } from "react";

// basic styled components, to be replaced with a pretty UI

export function Panel({ children }: { children: ReactNode }) {
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

export function H2({ children }: { children: ReactNode }) {
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

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>
      {children}
    </h3>
  );
}

export function Btn({
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

export function InputText({
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

export function Modal({
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

export function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <H2>{title}</H2>
      <button onClick={onClose}>×</button>
    </div>
  );
}

export function ModalFooter({ onClose, actionText, onAction }: { onClose: () => void; actionText: string; onAction: () => void }) {
  return (
    <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
      <Btn onClick={onClose}>Cancel</Btn>
      <Btn onClick={onAction}>{actionText}</Btn>
    </div>
  );
}

export function MonthSelector({ months, setMonths }: { months: number; setMonths: (months: number) => void }) {
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
