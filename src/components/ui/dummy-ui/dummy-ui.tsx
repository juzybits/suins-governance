"use client";

import { type ReactNode } from "react";

export function Modal({ children }: { children: ReactNode }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">{children}</div>
    </div>
  );
}

export function ModalHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="modal-header">
      <h2>{title}</h2>
      <button onClick={onClose} className="modal-close-button">
        ×
      </button>
    </div>
  );
}

export function ModalFooter({
  onClose,
  actionText,
  onAction,
}: {
  onClose: () => void;
  actionText: string;
  onAction: () => void;
}) {
  return (
    <div className="modal-footer button-group">
      <button onClick={onClose}>Cancel</button>
      <button onClick={onAction}>{actionText}</button>
    </div>
  );
}

export function MonthSelector({
  months,
  setMonths,
}: {
  months: number;
  setMonths: (months: number) => void;
}) {
  const monthOptions = [1, 2, 6, 12];

  return (
    <select
      value={months}
      onChange={(e) => setMonths(parseInt(e.target.value))}
    >
      {monthOptions.map((month) => (
        <option key={month} value={month}>
          {month} month{month === 1 ? "" : "s"}
        </option>
      ))}
    </select>
  );
}
