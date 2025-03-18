import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import {
  useMutation,
  type UseMutationResult,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { NETWORK } from "@/constants/env";

export const MIST_PER_SUI = 1_000_000_000;
// Estimated gas budget for claiming NS tokens
export const GAS_BUDGET = 0.01 * MIST_PER_SUI;
const MINT_TOKENS_AMOUNT = 500_000_000_000;

type VotingRequest = object;

export function useGetTestTokenMutation(
  mutationOptions?: Omit<
    UseMutationOptions<string, Error, VotingRequest>,
    "mutationFn"
  >,
): UseMutationResult<string, Error, VotingRequest> {
  const { mutateAsync: signAndExecuteTransactionBlock } =
    useSignAndExecuteTransaction();
  const network = NETWORK === "mainnet" ? "mainnet" : "testnet";

  return useMutation({
    mutationFn: async () => {
      const txb = new Transaction();
      if (network === "mainnet") {
        throw new Error("Cannot mint test tokens on mainnet");
      }
      txb.moveCall({
        target: SUINS_PACKAGES[NETWORK].votingPkgId + "::token::mint",
        arguments: [
          txb.object(SUINS_PACKAGES[NETWORK].faucet), //
          txb.pure.u64(MINT_TOKENS_AMOUNT),
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
