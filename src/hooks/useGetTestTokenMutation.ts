import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import {
  useMutation,
  type UseMutationResult,
  type UseMutationOptions,
} from "@tanstack/react-query";

export const MIST_PER_SUI = 1_000_000_000;
// Estimated gas budget for claiming NS tokens
export const GAS_BUDGET = 0.01 * MIST_PER_SUI;

type VotingRequest = object;

export function useGetTestTokenMutation(
  mutationOptions?: Omit<
    UseMutationOptions<string, Error, VotingRequest>,
    "mutationFn"
  >,
): UseMutationResult<string, Error, VotingRequest> {
  const { mutateAsync: signAndExecuteTransactionBlock } =
    useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async () => {
      const txb = new Transaction();
      // txb.setSender(address);
      txb.moveCall({
        target:
          "0x70dc0c1b62885a97ac80012194b243d0d6c1b87d17dafb624f12817ab4bdcdee::token::mint",
        arguments: [
          txb.object(
            "0x7ac3183f672cc6dbda24909f66dcc04a32128963f1643949a65aeca317a75f84",
          ), //
          txb.pure.u64("10000000000"),
        ],
      });
      const resp = await signAndExecuteTransactionBlock({
        transaction: txb,
      });

      return resp.digest;
    },

    ...mutationOptions,
  });
}
