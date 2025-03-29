"use client";

import { useState, useMemo, useEffect } from "react";
import { type StakingBatch } from "@/hooks/staking/useGetStakingBatches";
import {
  type StakeRequest,
  useStakeOrLockMutation,
} from "@/hooks/staking/useStakeOrLockMutation";
import {
  type LockRequest,
  useLockMutation,
} from "@/hooks/staking/useLockMutation";
import {
  type RequestUnstakeRequest,
  useRequestUnstakeMutation,
} from "@/hooks/staking/useRequestUnstakeMutation";
import { toast } from "sonner";
import { formatNSBalance } from "@/utils/formatNumber";
import { stakingBatchHelpers } from "@/utils/stakingBatchHelpers";
import { parseNSAmount } from "@/utils/parseAmount";
import {
  type UnstakeRequest,
  useUnstakeMutation,
} from "@/hooks/staking/useUnstakeMutation";
import {
  Modal,
  ModalHeader,
  ModalFooter,
  MonthSelector,
} from "@/components/ui/dummy-ui/dummy-ui";
import Loader from "@/components/ui/Loader";
import { useGetStakingBatches } from "@/hooks/staking/useGetStakingBatches";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { useGetBalance } from "@/hooks/useGetBalance";
import { NETWORK } from "@/constants/env";

type StakingData = {
  lockedNS: bigint;
  lockedPower: bigint;
  stakedNS: bigint;
  stakedPower: bigint;
  totalPower: bigint;
};

export function StakeContent() {
  const currAcct = useCurrentAccount();

  const balance = useGetBalance({
    owner: currAcct?.address,
    coinType: SUINS_PACKAGES[NETWORK].votingTokenType,
  });
  const availableNS = balance.data ? BigInt(balance.data.totalBalance) : 0n;

  const batches = useGetStakingBatches(currAcct?.address);
  const batchesData = batches.data ?? [];
  const stakingData = useMemo((): StakingData => {
    let lockedNS = 0n;
    let lockedPower = 0n;
    let stakedNS = 0n;
    let stakedPower = 0n;
    let totalPower = 0n;

    batchesData.forEach((batch) => {
      if (batch.isLocked) {
        lockedNS += batch.balanceNS;
        lockedPower += batch.votingPower;
      } else if (batch.isStaked) {
        stakedNS += batch.balanceNS;
        stakedPower += batch.votingPower;
      }
      totalPower += batch.votingPower;
    });

    return {
      lockedNS,
      lockedPower,
      stakedNS,
      stakedPower,
      totalPower,
    };
  }, [batchesData]);

  if (balance.isLoading || batches.isLoading) {
    return <Loader className="h-5 w-5" />;
  }

  if (balance.error || batches.error) {
    return <div>Error: {balance.error?.message ?? batches.error?.message}</div>;
  }

  return (
    <>
      <PanelOverview availableNS={availableNS} stakingData={stakingData} />
      <PanelBatches availableNS={availableNS} batches={batchesData} />
      <PanelParticipation />
    </>
  );
}

function PanelOverview({
  stakingData,
  availableNS,
}: {
  stakingData: StakingData;
  availableNS: bigint;
}) {
  const { lockedNS, lockedPower, stakedNS, stakedPower, totalPower } =
    stakingData;

  return (
    <div className="panel">
      <div>
        <p>
          Total Locked: {formatNSBalance(lockedNS)} NS (
          {formatNSBalance(lockedPower)} Votes)
        </p>
        <p>
          Total Staked: {formatNSBalance(stakedNS)} NS (
          {formatNSBalance(stakedPower)} Votes)
        </p>
        <p>Your Total Votes: {formatNSBalance(totalPower)}</p>
        <p>Available Tokens: {formatNSBalance(availableNS)} NS</p>
      </div>
    </div>
  );
}

