"use client";

import { type ReactNode, useEffect } from "react";

export function Modal({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-button">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export function ModalFooter({
  actionText,
  onClose,
  onAction,
}: {
  actionText: string;
  onClose: () => void;
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
