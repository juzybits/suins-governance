"use client";

import Loader from "@/components/ui/legacy/Loader";
import { useGetUserStakingData } from "@/hooks/staking/useGetUserStakingData";
import { useCurrentAccount, useCurrentWallet } from "@mysten/dapp-kit";
import { useGetOwnedNSBalance } from "@/hooks/useGetOwnedNSBalance";
import { useStakeModal } from "@/components/staking/staking-modal-context";
import { PanelRecentProposals } from "@/components/staking/staking-recent-proposals";
import { StakingUserStats } from "@/components/staking/staking-user-stats";
import Typography from "../ui/typography";
import { Button } from "../ui/button";
import StakeSVG from "@/icons/stake";
import LockSVG from "@/icons/lock";
import { StakingBatch } from "./staking-batch";

export function StakeContent() {
  const currAcct = useCurrentAccount();
  const userStaking = useGetUserStakingData(currAcct?.address);
  const balance = useGetOwnedNSBalance(currAcct?.address);

  if (balance.isLoading || userStaking.isLoading) {
    return <Loader className="h-5 w-5" />;
  }

  if (balance.error || userStaking.error) {
    return (
      <div>
        Error:{" "}
        {balance.error?.message ??
          userStaking.error?.message ??
          "Something went wrong"}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-2xl">
      <StakingUserStats showTokens={true} />
      <div className="grid flex-1 grid-cols-[2fr_1fr] gap-l">
        <PanelBatches />
        <PanelRecentProposals />
      </div>
    </div>
  );
}

function PanelBatches() {
  const currAcct = useCurrentAccount();
  const { openModal } = useStakeModal();
  const { isConnecting, isDisconnected } = useCurrentWallet();
  const userStaking = useGetUserStakingData(currAcct?.address);
  const balance = useGetOwnedNSBalance(currAcct?.address);

  if (userStaking.data === undefined || balance.data === undefined) return null;

  const isLoggedOut = (!currAcct && !isConnecting) ?? isDisconnected;

  const ownedBatches = userStaking.data.batches;
  const votingBatches = ownedBatches.filter((batch) => batch.isVoting);
  const availableBatches = ownedBatches.filter((batch) => batch.canVote);
  const unavailableBatches = ownedBatches.filter(
    (batch) => batch.isCooldownRequested,
  );

  return (
    <>
      {userStaking.data?.batches.length === 0 &&
        (isLoggedOut ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-s rounded-l-s rounded-r-s bg-[#62519C2E] p-s">
            <p className="max-w-[30rem] text-center">
              <Typography variant="paragraph/Large" className="text-secondary">
                Connect your wallet to stake or lock NS tokens
              </Typography>
            </p>
          </div>
        ) : balance.data.raw === 0n ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-s rounded-l-s rounded-r-s bg-[#62519C2E] p-s">
            <h3>
              <Typography
                variant="heading/Small Bold"
                className="text-primary-main"
              >
                No NS tokens found
              </Typography>
            </h3>
            <p className="max-w-[20rem] text-center">
              <Typography variant="paragraph/Large" className="text-secondary">
                Stake or lock NS tokens to participate in SuiNS governance
              </Typography>
            </p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-s rounded-l-s rounded-r-s bg-[#62519C2E] p-s">
            <h3>
              <Typography
                variant="heading/Small Bold"
                className="text-primary-main"
              >
                Stake or lock NS to Vote
              </Typography>
            </h3>
            <p className="max-w-[30rem] text-center">
              <Typography variant="paragraph/Large" className="text-secondary">
                Start Staking your NS to Participate in governance, earn
                rewards, and shape the future of SuiNS
              </Typography>
            </p>
            <div className="flex gap-s">
              <Button
                variant="solid/large"
                className="bg-bg-good"
                onClick={openModal("stake")}
                before={<StakeSVG width="100%" className="max-w-[1.25rem]" />}
              >
                <Typography variant="label/Large Bold">Stake</Typography>
              </Button>
              <Button
                variant="solid/large"
                onClick={openModal("lock")}
                before={<LockSVG width="100%" className="max-w-[1rem]" />}
              >
                <Typography variant="label/Large Bold">Lock</Typography>
              </Button>
            </div>
          </div>
        ))}
      <StakingBatch batches={votingBatches} title="Voting on latest proposal" />
      <StakingBatch batches={availableBatches} title="Available for voting" />
      <StakingBatch
        batches={unavailableBatches}
        title="Unavailable for voting"
      />
    </>
  );
}
