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

/**
 * @deprecated Use `useVoteV2Mutation` instead.
 */
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
        coinType: SUINS_PACKAGES[NETWORK].coinType,
      });
      const coins = await client.getCoins({
        owner: address,
        coinType: SUINS_PACKAGES[NETWORK].coinType,
      });
      const bigIntAmount = parseAmount(amount, coinMetadata?.decimals ?? 8);

      const [primaryCoin, ...mergeCoins] =
        coins?.data?.filter(
          (coin) => coin.coinType === SUINS_PACKAGES[NETWORK].coinType,
        ) || [];
      const primaryCoinInput = txb.object(primaryCoin!.coinObjectId);
      if (mergeCoins.length) {
        txb.mergeCoins(
          primaryCoinInput,
          mergeCoins.map((coin) => txb.object(coin.coinObjectId)),
        );
      }

      const coin = txb.splitCoins(primaryCoinInput, [bigIntAmount]);

      txb.setGasBudgetIfNotSet(GAS_BUDGET);
      txb.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::proposal::vote`,
        arguments: [
          txb.object(proposalId),
          txb.pure.string(vote),
          txb.object(coin),
          txb.object.clock(),
        ],
      });

      // try {
      //   const dryRun = await client.dryRunTransactionBlock({
      //     transactionBlock: await txb.build({ client }),
      //   });
      //   console.log(dryRun, "dryRun");
      // } catch (error) {
      //   console.error(error);
      // }

      // txb.transferObjects([coin], txb.pure.address(address));

      const resp = await signAndExecuteTransactionBlock({
        transaction: txb,
      });
      await client.waitForTransaction({
        digest: resp.digest,
      });
      return resp.digest;
    },

    onSuccess: async () => {
      await Promise.allSettled([
        queryClient.invalidateQueries(),
        queryClient.invalidateQueries({
          queryKey: ["get-vote-casted"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["proposal-detail-by-id"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["get-all-voter"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["vote-casted-by-id"],
        }),
      ]);
    },
    ...mutationOptions,
  });
}
