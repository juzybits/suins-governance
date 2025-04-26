"use client";

import { ONE_NS_RAW } from "@/constants/common";
import { batchHelpers } from "@/types/Batch";
import { type ReactNode, useEffect, useState } from "react";

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

const allMonthOptions = [1, 2, 6, 12];

export function MonthSelector({
  months,
  setMonths,
  currentMonths,
}: {
  months: number;
  setMonths: (months: number) => void;
  currentMonths: number;
}) {
  const [validMonths, setValidMonths] = useState<number[]>([]);

  useEffect(() => {
    const newValidMonths = allMonthOptions.filter(
      (month) => month > currentMonths,
    );
    setValidMonths(newValidMonths);

    const firstValidMonth = newValidMonths[0];
    if (firstValidMonth !== undefined) {
      setMonths(firstValidMonth);
    }
  }, [currentMonths, setMonths]);

  return (
    <select
      value={months}
      onChange={(e) => setMonths(parseInt(e.target.value))}
    >
      {validMonths.map((month) => {
        const multiplier = batchHelpers.calculateLockedVotingPower({
          balance: BigInt(ONE_NS_RAW),
          lockMonths: month,
        });
        const multiplierStr = (Number(multiplier) / ONE_NS_RAW).toFixed(2);
        return (
          <option key={month} value={month}>
            {month * 30} days ({multiplierStr}x)
          </option>
        );
      })}
    </select>
  );
}
