import clsx from "clsx";
import { useCurrentAccount, useCurrentWallet } from "@mysten/dapp-kit";
import { toast } from "sonner";
import { z } from "zod";

import { SectionLayout } from "@/components/vote/SectionLayout";
import { GradientBorder } from "../gradient-border";
import { VoteIndicator } from "../ui/legacy/VoteIndicator";
import { Text } from "@/components/ui/legacy/Text";
import {
  MAX_BATCHES_PER_VOTE_TX,
  useVoteV2Mutation,
} from "@/hooks/staking/useVoteV2Mutation";
import { useZodForm } from "@/hooks/useZodForm";
import { Form } from "@/components/form/Form";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { motion } from "framer-motion";
import isPast from "date-fns/isPast";
import { RadioGroupField } from "../form/RadioGroupField";
import { useEffect } from "react";
import { useGetUserStakingData } from "@/hooks/staking/useGetUserStakingData";
import { formatNSBalance } from "@/utils/coins";
import Link from "next/link";
import { useIsPersonVote } from "@/hooks/useIsPersonVote";
import Typography from "../ui/typography";
import { Button } from "../ui/button";
import { StakingUserStats } from "../staking/staking-user-stats";

const VOTE_OPTIONS = ["Yes", "No", "Abstain"] as const;

export function CastYourVoteV2({ proposalId }: { proposalId: string }) {
  const currentAccount = useCurrentAccount();
  const { isConnecting, isDisconnected } = useCurrentWallet();
  const proposal = useGetProposalDetail({ proposalId });
  const isVotingOver = isPast(
    new Date(Number(proposal.data?.fields.end_time_ms ?? 0)),
  );
  const userStaking = useGetUserStakingData(currentAccount?.address);
  const isPersonVote = useIsPersonVote(proposalId);

  const isLoggedOut = (!currentAccount && !isConnecting) ?? isDisconnected;
  const form = useZodForm({
    mode: "all",
    schema: z.object({
      vote: z.enum(VOTE_OPTIONS, { message: "A vote selection is required" }),
    }),
  });

  const {
    mutate: vote,
    isPending,
    reset,
    isSuccess,
  } = useVoteV2Mutation({
    onError: (error) => {
      console.warn("[CastYourVoteV2] error:", error);
      toast.error(error.message); // TODO-J parse error and show user-friendly message
    },
  });

  const {
    watch,
    formState: { isValid, errors },
    resetField,
  } = form;

  useEffect(() => {
    if (isSuccess) {
      reset();
      resetField("vote");
      toast.success("Successfully voted");
    }
  }, [isSuccess, reset, resetField]);

  if (proposal.isLoading || userStaking.isLoading || isVotingOver) return null;

  const allBatches = userStaking.data?.batches ?? [];
  const votingBatches = allBatches
    .filter((batch) => batch.canVote)
    .slice(0, MAX_BATCHES_PER_VOTE_TX);
  const votingPower = votingBatches.reduce(
    (acc, batch) => acc + batch.votingPower,
    0n,
  );

  const disabled =
    isLoggedOut || isPending || isVotingOver || votingPower === 0n;

  return (
    <div className="flex w-full flex-col gap-xl">
      <Typography variant="display/XXSmall Light" className="text-primary-main">
        Cast Your Vote
      </Typography>
      <SectionLayout>
        <Form
          form={form}
          onSubmit={() =>
            vote({
              proposalId,
              batchIds: votingBatches.map(
                (batch) => batch.content.fields.id.id,
              ),
              vote: watch("vote"),
            })
          }
        >
          <div className="flex w-full flex-col items-center justify-start gap-m py-xs">
            <RadioGroupField
              name="vote"
              className="flex w-full flex-col items-center justify-start gap-l"
              options={VOTE_OPTIONS.map((value) => ({
                value,
                disabled: isVotingOver,
              }))}
              disabled={disabled}
              renderOption={(option, selected) =>
                selected ? (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <GradientBorder
                      alwaysAnimate
                      variant="green_blue_pink"
                      className="overflow-hidden rounded-xs border-2"
                    >
                      <div
                        className={clsx(
                          "flex w-full justify-start bg-bg-secondary_highlight px-xl py-l",
                          disabled ? "opacity-30" : "",
                        )}
                      >
                        <div className="w-content flex">
                          <VoteIndicator
                            votedStatus={
                              option.value as "Yes" | "No" | "Abstain"
                            }
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
                    <div
                      className={clsx(
                        "flex w-full justify-start rounded-none rounded-xs border border-tertiary px-xl py-l",
                        disabled ? "opacity-30" : "",
                      )}
                    >
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
            {!isVotingOver && (
              <div className="flex w-full flex-col gap-s">
                <div className="flex w-full flex-col items-center justify-between gap-l md:flex-row">
                  <Button
                    type="submit"
                    variant="tall/gradientB"
                    disabled={disabled || !isValid}
                    className={clsx(disabled || !isValid ? "opacity-30" : "")}
                  >
                    <Typography
                      variant="label/Large Bold"
                      className="text-start text-primary-darker"
                    >
                      Vote
                    </Typography>
                  </Button>
                </div>
                {isLoggedOut ? (
                  <Typography
                    variant="paragraph/Regular"
                    className="text-center text-secondary"
                  >
                    Connect your wallet to vote.
                  </Typography>
                ) : votingPower > 0n ? (
                  <Typography
                    className="text-center text-secondary"
                    variant="paragraph/Regular"
                  >
                    All your {formatNSBalance(votingPower)} available votes will
                    be used.
                  </Typography>
                ) : (
                  <Typography
                    variant="paragraph/Regular"
                    className="text-center text-secondary"
                  >
                    You do not have any available votes to cast.{" "}
                    <Link href="/stake" className="text-link">
                      Stake or Lock to earn more votes
                    </Link>
                    .
                  </Typography>
                )}
                {!isLoggedOut && !!errors && errors.vote && (
                  <div className="mt-2 flex w-full flex-col gap-0.5">
                    <div className="mb-2 flex flex-col gap-2">
                      <Text
                        variant="B7/medium"
                        color="fillContent-issue"
                        className="w-full text-start"
                      >
                        {errors.vote.message}
                      </Text>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Form>
      </SectionLayout>
      {!(votingPower === 0n || isLoggedOut) && (
        <SectionLayout>
          <StakingUserStats showTokens={false} />
        </SectionLayout>
      )}
    </div>
  );
}
