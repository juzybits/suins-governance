import { useStakeModal } from "./StakeModalContext";
import { useStakeOrLockMutation } from "@/hooks/staking/useStakeOrLockMutation";
import { parseNSAmount } from "@/utils/parseAmount";
import { batchHelpers } from "@/types/Batch";
import { Modal, ModalFooter } from "@/components/ui/dummy-ui/dummy-ui";
import { toast } from "sonner";
import { useState } from "react";
import { formatNSBalance } from "@/utils/formatNumber";
import { ONE_NS_RAW } from "@/constants/common";
import { useGetOwnedNSBalance } from "@/hooks/useGetOwnedNSBalance";
import { useCurrentAccount } from "@mysten/dapp-kit";

export function StakeModalContent() {
  const { isModalOpen, closeModal } = useStakeModal();

  const currAcct = useCurrentAccount();
  const currAddr = currAcct?.address;

  const balance = useGetOwnedNSBalance(currAddr);
  const availableNS = balance.data ? balance.data.raw : 0n;

  if (!isModalOpen) return null;

  return (
    <ModalStakeOrLockNewBatch availableNS={availableNS} onClose={closeModal} />
  );
}

function ModalStakeOrLockNewBatch({
  availableNS,
  onClose,
}: {
  availableNS: bigint;
  onClose: () => void;
}) {
  const stakeOrLockMutation = useStakeOrLockMutation();

  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState(0);

  const balance = parseNSAmount(amount);

  const onStakeOrLock = async (data: { amount: string; months: number }) => {
    try {
      await stakeOrLockMutation.mutateAsync(data);
      toast.success(
        `Successfully ${months === 0 ? "staked" : "locked"} tokens`,
      );
    } catch (error) {
      toast.error((error as Error).message || "Failed to stake tokens");
    } finally {
      onClose();
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2>Stake or Lock Tokens</h2>

      <p>Stake or lock your NS tokens to receive Votes.</p>

      <div className="box">
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        /{formatNSBalance(availableNS)} NS
      </div>

      <h3>Stake Tokens</h3>
      <p style={{ fontSize: "0.8em" }}>
        The longer you leave your NS tokens staked, the more votes they
        accumulate over time. Tokens can be unstaked at any time.
      </p>

      <div className="dummy-table">
        <div className="table-header">
          <div>Selection</div>
          <div>Vote Multiplier</div>
          <div>Votes</div>
        </div>
        <div className="table-row">
          <div>
            <label>
              <input
                type="radio"
                checked={months === 0}
                onChange={() => setMonths(0)}
              />
              Stake
            </label>
          </div>
          <div>1x</div>
          <div>{formatNSBalance(balance)}</div>
        </div>
      </div>
      <p style={{ fontSize: "0.8em" }}>
        earn +10% votes every 30 days. maximum multiplier of 2.85x after 360
        days.
      </p>

      <h3>Lock Tokens</h3>
      <p style={{ fontSize: "0.8em" }}>
        Lock your NS tokens to receive an immediate boost to your voting power!
        Locked tokens cannot be unstaked until commitment date has been reached.
      </p>

      <div className="dummy-table">
        <div className="table-header">
          <div>Selection</div>
          <div>Vote Multiplier</div>
          <div>Votes</div>
        </div>

        {[1, 2, 6, 12].map((monthSelection) => {
          const powerPreview = batchHelpers.calculateBalanceVotingPower({
            balance,
            months: monthSelection,
            mode: "lock",
          });
          const multiplierPreview =
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
              <div>{multiplierPreview.toFixed(2)}x</div>
              <div>{formatNSBalance(powerPreview)}</div>
            </div>
          );
        })}
      </div>

      <ModalFooter
        actionText={"Confirm"}
        onClose={onClose}
        onAction={() => onStakeOrLock({ amount, months })}
      />
    </Modal>
  );
}
