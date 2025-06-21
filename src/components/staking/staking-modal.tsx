import { useStakeModal } from "./staking-modal-context";
import { useStakeOrLockMutation } from "@/hooks/staking/useStakeOrLockMutation";
import { parseNSAmount } from "@/utils/parseAmount";
import { batchHelpers } from "@/types/Batch";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import { useState, useEffect, type FC } from "react";
import { NS_DECIMALS, ONE_NS_RAW } from "@/constants/common";
import { useGetOwnedNSBalance } from "@/hooks/useGetOwnedNSBalance";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { ModalFooter } from "../ui/modal/modal-footer";
import Input from "../ui/input";
import Typography from "../ui/typography";
import Table from "../ui/table";
import { makeId } from "@/utils/id";
import Radio from "../ui/radio";
import { formatNSBalance } from "@/utils/coins";

export const StakingModal: FC = () => {
  const { modalAction, closeModal, openModal } = useStakeModal();

  const currAcct = useCurrentAccount();
  const currAddr = currAcct?.address;

  const balance = useGetOwnedNSBalance(currAddr);
  const availableNS = balance.data ? balance.data.raw : 0n;

  if (!modalAction) return null;

  return (
    <ModalStakeOrLockNewBatch
      action={modalAction}
      onClose={closeModal}
      availableNS={availableNS}
      onActionChange={openModal}
    />
  );
};

function ModalStakeOrLockNewBatch({
  action,
  onClose,
  availableNS,
  onActionChange,
}: {
  availableNS: bigint;
  action: "stake" | "lock";
  onActionChange: (action: "stake" | "lock") => () => void;
  onClose: () => void;
}) {
  const stakeOrLockMutation = useStakeOrLockMutation();

  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState(action === "lock" ? 1 : 0);

  const balance = parseNSAmount(amount);

  const onStakeOrLock = async ({
    amount,
    months,
  }: {
    amount: string;
    months: number;
  }) => {
    try {
      await stakeOrLockMutation.mutateAsync({
        balance: BigInt(Number(amount) * 10 ** NS_DECIMALS),
        months,
      });
      toast.success(
        `Successfully ${action === "lock" ? "locked" : "staked"} tokens`,
      );
    } catch (error) {
      console.warn("[onStakeOrLock] failed:", error);
      toast.error("Failed to stake tokens");
    } finally {
      onClose();
    }
  };

  useEffect(() => {
    setMonths(action === "lock" ? 1 : 0);
  }, [action]);

  return (
    <Modal
      onClose={onClose}
      title="Stake or Lock Tokens"
      subtitle="Stake your NS tokens to receive Votes."
    >
      <div className="flex flex-col gap-l py-l">
        <Input
          setValue={(value) =>
            setAmount((old) =>
              value.endsWith(".") && value.split(".").length <= 2
                ? value
                : !isNaN(Number(value))
                  ? String(Number(value))
                  : old,
            )
          }
          value={amount || "0"}
          error={!!(amount && Number(amount) < 0.1)}
          info="Minimum amount required to stake or lock is 0.1 NS"
          suffix={
            <span
              onClick={() =>
                setAmount((Number(availableNS) / 10 ** NS_DECIMALS).toString())
              }
            >
              /{formatNSBalance(availableNS)} NS
            </span>
          }
        />
        <div className="flex flex-col gap-xs">
          <h3>
            <Typography variant="heading/Small Bold">Stake Tokens</Typography>
          </h3>
          <p>
            <Typography variant="paragraph/Regular" className="text-secondary">
              The longer you leave your NS tokens staked, the more votes they
              accumulate over time. Tokens can be unstaked at any time.
            </Typography>
          </p>
          <Table
            minimalist
            columnStyles={(index) =>
              index === 0 ? "text-left" : "text-right pl-m"
            }
            header={["Selection", "Multiplier", "Votes"].map((item) => (
              <Typography
                variant="label/Small Medium"
                className="text-secondary opacity-70"
                key={makeId("stake", "heading", item)}
              >
                {item}
              </Typography>
            ))}
            content={[
              [
                <div key={makeId("stake", "cell", 0, 0)} className="flex gap-s">
                  <Radio
                    value={action === "stake"}
                    toggle={onActionChange("stake")}
                  />
                  <div className="flex flex-col gap-2xs">
                    <Typography variant="label/Large Medium">Stake</Typography>
                    <Typography
                      className="opacity-70"
                      variant="paragraph/XSmall"
                    >
                      Earn +10% Votes every 30 days. Maximum multiplier of 2.85x
                      after 360 days.
                    </Typography>
                  </div>
                </div>,
                <Typography
                  variant="label/Large Bold"
                  key={makeId("stake", "cell", 0, 1)}
                  className="text-right text-primary-main"
                >
                  1.00x
                </Typography>,
                <Typography
                  variant="label/Large Bold"
                  key={makeId("stake", "cell", 0, 2)}
                  className="text-right text-semantic-good"
                >
                  {formatNSBalance(balance)}
                </Typography>,
              ],
            ]}
          />
        </div>
        <div className="flex flex-col gap-xs">
          <h3>
            <Typography variant="heading/Small Bold">Lock Tokens</Typography>
          </h3>
          <p>
            <Typography variant="paragraph/Regular" className="text-secondary">
              Lock your NS tokens to receive an immediate boost to your voting
              power! Locked tokens cannot be unstaked until commitment date has
              been reached.
            </Typography>
          </p>
          <Table
            minimalist
            columnStyles={(index) =>
              index === 0 ? "text-left" : "text-right pl-m"
            }
            header={["Duration", "Multiplier", "Votes"].map((item) => (
              <Typography
                variant="label/Small Medium"
                className="text-secondary opacity-70"
                key={makeId("stake", "heading", item)}
              >
                {item}
              </Typography>
            ))}
            content={[1, 2, 6, 12].map((month, index) => {
              const powerPreview = batchHelpers.calculateBalanceVotingPower({
                balance,
                mode: "lock",
                months: month,
              });
              const multiplierPreview =
                Number(
                  batchHelpers.calculateBalanceVotingPower({
                    balance: BigInt(ONE_NS_RAW),
                    months: month,
                    mode: "lock",
                  }),
                ) / ONE_NS_RAW;
              const days = month * 30;
              const label = `${days} days`;

              return [
                <div
                  className="flex gap-s"
                  key={makeId("lock", "cell", index, 0)}
                >
                  <Radio
                    value={action === "lock" && months === month}
                    toggle={() => {
                      onActionChange("lock")();
                      setMonths(month);
                    }}
                  />
                  <Typography variant="label/Large Medium">{label}</Typography>
                </div>,
                <Typography
                  variant="label/Large Bold"
                  key={makeId("lock", "cell", index, 1)}
                  className="text-right text-primary-main"
                >
                  {multiplierPreview.toFixed(2)}x
                </Typography>,
                <Typography
                  variant="label/Large Bold"
                  key={makeId("lock", "cell", index, 2)}
                  className="text-right text-semantic-good"
                >
                  {formatNSBalance(powerPreview)}
                </Typography>,
              ];
            })}
          />
        </div>
      </div>
      <ModalFooter
        onClose={onClose}
        actionText="Confirm"
        onAction={() => onStakeOrLock({ amount, months })}
        disabled={!amount || Number(amount) < 0.1}
      />
    </Modal>
  );
}
