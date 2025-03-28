import clsx from "clsx";
import { useCurrentAccount, useCurrentWallet } from "@mysten/dapp-kit";
import { toast } from "sonner";
import { z } from "zod";

import { SectionLayout } from "@/components/SectionLayout";
import { Button } from "@/components/ui/button/Button";
import { GradientBorder } from "./gradient-border";
import { VoteIndicator } from "./ui/VoteIndicator";
import { Text } from "@/components/ui/Text";
import { useVoteV2Mutation } from "@/hooks/staking/useVoteV2Mutation";
import { useZodForm } from "@/hooks/useZodForm";
import { Form } from "@/components/form/Form";
import { useGetBalance } from "@/hooks/useGetBalance";
import { NETWORK } from "@/constants/env";
import { SUINS_PACKAGES } from "@/constants/endpoints";
import { useGetProposalDetail } from "@/hooks/useGetProposalDetail";
import { motion } from "framer-motion";
import isPast from "date-fns/isPast";
import { RadioGroupField } from "./form/RadioGroupField";
import { useEffect } from "react";

const VOTE_OPTIONS = ["Yes", "No", "Abstain"] as const;

export function CastYourVoteV2({ proposalId }: { proposalId: string }) {
  const currentAccount = useCurrentAccount();
  const { isConnecting, isDisconnected } = useCurrentWallet();
  const { data: proposalDetail, isLoading } = useGetProposalDetail({
    proposalId,
  });
  const isInactiveProposal = isPast(
    new Date(Number(proposalDetail?.fields.end_time_ms ?? 0)),
  );

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
      toast.error(error.message);
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

  if (isLoading) {
    return null;
  }

  return (
    <SectionLayout title="Cast Your Votes" isLarge>
      <Form
        form={form}
        onSubmit={() =>
          vote({
            proposalId,
            batchIds: [],
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
          {!isInactiveProposal && (
            <div className="flex w-full flex-col gap-2024_S">
              <div className="flex w-full flex-col items-center justify-between gap-2024_L md:flex-row">
                <Button
                  gradient="fill/orange_pink_blue"
                  className={clsx(
                    "h-2024_3.5XL w-full max-w-full items-center !rounded-2024_M",
                    isLoggedOut && "!max-w-full",
                  )}
                  disabled={isLoggedOut || !isValid || isPending || isInactiveProposal}
                  type="submit"
                >
                  <Text variant="B4/bold" color="fillContent-primary-darker" className="text-start">
                    Vote
                  </Text>
                </Button>
              </div>
              {!isLoggedOut && (
                <div className="mt-2 flex w-full flex-col gap-0.5">
                  {!!errors ? (
                    <div className="mb-2 flex flex-col gap-2">
                      {errors.vote && (
                        <Text variant="B7/medium" color="fillContent-issue" className="w-full text-start">
                          {errors.vote.message}
                        </Text>
                      )}
                    </div>
                  ) : null}
                  <Text variant="B5/medium" color="fillContent-secondary" className="w-full text-start">
                    Tokens can not be withdrawn until the end of the voting period
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
