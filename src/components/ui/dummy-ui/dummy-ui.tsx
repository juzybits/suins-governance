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

const monthOptions = [1, 2, 6, 12] as const;

export function MonthSelector({
  months,
  setMonths,
  currentMonths = 1,
}: {
  months: number;
  setMonths: (months: number) => void;
  currentMonths?: number;
}) {
  return (
    <select
      value={months}
      onChange={(e) => setMonths(parseInt(e.target.value))}
    >
      {monthOptions
        .filter((month) => month > currentMonths)
        .map((month) => (
          <option key={month} value={month}>
            {month * 30} days
          </option>
        ))}
    </select>
  );
}