function PanelBatches({
  availableNS,
  batches,
}: {
  availableNS: bigint;
  batches: StakingBatch[];
}) {
  const [modalAction, setModalAction] = useState<null | "stake" | "lock">(null);

  return (
    <div className="panel">
      <h2>Staked & Locked (count: {batches.length})</h2>

      {batches.length === 0 && (
        <>
          <h3>No Stakes or Locks</h3>
          <p>
            Start Staking your NS to participate in governance, earn rewards,
            and shape the future of SuiNS
          </p>
        </>
      )}

      <div className="button-group">
        <button onClick={() => setModalAction("stake")}>Stake</button>
        <button onClick={() => setModalAction("lock")}>Lock</button>
      </div>

      {batches.length > 0 && (
        <>
          {batches.map((batch) => (
            <CardBatch key={batch.objectId} batch={batch} />
          ))}
        </>
      )}

      {modalAction && (
        <ModalStakeOrLock
          availableNS={availableNS}
          action={modalAction}
          onActionChange={setModalAction}
          onClose={() => setModalAction(null)}
        />
      )}
    </div>
  );
}

function CardBatch({ batch }: { batch: StakingBatch }) {
  const [showLockModal, setShowLockModal] = useState(false);
  const [showRequestUnstakeModal, setShowRequestUnstakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);

  const getStatusText = () => {
    if (batch.isLocked) {
      return `Locked for ${batch.lockDurationDays} Days`;
    } else if (batch.isCooldownOver) {
      return `Cooldown Over`;
    } else if (batch.isCooldownRequested) {
      return `Cooldown Requested`;
    } else if (batch.isVoting) {
      return `Used for Voting`;
    } else {
      return `Staked for ${batch.daysSinceStart} Days`;
    }
  };

  return (
    <div className="batch">
      <div className="batch-header">
        <div>
          <strong>{formatNSBalance(batch.balanceNS)} NS</strong>
        </div>
        <div>
          <strong>{formatNSBalance(batch.votingPower)} Votes</strong>
        </div>
      </div>

      <div className="batch-status">
        <div>{getStatusText()}</div>
      </div>

      {batch.isStaked && (
        <div className="batch-actions">
          {!batch.isCooldownRequested && (
            <div className="button-group">
              <button onClick={() => setShowRequestUnstakeModal(true)}>
                Request Unstake
              </button>
              <button onClick={() => setShowLockModal(true)}>Lock</button>
            </div>
          )}
          {batch.isCooldownOver && (
            <button onClick={() => setShowUnstakeModal(true)}>
              Unstake Now
            </button>
          )}
          {/* TODO: add extend lock duration for locked batches if < max months */}
        </div>
      )}

      {showLockModal && (
        <ModalLock batch={batch} onClose={() => setShowLockModal(false)} />
      )}

      {showRequestUnstakeModal && (
        <ModalRequestUnstake
          batch={batch}
          onClose={() => setShowRequestUnstakeModal(false)}
        />
      )}

      {showUnstakeModal && (
        <ModalUnstake
          batch={batch}
          onClose={() => setShowUnstakeModal(false)}
        />
      )}
    </div>
  );
}

function ModalStakeOrLock({
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

  const onStakeOrLock = async (data: StakeRequest) => {
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

  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState(action === "lock" ? 1 : 0);

  useEffect(() => {
    setMonths(action === "lock" ? 1 : 0);
  }, [action]);

  const votes = stakingBatchHelpers.calculateLockedVotingPower({
    balance: parseNSAmount(amount),
    lockMonths: months,
  });
  const actionText = action === "lock" ? "Lock Tokens" : "Stake Tokens";

  return (
    <Modal>
      <ModalHeader
        title={`${action === "lock" ? "Lock" : "Stake"} Tokens`}
        onClose={onClose}
      />

      <p>
        Stake your NS tokens to receive Votes, which increases over time, with
        an immediate boost based on a lockup period of 1-12 months.
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
        <div className="box">
          <MonthSelector months={months} setMonths={setMonths} />
        </div>
      )}

      <div>
        <div>Votes {formatNSBalance(votes)}</div>
      </div>

      <ModalFooter
        onClose={onClose}
        actionText={actionText}
        onAction={() => onStakeOrLock({ amount, months })}
      />
    </Modal>
  );
}

