"use client";

import { client } from "@/app/SuinsClient";
import Loader from "@/components/ui/Loader";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { devInspectOnDev } from "@/utils/devInspectOnDev";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { useMutation, type UseMutationOptions, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { Suspense } from "react";
import NotFound from "../not-found";
import { NS_VOTE_DIVISOR } from "@/constants/common";

/**
 * A dev-only page to create mock proposals.
 */
export default function DevPage() {
  if (process.env.NODE_ENV !== "development") {
    return <NotFound />;
  }

  const currAcct = useCurrentAccount();
  const govCap = useGetGovernanceAdminCap(currAcct?.address);

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

  if (!currAddr) {
    return <div>Connect your wallet to continue.</div>;
  }
  if (!govCapId) {
    return <div>NSGovernanceCap not found in your wallet.</div>;
  }

  return <>
  <div className="panel">
      <button onClick={() => {
        createProposal({
          govCapId,
          title: "Test Proposal",
          description: "This is a test proposal",
          end_time_ms: Date.now() + 1000 * 60, // 1 minute
          reward: BigInt(50 * NS_VOTE_DIVISOR), // 50 NS
        });
      }}>Create Proposal</button>
    </div>
  </>;
}

function useGetGovernanceAdminCap(
  owner: string | undefined,
) {
  return useQuery({
    queryKey: ["owned-governance-admin-cap", owner],
    queryFn: async () => {
      if (!owner) return [];
      const paginatedObjects = await client.getOwnedObjects({
        owner,
        filter: {
          StructType: `${SUINS_PACKAGES[NETWORK].votingPkgId}::governance::NSGovernanceCap`
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
};

type CreateProposalRequest = {
  govCapId: string;
  title: string;
  description: string;
  end_time_ms: number;
  reward: bigint;
};
export function useCreateProposalMutation(
  mutationOptions?: Omit<
    UseMutationOptions<string, Error, CreateProposalRequest>,
    "mutationFn"
  >
): UseMutationResult<string, Error, CreateProposalRequest> {
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const currAcct = useCurrentAccount();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ govCapId, title, description, end_time_ms, reward }: CreateProposalRequest) => {
      if (!currAcct) {
        throw new Error("Wallet not connected");
      }

      const tx = new Transaction();
      tx.setSender(currAcct.address);

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

      await devInspectOnDev(suiClient, currAcct.address, tx);
      const resp = await signAndExecuteTransaction({
        transaction: tx,
      });

      await suiClient.waitForTransaction({
        digest: resp.digest,
        pollInterval: 200,
      });

      return resp.digest;
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
