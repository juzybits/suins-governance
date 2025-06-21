"use client";

import React, { useState } from "react";
import { ONE_NS_RAW } from "@/constants/common";
import {
  useCreateProposalMutation,
  useDistributeRewardsMutation,
  useGetGovernanceAdminCap,
} from "@/hooks/dev/useDevHooks";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Suspense } from "react";
import Loader from "@/components/ui/legacy/Loader";
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

  const loremIpsum =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam auctor ornare felis nec consectetur. Aliquam erat volutpat. Mauris sagittis consectetur nisi, id venenatis erat. In hac habitasse platea dictumst. Donec at blandit nisl. Etiam aliquam volutpat lacus sed tincidunt. Nullam ut nisl ex. Vestibulum porta mattis interdum.";

  const generateRandomTitle = () => {
    const words = loremIpsum.toLowerCase().replace(/[.,]/g, "").split(" ");
    return Array.from(
      { length: 3 },
      () => words[Math.floor(Math.random() * words.length)]!,
    )
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const [formData, setFormData] = useState({
    title: generateRandomTitle(),
    description: `${loremIpsum}<br/><br/>${loremIpsum}<br/><br/>${loremIpsum}<br/><br/>${loremIpsum}<br/><br/>${loremIpsum}<br/><br/>${loremIpsum}`,
    duration_minutes: 1,
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
        end_time_ms: Date.now() + formData.duration_minutes * 60 * 1000,
        reward: BigInt(formData.reward_ns * ONE_NS_RAW),
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
          <textarea
            value={formData.description}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, description: e.target.value }));
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Duration (minutes):</label>
          <input
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                duration_minutes: Number(e.target.value),
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
