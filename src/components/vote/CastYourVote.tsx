import clsx from "clsx";
import { useCurrentAccount, useCurrentWallet } from "@mysten/dapp-kit";
import { toast } from "sonner";
import { z } from "zod";

import { SectionLayout } from "@/components/vote/SectionLayout";
import { Button } from "@/components/ui/legacy/button/Button";
import { GradientBorder } from "../gradient-border";
import { VoteIndicator } from "../ui/legacy/VoteIndicator";
import { Text } from "@/components/ui/legacy/Text";
import NSToken from "@/icons/legacy/NSToken";
import { useVoteMutation } from "@/hooks/useVoteMutation";
import { useZodForm } from "@/hooks/useZodForm";
import { Form } from "@/components/form/Form";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { motion } from "framer-motion";
import isPast from "date-fns/isPast";
import { RadioGroupField } from "../form/RadioGroupField";
import { useEffect } from "react";
import { useGetOwnedNSBalance } from "@/hooks/useGetOwnedNSBalance";
import { useIsPersonVote } from "@/hooks/useIsPersonVote";

const VOTE_OPTIONS = ["Yes", "No", "Abstain"] as const;

/**
 * @deprecated Use `CastYourVoteV2` instead.
 */
export function CastYourVote({ proposalId }: { proposalId: string }) {
  const currentAccount = useCurrentAccount();
  const { isConnecting, isDisconnected } = useCurrentWallet();
  const { data: proposalDetail, isLoading } = useGetProposalDetail({
    proposalId,
  });
  const isInactiveProposal = isPast(
    new Date(Number(proposalDetail?.fields.end_time_ms ?? 0)),
  );

  const isPersonVote = useIsPersonVote(proposalId);
  const { data: balance } = useGetOwnedNSBalance(currentAccount?.address);

  const tokenBalance = Number(balance?.formatted?.replaceAll(",", "") ?? 0);
  const isLoggedOut = (!currentAccount && !isConnecting) ?? isDisconnected;
  const form = useZodForm({
    mode: "all",
    schema: z.object({
      amount: z.coerce.number().positive().max(tokenBalance),

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

  if (isLoading) {
    return null;
  }
  const amount = watch("amount");

  return (
    <SectionLayout title="Cast Your Votes">
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
        <div className="gap-2024_R py-2024_S flex w-full flex-col items-center justify-start">
          <RadioGroupField
            name="vote"
            className="gap-2024_R flex w-full flex-col items-center justify-start"
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
                    className="border-2024_3 flex w-full items-center justify-start overflow-hidden rounded-[16px]"
                  >
                    <div className="!bg-2024_fillBackground-secondary-Highlight px-2024_XL py-2024_L flex w-full justify-start rounded-none bg-transparent">
                      <div className="w-content flex">
                        <VoteIndicator
                          votedStatus={option.value as "Yes" | "No" | "Abstain"}
                          size="medium"
                          isPersonVote={isPersonVote}
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
                  <div className="border-2024_fillContent-tertiary px-2024_XL py-2024_L flex w-full justify-start rounded-[16px] border bg-transparent">
                    <div className="w-content flex">
                      <VoteIndicator
                        votedStatus={option.value as "Yes" | "No" | "Abstain"}
                        size="medium"
                        isPersonVote={isPersonVote}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            }
          />
          {!isInactiveProposal && (
            <div className="gap-2024_S flex w-full flex-col">
              <div className="gap-2024_L flex w-full flex-col items-center justify-between md:flex-row">
                {!isLoggedOut && (
                  <div className="rounded-2024_20 bg-2024_fillContent-primary-darker relative w-full">
                    <NSToken className="left-2024_XL absolute top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white" />
                    <input
                      type="number"
                      step="0.000001"
                      {...register("amount")}
                      className={clsx(
                        "rounded-2024_20 bg-2024_fillContent-primary-darker px-2024_XL py-2024_M text-2024_body3 text-2024_fillContent-secondary caret-2024_pink placeholder:text-2024_body4 placeholder:text-2024_fillContent-primary-inactive flex h-full w-full items-center pl-[50px] font-bold leading-normal transition-all placeholder:!leading-normal focus:outline-none focus:placeholder:text-transparent",
                      )}
                      disabled={isInactiveProposal}
                      placeholder="Enter token amount"
                    />
                    <div className="right-2024_XL absolute top-1/2 -translate-y-1/2">
                      <button
                        onClick={() => {
                          setValue("amount", tokenBalance, {
                            shouldValidate: true,
                          });
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
                    "h-2024_3.5XL !rounded-2024_M w-full max-w-full items-center md:max-w-[151px]",
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
                    Tokens can not be withdrawn until the end of the voting
                    period
                  </Text>
                </div>
              )}
            </div>
          )}
        </div>
      </Form>
    </SectionLayout>
  );
}
