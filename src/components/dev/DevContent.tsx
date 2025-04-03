"use client";

import React from "react";
import { NS_VOTE_DIVISOR } from "@/constants/common";
import {
  useCreateProposalMutation,
  useDistributeRewardsMutation,
  useGetGovernanceAdminCap,
} from "@/hooks/dev/useDevHooks";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import NotFound from "@/app/not-found";

/**
 * A dev-only page to create mock proposals.
 */
export function DevContent() {
  const currAcct = useCurrentAccount();
  const govCap = useGetGovernanceAdminCap(currAcct?.address);

  if (process.env.NODE_ENV !== "development") {
    return <NotFound />;
  }

  if (govCap.isLoading) {
    return <Loader className="h-5 w-5" />;
  }

  if (govCap.error) {
    return <div>Error: {govCap.error?.message}</div>;
  }

  return (
    <Suspense fallback={<Loader className="h-5 w-5" />}>
      <div className="dummy-ui">
        <DevContentForm govCapId={govCap.data} currAddr={currAcct?.address} />
      </div>
    </Suspense>
  );
}

function DevContentForm({
  govCapId,
  currAddr,
}: {
  govCapId: string | null | undefined;
  currAddr: string | undefined;
}) {
  const { mutateAsync: createProposal } = useCreateProposalMutation();
  const { mutateAsync: distributeRewards } = useDistributeRewardsMutation();
  const [formData, setFormData] = React.useState({
    title: "Proposal 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    duration_seconds: 60,
    reward_ns: 100,
    proposalId: "",
  });

  if (!currAddr) {
    return <div className="panel">Connect your wallet to continue.</div>;
  }
  if (!govCapId) {
    return (
      <div className="panel">NSGovernanceCap not found in your wallet.</div>
    );
  }

  const onCreateProposal = async () => {
    try {
      const newProposalId = await createProposal({
        govCapId,
        title: formData.title,
        description: formData.description,
        end_time_ms: Date.now() + formData.duration_seconds * 1000,
        reward: BigInt(formData.reward_ns * NS_VOTE_DIVISOR),
      });
      console.debug("[onCreateProposal] success:", newProposalId);
      setFormData((prev) => ({ ...prev, proposalId: newProposalId ?? "" }));
    } catch (error) {
      console.warn("[onCreateProposal] failed:", error);
    }
  };

  const onDistributeRewards = async () => {
    try {
      const digest = await distributeRewards({
        proposalId: formData.proposalId,
      });
      console.debug("[onDistributeRewards] success:", digest);
    } catch (error) {
      console.warn("[onDistributeRewards] failed:", error);
    }
  };

  return (
    <>
      <div className="panel">
        <div className="flex flex-col gap-2">
          <label>Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, title: e.target.value }));
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Description:</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, description: e.target.value }));
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Duration (seconds):</label>
          <input
            type="number"
            value={formData.duration_seconds}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                duration_seconds: Number(e.target.value),
              }));
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Reward (NS):</label>
          <input
            type="number"
            value={formData.reward_ns}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                reward_ns: Number(e.target.value),
              }));
            }}
          />
        </div>

        <button onClick={onCreateProposal}>Create Proposal</button>
        <button onClick={onDistributeRewards}>Distribute Rewards</button>
      </div>

      <div className="panel">
        <div className="flex flex-col gap-2">
          <label>Proposal ID:</label>
          <input
            type="text"
            value={formData.proposalId}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, proposalId: e.target.value }));
            }}
          />
        </div>

        <button onClick={onDistributeRewards}>Distribute Rewards</button>
      </div>
    </>
  );
}
