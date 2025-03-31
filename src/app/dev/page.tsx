"use client";

import { client } from "@/app/SuinsClient";
import Loader from "@/components/ui/Loader";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import NotFound from "../not-found";
import { NS_VOTE_DIVISOR } from "@/constants/common";
import React from "react";
import { useExecuteAndWaitTx } from "@/hooks/useExecuteAndWaitTx";

/**
 * A dev-only page to create mock proposals.
 */
export default function DevPage() {
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
        <DevContent govCapId={govCap.data} currAddr={currAcct?.address} />
      </div>
    </Suspense>
  );
}

function DevContent({
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

function useGetGovernanceAdminCap(owner: string | undefined) {
  return useQuery({
    queryKey: ["owned-governance-admin-cap", owner],
    queryFn: async () => {
      if (!owner) return [];
      const paginatedObjects = await client.getOwnedObjects({
        owner,
        filter: {
          StructType: `${SUINS_PACKAGES[NETWORK].votingPkgId}::governance::NSGovernanceCap`,
        },
        limit: 1,
      });
      return paginatedObjects.data;
    },
    select: (suiObjResponses) => {
      for (const response of suiObjResponses) {
        return response.data?.objectId ?? null;
      }
      return null;
    },
    enabled: !!owner,
  });
}

type CreateProposalRequest = {
  govCapId: string;
  title: string;
  description: string;
  end_time_ms: number;
  reward: bigint;
};
export function useCreateProposalMutation(
  mutationOptions?: Omit<
    UseMutationOptions<string | null, Error, CreateProposalRequest>,
    "mutationFn" | "onSuccess"
  >,
): UseMutationResult<string | null, Error, CreateProposalRequest> {
  const executeAndWaitTx = useExecuteAndWaitTx();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      govCapId,
      title,
      description,
      end_time_ms,
      reward,
    }: CreateProposalRequest) => {
      const tx = new Transaction();

      const coin = coinWithBalance({
        balance: reward,
        type: SUINS_PACKAGES[NETWORK].votingTokenType,
      })(tx);

      const options = tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::voting_option::default_options`,
      });

      const proposal = tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::proposal_v2::new`,
        arguments: [
          tx.pure.string(title),
          tx.pure.string(description),
          tx.pure.u64(end_time_ms),
          options,
          coin,
          tx.object.clock(),
        ],
      });

      tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::early_voting::add_proposal_v2`,
        arguments: [
          tx.object(govCapId),
          tx.object(SUINS_PACKAGES[NETWORK].governanceObjId),
          proposal,
        ],
      });

      const resp = await executeAndWaitTx(tx);

      const proposalV2Type = `${SUINS_PACKAGES[NETWORK].votingPkgId}::proposal_v2::ProposalV2`;
      let proposalId: null | string = null;
      for (const obj of resp.objectChanges ?? []) {
        if (obj.type === "created" && obj.objectType === proposalV2Type) {
          proposalId = obj.objectId;
        }
      }

      return proposalId;
    },

    onSuccess: async () => {
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: [NETWORK, "getBalance"],
        }),
      ]);
    },
    ...mutationOptions,
  });
}

type DistributeRewardsRequest = {
  proposalId: string;
};
function useDistributeRewardsMutation(
  mutationOptions?: Omit<
    UseMutationOptions<string, Error, DistributeRewardsRequest>,
    "mutationFn" | "onSuccess"
  >,
): UseMutationResult<string, Error, DistributeRewardsRequest> {
  const executeAndWaitTx = useExecuteAndWaitTx();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ proposalId }: DistributeRewardsRequest) => {
      const tx = new Transaction();

      tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::proposal_v2::distribute_rewards`,
        arguments: [tx.object(proposalId), tx.object.clock()],
      });

      const resp = await executeAndWaitTx(tx);

      return resp.digest;
    },

    onSuccess: async () => {
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: [NETWORK, "getBalance"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["owned-batches"],
        }),
      ]);
    },
    ...mutationOptions,
  });
}
