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
      if (mergeCoins.length) {
        // TODO: This could just merge a subset of coins that meet the balance requirements instead of all of them.
        txb.mergeCoins(
          primaryCoinInput,
          mergeCoins.map((coin) => txb.object(coin.coinObjectId)),
        );
      }

      const coin = txb.splitCoins(primaryCoinInput, [bigIntAmount]);

      txb.setGasBudgetIfNotSet(GAS_BUDGET);
      txb.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].packageId}::proposal::vote`,
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

      return resp.digest;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
    ...mutationOptions,
  });
}
