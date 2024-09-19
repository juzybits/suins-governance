import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import {
  useMutation,
  type UseMutationResult,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

export const MIST_PER_SUI = 1_000_000_000;
// Estimated gas budget for claiming NS tokens
export const GAS_BUDGET = 0.01 * MIST_PER_SUI;

import { NETWORK } from "@/constants/env";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { client } from "@/app/SuinsClient";
import { parseAmount } from "@/utils/parseAmount";

type VotingRequest = {
  proposalId: string;
  amount: number;
  vote: "Yes" | "No" | "Abstain";
};

export function useVoteMutation(
  mutationOptions?: Omit<
    UseMutationOptions<string, Error, VotingRequest>,
    "mutationFn"
  >,
): UseMutationResult<string, Error, VotingRequest> {
  const { mutateAsync: signAndExecuteTransactionBlock } =
    useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();
  const queryClient = useQueryClient();
  const address = currentAccount?.address ?? "";

  return useMutation({
    mutationFn: async ({ proposalId, amount, vote }: VotingRequest) => {
      const txb = new Transaction();
      txb.setSender(address);
      const coinMetadata = await client.getCoinMetadata({
        coinType: SUINS_PACKAGES[NETWORK].votingTokenType,
      });
      const coins = await client.getCoins({
        owner: address,
        coinType: SUINS_PACKAGES[NETWORK].votingTokenType,
      });
      const bigIntAmount = parseAmount(amount, coinMetadata?.decimals ?? 8);

      const [primaryCoin, ...mergeCoins] =
        coins?.data?.filter(
          (coin) => coin.coinType === SUINS_PACKAGES[NETWORK].votingTokenType,
        ) || [];
      const primaryCoinInput = txb.object(primaryCoin!.coinObjectId);
      const coin = txb.splitCoins(primaryCoinInput, [bigIntAmount]);

      txb.setGasBudgetIfNotSet(GAS_BUDGET);
      txb.moveCall({
        target: SUINS_PACKAGES[NETWORK].governancePackageId,
        arguments: [
          txb.object(proposalId),
          txb.pure.string(vote),
          txb.object(coin),
          txb.object.clock(),
        ],
      });

      // txb.transferObjects([coin], txb.pure.address(address));

      const resp = await signAndExecuteTransactionBlock({
        transaction: txb,
      });

      return resp.digest;
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey.includes("proposal-detail"),
          queryKey: ["proposal-detail"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["get-vote-casted"],
          predicate: (query) => query.queryKey.includes("get-vote-casted"),
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey.includes("get-all-voter"),
          queryKey: ["get-all-voter"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey.includes("proposal-detail"),
          queryKey: ["proposal-detail"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey.includes("vote-casted-by-id"),
          queryKey: ["vote-casted-by-id"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey.includes("coin-metadata"),
          queryKey: ["coin-metadata"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey.includes("proposal-detail-2"),
          queryKey: ["proposal-detail-2"],
          refetchType: "all",
        }),
      ]);
    },
    ...mutationOptions,
  });
}
