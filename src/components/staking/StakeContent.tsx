"use client";

import { useState, useMemo, useEffect } from "react";
import { type Batch } from "@/types/Batch";
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
import { MAX_LOCK_DURATION_DAYS, batchHelpers } from "@/types/Batch";
import { parseNSAmount } from "@/utils/parseAmount";
import {
  type UnstakeRequest,
  useUnstakeMutation,
} from "@/hooks/staking/useUnstakeMutation";
import {
  Modal,
  ModalFooter,
  LockMonthSelector,
} from "@/components/ui/dummy-ui/dummy-ui";
import Loader from "@/components/ui/Loader";
import { useGetOwnedBatches } from "@/hooks/staking/useGetOwnedBatches";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { parseProposalVotes } from "@/hooks/useGetProposalDetail";
import { isPast } from "date-fns";
import { calcVotingStats } from "@/utils/calcVotingStats";
import { useGetOwnedNSBalance } from "@/hooks/useGetOwnedNSBalance";
import { useGetAllProposals } from "@/hooks/useGetAllProposals";
import { type ProposalObjResp } from "@/types/Proposal";
import {
  useGetUserStats,
  type UserProposalStats,
} from "@/hooks/useGetUserStats";
import { formatTimeDiff, TimeUnit } from "@polymedia/suitcase-core";
import { DAY_MS, ONE_NS_RAW } from "@/constants/common";

type StakingData = {
  lockedNS: bigint;
  lockedPower: bigint;
  stakedNS: bigint;
  stakedPower: bigint;
  totalPower: bigint;
};

type BatchAction = "view" | "lock" | "requestUnstake" | "unstake";

export function StakeContent() {
  const currAcct = useCurrentAccount();
  const currAddr = currAcct?.address;

  const balance = useGetOwnedNSBalance(currAddr);
  const availableNS = balance.data ? BigInt(balance.data.totalBalance) : 0n;

  const batches = useGetOwnedBatches(currAddr);
  const stakingData = useMemo((): StakingData => {
    let lockedNS = 0n;
    let lockedPower = 0n;
    let stakedNS = 0n;
    let stakedPower = 0n;

    batches.data?.forEach((batch) => {
      if (batch.isLocked) {
        lockedNS += batch.balanceNS;
        lockedPower += batch.votingPower;
      } else if (batch.isStaked) {
        stakedNS += batch.balanceNS;
        if (!batch.isCooldownRequested) {
          stakedPower += batch.votingPower;
        }
      }
    });

    return {
      lockedNS,
      lockedPower,
      stakedNS,
      stakedPower,
      totalPower: lockedPower + stakedPower,
    };
  }, [batches.data]);

  if (balance.isLoading || batches.isLoading) {
    return <Loader className="h-5 w-5" />;
  }

  if (balance.error || batches.error) {
    return (
      <div>
        Error:{" "}
        {balance.error?.message ??
          batches.error?.message ??
          "Something went wrong"}
      </div>
    );
  }

  return (
    <>
      <PanelOverview availableNS={availableNS} stakingData={stakingData} />
      <PanelBatches availableNS={availableNS} batches={batches.data ?? []} />
      <PanelRecentProposals />
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
  batches: Batch[];
}) {
  const [modalAction, setModalAction] = useState<null | "stake" | "lock">(null);

  const votingBatches = batches.filter((batch) => batch.isVoting);
  const availableBatches = batches.filter((batch) => batch.canVote);
  const unavailableBatches = batches.filter(
    (batch) => batch.isCooldownRequested,
  );

  return (
    <div className="panel">
      {batches.length === 0 &&
        (availableNS === 0n ? (
          <>
            <h3>No NS tokens found</h3>
            <p>Stake or Lock NS tokens to participate in SuiNS governance</p>
          </>
        ) : (
          <>
            <h3>Stake or Lock NS to Vote</h3>
            <p>
              Start Staking your NS to Participate in governance, earn rewards,
              and shape the future of SuiNS
            </p>
            <div className="button-group">
              <button onClick={() => setModalAction("stake")}>Stake</button>
              <button onClick={() => setModalAction("lock")}>Lock</button>
            </div>
          </>
        ))}

      <BatchGroup batches={votingBatches} title="Voting on latest proposal" />
      <BatchGroup batches={availableBatches} title="Available for voting" />
      <BatchGroup batches={unavailableBatches} title="Unavailable for voting" />

      {modalAction && (
        <ModalStakeOrLockNewBatch
          availableNS={availableNS}
          action={modalAction}
          onActionChange={setModalAction}
          onClose={() => setModalAction(null)}
        />
      )}
    </div>
  );
}

