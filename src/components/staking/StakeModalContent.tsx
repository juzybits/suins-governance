import { useStakeModal } from "./StakeModalContext";
import { useStakeOrLockMutation } from "@/hooks/staking/useStakeOrLockMutation";
import { parseNSAmount } from "@/utils/parseAmount";
import { batchHelpers } from "@/types/Batch";
import {
  Modal,
  ModalFooter,
  LockMonthSelector,
} from "@/components/ui/legacy/dummy-ui/dummy-ui";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { formatNSBalance } from "@/utils/formatNumber";
import { DAY_MS, ONE_NS_RAW } from "@/constants/common";
import { useGetOwnedNSBalance } from "@/hooks/useGetOwnedNSBalance";
import { useCurrentAccount } from "@mysten/dapp-kit";

export function StakeModalContent() {
  const { modalAction, closeModal, openModal } = useStakeModal();

  const currAcct = useCurrentAccount();
  const currAddr = currAcct?.address;

  const balance = useGetOwnedNSBalance(currAddr);
  const availableNS = balance.data ? balance.data.raw : 0n;

  if (!modalAction) return null;

  return (
    <ModalStakeOrLockNewBatch
      availableNS={availableNS}
      action={modalAction}
      onActionChange={openModal}
      onClose={closeModal}
    />
  );
}

function ModalStakeOrLockNewBatch({
  action,
  availableNS,
  onActionChange,
  onClose,
}: {
  availableNS: bigint;
  action: "stake" | "lock";
  onActionChange: (action: "stake" | "lock") => void;
  onClose: () => void;
}) {
  const stakeOrLockMutation = useStakeOrLockMutation();

  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState(action === "lock" ? 1 : 0);

  const balance = parseNSAmount(amount);
  const power = batchHelpers.calculateBalanceVotingPower({
    balance,
    months,
    mode: action,
  });
  const actionText = action === "lock" ? "Lock Tokens" : "Stake Tokens";

  const onStakeOrLock = async (data: { amount: string; months: number }) => {
    try {
      await stakeOrLockMutation.mutateAsync(data);
      toast.success(
        `Successfully ${action === "lock" ? "locked" : "staked"} tokens`,
      );
    } catch (error) {
      toast.error((error as Error).message || "Failed to stake tokens");
    } finally {
      onClose();
    }
  };

  useEffect(() => {
    setMonths(action === "lock" ? 1 : 0);
  }, [action]);

  return (
    <Modal onClose={onClose}>
      <h2>Stake or Lock Tokens</h2>

      <p>
        Stake your NS tokens to receive Votes. the longer you leave them staked,
        the more votes they accumulate over time.
      </p>
      <p>
        Lock your NS tokens to receive an immediate boost to your voting power!
      </p>

      <div className="radio-group">
        <label>
          <input
            type="radio"
            checked={action === "stake"}
            onChange={() => onActionChange("stake")}
          />
          Stake
        </label>
        <label>
          <input
            type="radio"
            checked={action === "lock"}
            onChange={() => onActionChange("lock")}
          />
          Lock
        </label>
      </div>

      <div className="box">
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        /{formatNSBalance(availableNS)} NS
      </div>

      {action === "lock" && (
        <>
          <div className="box">
            <LockMonthSelector
              months={months}
              setMonths={setMonths}
              currentMonths={0}
            />
          </div>
          <div>
            <p>Votes {formatNSBalance(power)}</p>
          </div>
          <div>
            <p>Lock on: {new Date().toLocaleDateString()}</p>
            <p>
              Unlocks on:{" "}
              {new Date(Date.now() + months * 30 * DAY_MS).toLocaleDateString()}
            </p>
          </div>
        </>
      )}

      {action === "stake" && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Duration</th>
                <th>Multiplier</th>
                <th>Votes</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 6, 12].map((months) => {
                const powerPreview = batchHelpers.calculateBalanceVotingPower({
                  balance,
                  months,
                  mode: "stake",
                });
                const multiplierPreview =
                  Number(
                    batchHelpers.calculateBalanceVotingPower({
                      balance: BigInt(ONE_NS_RAW),
                      months,
                      mode: "stake",
                    }),
                  ) / ONE_NS_RAW;
                const startDay = months * 30 + 1;
                const endDay = months * 30 + 30;
                const label = `Day ${startDay}-${endDay}`;
                return (
                  <tr key={months}>
                    <td>{label}</td>
                    <td>{multiplierPreview.toFixed(2)}x</td>
                    <td>{formatNSBalance(powerPreview)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ModalFooter
        actionText={actionText}
        onClose={onClose}
        onAction={() => onStakeOrLock({ amount, months })}
      />
    </Modal>
  );
}
