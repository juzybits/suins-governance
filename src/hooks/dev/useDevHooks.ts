import { client } from "@/app/SuinsClient";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useExecuteAndWaitTx } from "@/hooks/useExecuteAndWaitTx";

export function useGetGovernanceAdminCap(owner: string | undefined) {
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
      for (const resp of suiObjResponses) {
        return resp.data?.objectId ?? null;
      }
      return null;
    },
    enabled: !!owner,
  });
}

export type CreateProposalRequest = {
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

export type DistributeRewardsRequest = {
  proposalId: string;
};

export function useDistributeRewardsMutation(
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
        arguments: [
          tx.object(proposalId),
          tx.object(SUINS_PACKAGES[NETWORK].stakingStatsId),
          tx.object.clock(),
        ],
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
