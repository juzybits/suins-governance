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
          "0xbf38d3107fbf24f2be4b6ac3e01613cc541fa92d34ecb37f346fd951d636b2c8::token::mint",
        arguments: [
          txb.object(
            "0x2b35f4365c63522a030d69aa3972e4759e514dcf89ea3b5a76d0be685635fc34",
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
