import clsx from "clsx";
import { useCurrentAccount, useCurrentWallet } from "@mysten/dapp-kit";
import { toast } from "sonner";
import { z } from "zod";

import { api } from "@/trpc/react";
import { SectionLayout } from "@/components/SectionLayout";
import { Button } from "@/components/ui/button/Button";
import { GradientBorder } from "./gradient-border";
import { VoteIndicator } from "./ui/VoteIndicator";
import { Text } from "@/components/ui/Text";
import NSToken from "@/icons/NSToken";
import { useVoteMutation } from "@/hooks/useVoteMutation";
import { useZodForm } from "@/hooks/useZodForm";
import { Form } from "@/components/form/Form";
import { useGetBalance } from "@/hooks/useGetBalance";
import { NETWORK } from "@/constants/env";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { motion } from "framer-motion";

import { RadioGroupField } from "./form/RadioGroupField";
import { useEffect } from "react";

const VOTE_OPTIONS = ["Yes", "No", "Abstain"] as const;

export function CastYourVote({ proposalId }: { proposalId: string }) {
  const currentAccount = useCurrentAccount();
  const { isConnecting, isDisconnected } = useCurrentWallet();
  const address = currentAccount?.address;
  const { data: activeProposal } = api.post.getIsProposalActive.useQuery();
  const { data: balance } = useGetBalance({
    owner: address,
    coinType: SUINS_PACKAGES[NETWORK].votingTokenType,
  });
  const tokenBalance = Number(balance?.formatted?.replaceAll(",", "") ?? 0);
  const isLoggedOut = (!currentAccount && !isConnecting) ?? isDisconnected;
  const form = useZodForm({
    mode: "all",
    schema: z.object({
      amount: z.coerce.number().int().positive().max(tokenBalance),

      vote: z.enum(VOTE_OPTIONS, { message: "A vote selection is required" }),
    }),
  });

  const {
    mutate: vote,
    isPending,
    reset,
    isSuccess,
  } = useVoteMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    watch,
    setValue,
    formState: { isValid, errors },
    register,
    resetField,
  } = form;

  useEffect(() => {
    if (isSuccess) {
      reset();
      resetField("amount");
      resetField("vote");
      toast.success("Successfully voted");
    }
  }, [isSuccess, reset, resetField]);
  const isInactiveProposal = activeProposal?.isProposalActive !== proposalId;
  const amount = watch("amount");
  return (
    <SectionLayout title="Cast Your Votes" isLarge>
      <Form
        form={form}
        onSubmit={() =>
          vote({
            proposalId,
            amount: watch("amount"),
            vote: watch("vote"),
          })
        }
      >
        <div className="flex w-full flex-col items-center justify-start gap-2024_R py-2024_S">
          <RadioGroupField
            name="vote"
            className="flex w-full flex-col items-center justify-start gap-2024_R"
            options={VOTE_OPTIONS.map((value) => ({
              value,
              disabled: isInactiveProposal,
            }))}
            disabled={isLoggedOut}
            renderOption={(option, selected) =>
              selected ? (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <GradientBorder
                    variant="green_blue_pink"
                    alwaysAnimate
                    className="flex w-full items-center justify-start overflow-hidden rounded-[16px] border-2024_3"
                  >
                    <div className="flex w-full justify-start rounded-none !bg-2024_fillBackground-secondary-Highlight bg-transparent px-2024_XL py-2024_L">
                      <div className="w-content flex">
                        <VoteIndicator
                          votedStatus={option.value as "Yes" | "No" | "Abstain"}
                          size="medium"
                        />
                      </div>
                    </div>
                  </GradientBorder>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <div className="flex w-full justify-start rounded-[16px] border border-2024_fillContent-tertiary bg-transparent px-2024_XL py-2024_L">
                    <div className="w-content flex">
                      <VoteIndicator
                        votedStatus={option.value as "Yes" | "No" | "Abstain"}
                        size="medium"
                      />
                    </div>
                  </div>
                </motion.div>
              )
            }
          />

          <div className="flex w-full flex-col gap-2024_S">
            <div className="flex w-full flex-col items-center justify-between gap-2024_L md:flex-row">
              {!isLoggedOut && (
                <div className="relative w-full rounded-2024_20 bg-2024_fillContent-primary-darker">
                  <NSToken className="absolute left-2024_XL top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white" />
                  <input
                    type="number"
                    {...register("amount")}
                    className={clsx(
                      "flex h-full w-full items-center rounded-2024_20 bg-2024_fillContent-primary-darker px-2024_XL py-2024_M pl-[50px] text-2024_body3 font-bold leading-normal text-2024_fillContent-secondary caret-2024_pink transition-all placeholder:text-2024_body4 placeholder:!leading-normal placeholder:text-2024_fillContent-primary-inactive focus:outline-none focus:placeholder:text-transparent",
                    )}
                    disabled={isInactiveProposal}
                    placeholder="Enter token amount"
                  />
                  <div className="absolute right-2024_XL top-1/2 -translate-y-1/2">
                    <button
                      onClick={() => {
                        setValue("amount", tokenBalance);
                      }}
                      type="button"
                    >
                      <Text
                        variant="B7/medium"
                        color={tokenBalance <= amount ? "darkPink" : "pink"}
                        className="text-start"
                      >
                        MAX
                      </Text>
                    </button>
                  </div>
                </div>
              )}

              <Button
                gradient="fill/orange_pink_blue"
                className={clsx(
                  "h-2024_3.5XL w-full max-w-full items-center !rounded-2024_M md:max-w-[151px]",
                  isLoggedOut && "!max-w-full",
                )}
                disabled={
                  isLoggedOut || !isValid || isPending || isInactiveProposal
                }
                type="submit"
              >
                <Text
                  variant="B4/bold"
                  color="fillContent-primary-darker"
                  className="text-start"
                >
                  Vote
                </Text>
              </Button>
            </div>
            {!isLoggedOut && (
              <div className="mt-2 flex w-full flex-col gap-0.5">
                {!!errors ? (
                  <div className="mb-2 flex flex-col gap-2">
                    {errors.vote && (
                      <Text
                        variant="B7/medium"
                        color="fillContent-issue"
                        className="w-full text-start"
                      >
                        {errors.vote.message}
                      </Text>
                    )}
                    {errors.amount && (
                      <Text
                        variant="B7/medium"
                        color="fillContent-issue"
                        className="w-full text-start"
                      >
                        {errors.amount.message}
                      </Text>
                    )}
                  </div>
                ) : null}
                <Text
                  variant="B5/medium"
                  color="fillContent-secondary"
                  className="w-full text-start"
                >
                  You have <b>{balance?.formatted} NS</b> tokens.
                </Text>
                <Text
                  variant="B5/medium"
                  color="fillContent-secondary"
                  className="w-full text-start"
                >
                  Tokens can not be withdrawn until the end of the voting period
                </Text>
              </div>
            )}
          </div>
        </div>
      </Form>
    </SectionLayout>
  );
}
