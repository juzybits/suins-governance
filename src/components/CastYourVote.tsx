import clsx from "clsx";
import { useCurrentAccount, useCurrentWallet } from "@mysten/dapp-kit";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { motion } from "framer-motion";

import { SectionLayout } from "@/components/SectionLayout";
import { Button } from "./ui/button/Button";
import { GradientBorder } from "./gradient-border";
import { VoteIndicator } from "./ui/VoteIndicator";
import { Text } from "@/components/ui/Text";
import NSToken from "@/icons/NSToken";

import { useState } from "react";

const VOTE_OPTIONS = ["Yes", "No", "Abstain"] as const;

export function CastYourVote() {
  const [selectedValue, setSelectedValue] = useState("yes");
  const currentAccount = useCurrentAccount();
  const { isConnecting, isDisconnected } = useCurrentWallet();
  const isLoggedOut = (!currentAccount && !isConnecting) || isDisconnected;
  return (
    <SectionLayout title="Cast Your Votes">
      <div className="flex w-full flex-col items-center justify-start gap-2024_R py-2024_S">
        <RadioGroup.Root
          className="flex w-full flex-col items-center justify-start gap-2024_R"
          value={selectedValue}
          onValueChange={(value) => setSelectedValue(value)}
          disabled={isLoggedOut}
        >
          {VOTE_OPTIONS.map((option) => (
            <RadioGroup.Item value={option} className="w-full" key={option}>
              {option === selectedValue ? (
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
                    <div className="flex w-full justify-start rounded-none bg-transparent px-2024_XL py-2024_L">
                      <div className="w-content flex">
                        <VoteIndicator votedStatus={option} size="medium" />
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
                      <VoteIndicator votedStatus={option} size="medium" />
                    </div>
                  </div>
                </motion.div>
              )}
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
        <div className="flex w-full flex-col gap-2024_S">
          <div className="flex w-full flex-col items-center justify-between gap-2024_L md:flex-row">
            {!isLoggedOut && (
              <div className="relative w-full rounded-2024_20 bg-2024_fillContent-primary-darker">
                <NSToken className="absolute left-2024_XL top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white" />
                <input
                  autoComplete="off"
                  type="text"
                  className={clsx(
                    "h-full w-full rounded-2024_20 bg-2024_fillContent-primary-darker px-2024_XL py-2024_M pl-[48px] text-2024_body3 font-bold leading-none text-2024_fillContent-secondary caret-2024_pink transition-all placeholder:text-2024_fillContent-primary-inactive focus:outline-none focus:placeholder:text-transparent",
                  )}
                  placeholder="280.0"
                />
                <div className="absolute right-2024_XL top-1/2 -translate-y-1/2">
                  <button>
                    <Text
                      variant="B7/medium"
                      color="pink"
                      className="text-start opacity-30"
                    >
                      Max
                    </Text>
                  </button>
                </div>
              </div>
            )}

            <Button
              gradient="fill/orange_pink_blue"
              className={clsx(
                "h-2024_3.5XL w-full max-w-full !rounded-2024_M md:max-w-[151px]",
                isLoggedOut && "!max-w-full",
              )}
              disabled={isLoggedOut}
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
            <div className="flex w-full flex-col">
              <Text
                variant="B7/medium"
                color="fillContent-secondary"
                className="w-full text-start"
              >
                You have <b>280.00 $NS</b> tokens.
              </Text>
              <Text
                variant="B7/medium"
                color="fillContent-secondary"
                className="w-full text-start"
              >
                Tokens can not be withdrawn until the end of the voting period.
              </Text>
            </div>
          )}
        </div>
      </div>
    </SectionLayout>
  );
}
