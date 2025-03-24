import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import {
  useMutation,
  type UseMutationResult,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

import { NETWORK } from "@/constants/env";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { parseAmount } from "@/utils/parseAmount";

type StakingRequest = {
  amount: string;
  months: number;
};

const NS_DECIMALS = 6;

export function useStakeMutation(
  mutationOptions?: Omit<
    UseMutationOptions<string, Error, StakingRequest>,
    "mutationFn"
  >
): UseMutationResult<string, Error, StakingRequest> {
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const currAcct = useCurrentAccount();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, months }: StakingRequest) => {
      if (!currAcct) {
        throw new Error("No account selected");
      }

      const tx = new Transaction();
      tx.setSender(currAcct.address);

      const amountBigInt = parseAmount(amount, NS_DECIMALS);

      const coin = coinWithBalance({
        balance: amountBigInt,
        type: SUINS_PACKAGES[NETWORK].votingTokenType,
      })(tx);

      const batch = tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::new`,
        arguments: [
          tx.object(SUINS_PACKAGES[NETWORK].stakingConfigId),
          coin,
          tx.pure.u64(months),
          tx.object.clock(),
        ],
      });

      tx.moveCall({
        target: `${SUINS_PACKAGES[NETWORK].votingPkgId}::staking_batch::keep`,
        arguments: [
          batch,
        ]
      });

      // TODO remove / enable only on dev
      const dryRunResult = await suiClient.devInspectTransactionBlock({
        sender: currAcct.address,
        transactionBlock: tx,
      });
      if (dryRunResult.effects?.status.status !== "success") {
        throw new Error("Transaction failed: " + JSON.stringify(dryRunResult, null, 2));
      }

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
        queryClient.invalidateQueries(),
        queryClient.invalidateQueries({
          queryKey: ["owned-staking-batches"],
        }),
      ]);
    },
    ...mutationOptions,
  });
}
