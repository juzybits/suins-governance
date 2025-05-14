"use client";

import { ONE_NS_RAW } from "@/constants/common";
import { batchHelpers } from "@/types/Batch";
import { formatNSBalance } from "@/utils/formatNumber";
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

export function LockSelector({
  balance,
  months,
  setMonths,
  currentMonths,
}: {
  balance: bigint;
  months: number;
  setMonths: (months: number) => void;
  currentMonths: number;
}) {
  const validMonths = allMonthOptions.filter(
    (month) => month > currentMonths,
  );

  return (
    <div className="dummy-table">
      <div className="table-header">
        <div>Selection</div>
        <div>Vote Multiplier</div>
        <div>Votes</div>
      </div>

      {validMonths.map((monthSelection) => {
        const power = batchHelpers.calculateBalanceVotingPower({
          balance,
          months: monthSelection,
          mode: "lock",
        });
        const multiplier =
          Number(
            batchHelpers.calculateBalanceVotingPower({
              balance: BigInt(ONE_NS_RAW),
              months: monthSelection,
              mode: "lock",
            }),
          ) / ONE_NS_RAW;
        const days = monthSelection * 30;
        return (
          <div key={monthSelection} className="table-row">
            <div>
              <label>
                <input
                  type="radio"
                  checked={monthSelection === months}
                  onChange={() => setMonths(monthSelection)}
                />
                {days} days
              </label>
            </div>
            <div>{multiplier.toFixed(2)}x</div>
            <div>{formatNSBalance(power)}</div>
          </div>
        );
      })}
    </div>
  );
}