function BatchGroup({ batches, title }: { batches: Batch[]; title: string }) {
  if (batches.length === 0) {
    return null;
  }

  return (
    <div className="batch-group">
      {title === "Voting on latest proposal" && (
        <i>
          The Staked and Locked NS tokens participating in voting will be
          unavailable until the voting finishes.
        </i>
      )}
      <h2>{title}</h2>
      {batches.map((batch) => (
        <CardBatch key={batch.objectId} batch={batch} />
      ))}
    </div>
  );
}

function CardBatch({ batch }: { batch: Batch }) {
  const [modalAction, setModalAction] = useState<BatchAction | null>(null);

  const onBatchClick = () => {
    if (modalAction === null) {
      setModalAction("view");
    }
  };

  const onModalClose = () => {
    setModalAction(null);
  };

  const batchOverview = (() => (
    <>
      <p>Votes: {formatNSBalance(batch.votingPower)}</p>
      <p>Multiplier: {batch.votingMultiplier.toFixed(2)}x</p>

      {batch.isLocked ? (
        <>
          <p>Locked for: {batch.lockDurationDays} days</p>
          <p>Locked on: {batch.startDate.toLocaleDateString()}</p>
          <p>Unlocks on: {batch.unlockDate.toLocaleDateString()}</p>
        </>
      ) : (
        // staked
        <>
          <p>Staked for: {batch.daysSinceStart} days</p>
          <p>Staked on: {batch.startDate.toLocaleDateString()}</p>
          {batch.isCooldownRequested && !batch.isCooldownOver && (
            <>
              <p>In cooldown</p>
              <p>
                Available in:{" "}
                {formatTimeDiff({
                  timestamp: batch.cooldownEndDate!.getTime(),
                  minTimeUnit: TimeUnit.ONE_MINUTE,
                })}
              </p>
            </>
          )}
        </>
      )}
    </>
  ))();

  return (
    <div className="batch" onClick={onBatchClick}>
      <div>
        <h3>{formatNSBalance(batch.balanceNS)} NS</h3>
        {batchOverview}
      </div>

      <div className="button-group">
        <BatchActions batch={batch} onActionChange={setModalAction} />
      </div>

      {modalAction === "view" && (
        <ModalViewBatch
          batch={batch}
          onActionChange={setModalAction}
          onClose={onModalClose}
        />
      )}

      {modalAction === "lock" && (
        <ModalLockBatch batch={batch} onClose={onModalClose} />
      )}

      {modalAction === "requestUnstake" && (
        <ModalRequestUnstakeBatch batch={batch} onClose={onModalClose} />
      )}

      {modalAction === "unstake" && (
        <ModalUnstakeBatch batch={batch} onClose={onModalClose} />
      )}
    </div>
  );
}

function BatchActions({
  batch,
  onActionChange,
}: {
  batch: Batch;
  onActionChange: (action: BatchAction) => void;
}) {
  const onBtnClick = (action: BatchAction, event: React.MouseEvent) => {
    event.stopPropagation();
    onActionChange(action);
  };

  if (batch.isVoting) {
    return null;
  }

  if (batch.isLocked) {
    if (batch.lockDurationDays < MAX_LOCK_DURATION_DAYS) {
      return (
        <button onClick={(e) => onBtnClick("lock", e)}>Extend Lock</button>
      );
    }
  }

  if (batch.isStaked) {
    return (
      <>
        {!batch.isCooldownRequested ? (
          <>
            <button onClick={(e) => onBtnClick("requestUnstake", e)}>
              Request Unstake
            </button>
            <button onClick={(e) => onBtnClick("lock", e)}>Lock</button>
          </>
        ) : batch.isCooldownOver ? (
          <button onClick={(e) => onBtnClick("unstake", e)}>Unstake Now</button>
        ) : null}
      </>
    );
  }

  return null;
}