function ModalLock({
  batch,
  onClose,
}: {
  batch: StakingBatch;
  onClose: () => void;
}) {
  const lockMutation = useLockMutation();

  const onLock = async (data: LockRequest) => {
    try {
      await lockMutation.mutateAsync(data);
      toast.success("Successfully locked tokens");
    } catch (error) {
      toast.error((error as Error).message || "Failed to lock batch");
    } finally {
      onClose();
    }
  };

  const [months, setMonths] = useState(1);

  const votes = stakingBatchHelpers.calculateLockedVotingPower({
    balance: batch.balanceNS,
    lockMonths: months,
  });

  return (
    <Modal>
      <ModalHeader title="Lock Tokens" onClose={onClose} />

      <p>
        Lock your already Staked NS tokens to receive an immediate Votes
        multiplier.
      </p>

      <div className="box">
        <div>Staked for {batch.daysSinceStart} Days</div>
        <div>{formatNSBalance(batch.balanceNS)} NS</div>
        <div>Votes {formatNSBalance(batch.votingPower)}</div>
      </div>

      <div>
        <div>Select Lock Period</div>
        <div className="box">
          <MonthSelector months={months} setMonths={setMonths} />
        </div>
      </div>

      <div>
        <div>Votes {formatNSBalance(votes)}</div>
      </div>

      <ModalFooter
        onClose={onClose}
        actionText="Lock Tokens"
        onAction={() => onLock({ batchId: batch.objectId, months })}
      />
    </Modal>
  );
}

function ModalRequestUnstake({
  batch,
  onClose,
}: {
  batch: StakingBatch;
  onClose: () => void;
}) {
  const requestUnstakeMutation = useRequestUnstakeMutation();

  const onRequestUnstake = async (data: RequestUnstakeRequest) => {
    try {
      await requestUnstakeMutation.mutateAsync(data);
      toast.success("Successfully initiated cooldown");
    } catch (error) {
      toast.error((error as Error).message || "Failed to request cooldown");
    } finally {
      onClose();
    }
  };

  return (
    <Modal>
      <ModalHeader title="Request Unstake" onClose={onClose} />

      <p>Unstaking initiates a 3-day cooldown period.</p>

      <div className="box">
        <div>{formatNSBalance(batch.balanceNS)} NS</div>
        <div>Votes: {formatNSBalance(batch.votingPower)}</div>
        <div>Started: {batch.startDate.toLocaleDateString()}</div>
      </div>

      <ModalFooter
        onClose={onClose}
        actionText="Start Cooldown"
        onAction={() => onRequestUnstake({ batchId: batch.objectId })}
      />
    </Modal>
  );
}

function ModalUnstake({
  batch,
  onClose,
}: {
  batch: StakingBatch;
  onClose: () => void;
}) {
  const unstakeMutation = useUnstakeMutation();

  const onUnstake = async (data: UnstakeRequest) => {
    try {
      await unstakeMutation.mutateAsync(data);
      toast.success("Successfully unstaked");
    } catch (error) {
      toast.error((error as Error).message || "Failed to unstake batch");
    } finally {
      onClose();
    }
  };

  return (
    <Modal>
      <ModalHeader title="Unstake Batch" onClose={onClose} />

      <p>Destroy the batch and get your NS back.</p>

      <div className="box">
        <div>{formatNSBalance(batch.balanceNS)} NS</div>
        <div>Votes: {formatNSBalance(batch.votingPower)}</div>
        <div>Started: {batch.startDate.toLocaleDateString()}</div>
      </div>

      <ModalFooter
        onClose={onClose}
        actionText="Unstake"
        onAction={() => onUnstake({ batchId: batch.objectId })}
      />
    </Modal>
  );
}

function PanelParticipation() {
  const votes: { id: string }[] = [];
  return (
    <div className="panel">
      <h2>Your Governance Participation</h2>
      {votes.length === 0 ? (
        <>
          <h3>No Votes</h3>
          <p>
            Once you start voting, your participation will be showcased here
          </p>
        </>
      ) : (
        <>
          {votes.map((vote) => (
            <div key={vote.id}>{vote.id}</div>
          ))}
        </>
      )}
    </div>
  );
}