/**
 * Stake or lock NS into a new batch.
 */
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

  useEffect(() => {
    setMonths(action === "lock" ? 1 : 0);
  }, [action]);

  return (
    <Modal onClose={onClose}>
      <h2>Stake or Lock Tokens</h2>

      <p>
        Stake your NS tokens to receive Votes. The longer you leave them staked,
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

function ModalViewBatch({
  batch,
  onActionChange,
  onClose,
}: {
  batch: Batch;
  onActionChange: (action: BatchAction) => void;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <h2>{batch.isStaked ? "Staked" : "Locked"}</h2>
      <h1>{formatNSBalance(batch.balanceNS)} NS</h1>
      <div>
        <p>Votes: {formatNSBalance(batch.votingPower)}</p>
        {batch.isStaked && (
          <>
            <p>Days Staked: {batch.daysSinceStart}</p>
            <p>Votes multiplier: {batch.votingMultiplier.toFixed(2)}x</p>
          </>
        )}
        {batch.isLocked && (
          <>
            <p>Locked for: {batch.lockDurationDays} days</p>
            <p>Votes multiplier: {batch.votingMultiplier.toFixed(2)}x</p>
            <p>Date Locked: {batch.startDate.toLocaleDateString()}</p>
            <p>Unlocks On: {batch.unlockDate.toLocaleDateString()}</p>
          </>
        )}
      </div>
      <div className="button-group">
        <BatchActions batch={batch} onActionChange={onActionChange} />
      </div>
    </Modal>
  );
}

/**
 * Lock a staked batch, or extend the lock period of a locked batch.
 */
function ModalLockBatch({
  batch,
  onClose,
}: {
  batch: Batch;
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

  const votes = batchHelpers.calculateBalanceVotingPower({
    balance: batch.balanceNS,
    months,
    mode: "lock",
  });

  return (
    <Modal onClose={onClose}>
      <h2>Lock Tokens</h2>

      <p>
        {batch.isStaked
          ? "Lock your staked NS tokens "
          : "Extend the lock period of your locked NS tokens "}
        to receive an immediate boost to your voting power!
      </p>

      <div className="box">
        <div>
          {batch.isStaked
            ? `Staked for ${batch.daysSinceStart} Days`
            : `Locked for ${batch.lockDurationDays} Days`}
        </div>
        <div>Votes {formatNSBalance(batch.votingPower)}</div>
        <div>
          <h3>{formatNSBalance(batch.balanceNS)} NS</h3>
        </div>
      </div>

      <div>
        <div>Select Lock Period</div>
        <div className="box">
          <LockMonthSelector
            months={months}
            setMonths={setMonths}
            currentMonths={batch.lockDurationDays / 30}
          />
        </div>
      </div>

      <div>
        <div>Votes {formatNSBalance(votes)}</div>
      </div>

      <ModalFooter
        actionText="Lock Tokens"
        onClose={onClose}
        onAction={() => onLock({ batchId: batch.objectId, months })}
      />
    </Modal>
  );
}

function ModalRequestUnstakeBatch({
  batch,
  onClose,
}: {
  batch: Batch;
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
    <Modal onClose={onClose}>
      <h2>Request Unstake</h2>

      <p>Unstaking initiates a 3-day cooldown period.</p>

      <div className="box">
        <div>{formatNSBalance(batch.balanceNS)} NS</div>
        <div>Votes: {formatNSBalance(batch.votingPower)}</div>
        <div>Started: {batch.startDate.toLocaleDateString()}</div>
      </div>

      <ModalFooter
        actionText="Start Cooldown"
        onClose={onClose}
        onAction={() => onRequestUnstake({ batchId: batch.objectId })}
      />
    </Modal>
  );
}

function ModalUnstakeBatch({
  batch,
  onClose,
}: {
  batch: Batch;
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
    <Modal onClose={onClose}>
      <h2>Unstake Batch</h2>

      <p>Destroy the batch and get your NS back.</p>

      <div className="box">
        <div>{formatNSBalance(batch.balanceNS)} NS</div>
        <div>Votes: {formatNSBalance(batch.votingPower)}</div>
        <div>Started: {batch.startDate.toLocaleDateString()}</div>
      </div>

      <ModalFooter
        actionText="Unstake"
        onClose={onClose}
        onAction={() => onUnstake({ batchId: batch.objectId })}
      />
    </Modal>
  );
}

// TODO-J: group into "voting in progress" and "voting ended"
export function PanelRecentProposals() {
  const currAcct = useCurrentAccount();
  const { data: proposals } = useGetAllProposals();
  const { data: userStats } = useGetUserStats({
    user: currAcct?.address,
    proposalIds: proposals?.map((proposal) => proposal.fields.id.id),
  });

  return (
    <div className="panel">
      <h2>Recent Proposals</h2>
      {proposals?.map((proposal) => (
        <CardProposalSummary
          key={proposal.fields.id.id}
          proposal={proposal}
          userStats={userStats?.proposalStats.find(
            (stat) => stat.proposalId === proposal.fields.id.id,
          )}
        />
      ))}
      {userStats && (
        <div>
          <h2>Your Lifetime Rewards:</h2>
          <p>{formatNSBalance(userStats.totalReward)}</p>
        </div>
      )}
    </div>
  );
}

function CardProposalSummary({
  proposal,
  userStats,
}: {
  proposal: ProposalObjResp;
  userStats: UserProposalStats | undefined;
}) {
  if (!proposal) {
    return null;
  }

  const isClosed = isPast(new Date(Number(proposal.fields.end_time_ms ?? 0)));
  const fields = proposal.fields;

  let status = "active";
  if (isClosed) {
    if (fields.winning_option?.fields.pos0 === "Yes") {
      status = "passed";
    } else if (fields.winning_option === null) {
      status = "pending";
    } else {
      status = "failed";
    }
  }

  // Calculate overall voting statistics
  const votes = parseProposalVotes(proposal);
  const stats = calcVotingStats({
    ...votes,
    threshold: Number(proposal?.fields.threshold),
  });

  return (
    <div>
      <h2>{fields.title}</h2>
      <div>
        <div>Status: {status}</div>
        <p>
          End time: {new Date(Number(fields.end_time_ms)).toLocaleDateString()}
        </p>

        <div>
          <h3>Overall Votes</h3>
          <div>
            <p>
              Yes: {stats.yesVotes} ({stats.yesPercentage}%)
            </p>
            <p>
              No: {stats.noVotes} ({stats.noPercentage}%)
            </p>
            <p>
              Abstain: {stats.abstainVotes} ({stats.abstainPercentage}%)
            </p>
            <p>Total votes: {stats.totalVotes}</p>
            <p>
              Threshold: {stats.threshold}{" "}
              {stats.thresholdReached ? "(Reached)" : "(Not reached)"}
            </p>
          </div>
        </div>

        {userStats && (
          <div>
            <h3>Your Participation</h3>
            <div>
              <p>Your Votes: {formatNSBalance(userStats.power)}</p>
              <p>Your Rewards: {formatNSBalance(userStats.reward)}</p>
            </div>
          </div>
        )}
      </div>
      <hr />
    </div>
  );
}

export function StakeHeaderButtons() {
  const currAcct = useCurrentAccount();
  const currAddr = currAcct?.address;

  const balance = useGetOwnedNSBalance(currAddr);
  const availableNS = balance.data ? BigInt(balance.data.totalBalance) : 0n;

  const batches = useGetOwnedBatches(currAddr);
  const ownedBatches = batches.data ?? [];

  if (availableNS === 0n || ownedBatches.length === 0) {
    return null;
  }

  return (
    <>
      <button className="rounded bg-green-400 px-4 py-2">Stake</button>
      <button className="rounded bg-blue-400 px-4 py-2">Lock</button>
    </>
  );
}
