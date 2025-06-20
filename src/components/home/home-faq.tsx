import { useState, type FC } from "react";
import Typography from "../ui/typography";
import PlusSVG from "@/icons/plus";
import MinusSVG from "@/icons/minus";
import Table from "../ui/table";
import Checklist from "../ui/checklist";

export const HomeFAQ: FC = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="flex w-full max-w-[50rem] flex-col px-m">
      <div className="my-3xl flex w-full max-w-[50rem] flex-col border-secondary">
        <h2 className="mb-xl text-center">
          <Typography variant="display/Regular" className="text-primary-main">
            FAQ
          </Typography>
        </h2>
        <hr className="border-inherit opacity-50" />
        <h3
          className="flex cursor-pointer justify-between gap-l py-l"
          onClick={() => setActive((a) => (a === 0 ? null : 0))}
        >
          <Typography
            variant="heading/Small Bold"
            className="text-primary-main"
          >
            How does staking work?
          </Typography>
          {active === 0 ? (
            <MinusSVG width="100%" className="max-w-[1rem] text-secondary" />
          ) : (
            <PlusSVG width="100%" className="max-w-[1.5rem] text-secondary" />
          )}
        </h3>
        {active === 0 && (
          <div>
            <p>
              <Typography variant="paragraph/Large" className="text-secondary">
                Stake your tokens with flexibility to unstake anytime (after
                cooldown period)
              </Typography>
            </p>
            <br />
            <div className="flex flex-col gap-xs">
              <h4>
                <Typography
                  variant="label/Small Bold"
                  className="text-tertiary"
                >
                  KEY FEATURES:
                </Typography>
              </h4>
              <Checklist
                list={[
                  "Start with 1:1 Votes (1 NS = 1 Vote)",
                  "Earn +10% Votes every 30 days",
                  "Maximum multiplier of 2.85x after 360 days",
                  "3-day cooldown period for unstaking",
                  "tack multiple staking positions independently",
                ]}
              />
            </div>
            <br />
            <div className="mb-2xl flex flex-col gap-m">
              <h4>
                <Typography
                  variant="label/Small Bold"
                  className="text-tertiary"
                >
                  VOTES GROWTH TABLE:
                </Typography>
              </h4>
              <Table
                header={["Month", "Votes Multiplier"]}
                content={[
                  ["1 (Day 1-30)", "1x"],
                  ["2 (Day 31-60)", "1.10x"],
                  ["3 (Day 61-90)", "1.21x"],
                  ["12 (Day 331-360)", "2.85x"],
                  ["13 (Day 361-390)", "2.85x"],
                ]}
              />
            </div>
          </div>
        )}
        <hr className="border-inherit opacity-50" />
        <h3
          onClick={() => setActive((a) => (a === 1 ? null : 1))}
          className="flex cursor-pointer justify-between gap-l py-l"
        >
          <Typography
            variant="heading/Small Bold"
            className="text-primary-main"
          >
            How does token locking work?
          </Typography>
          {active === 1 ? (
            <MinusSVG width="100%" className="max-w-[1rem] text-secondary" />
          ) : (
            <PlusSVG width="100%" className="max-w-[1.5rem] text-secondary" />
          )}
        </h3>
        {active === 1 && (
          <div>
            <p>
              <Typography variant="paragraph/Large" className="text-secondary">
                Lock your tokens for higher immediate Votes multipliers
              </Typography>
            </p>
            <br />
            <div className="flex flex-col gap-xs">
              <h4>
                <Typography
                  variant="label/Small Bold"
                  className="text-tertiary"
                >
                  KEY FEATURES:
                </Typography>
              </h4>
              <Checklist
                list={[
                  "Immediate Votes boost based on lock duration",
                  "Up to 3x multiplier for 12-month locks",
                  "Tokens convert to regular staking after lock period",
                  "Create multiple locked positions with different durations",
                ]}
              />
            </div>
            <br />
            <div className="mb-2xl flex flex-col gap-m">
              <h4>
                <Typography
                  variant="label/Small Bold"
                  className="text-tertiary"
                >
                  LOCK DURATION BENEFITS:
                </Typography>
              </h4>
              <Table
                header={[
                  "Month",
                  "Immediate Multiplier",
                  "Additional Benefits",
                ]}
                content={[
                  ["1 Month", "1.10x", "Minimum commitment for enhanced Votes"],
                  ["2 Months", "1.33x", "Quarterly commitment bonus"],
                  [
                    "6 Months",
                    "1.77x",
                    "Mid-term commitment with significant boost",
                  ],
                  ["12 Months", "3.00x", "Maximum multiplier with 0.15 bonus"],
                ]}
              />
            </div>
          </div>
        )}
        <hr className="border-inherit opacity-50" />
        <h3
          onClick={() => setActive((a) => (a === 2 ? null : 2))}
          className="flex cursor-pointer justify-between gap-l py-l"
        >
          <Typography
            variant="heading/Small Bold"
            className="text-primary-main"
          >
            Votes & rewards
          </Typography>
          {active === 2 ? (
            <MinusSVG width="100%" className="max-w-[1rem] text-secondary" />
          ) : (
            <PlusSVG width="100%" className="max-w-[1.5rem] text-secondary" />
          )}
        </h3>
        {active === 2 && (
          <div>
            <p>
              <Typography variant="paragraph/Large" className="text-secondary">
                Understanding how it works
              </Typography>
            </p>
            <br />
            <div className="flex flex-col gap-xs">
              <h4>
                <Typography
                  variant="label/Small Bold"
                  className="text-tertiary"
                >
                  KEY FEATURES:
                </Typography>
              </h4>
              <Checklist
                list={[
                  "Each governance proposal has its own reward pool",
                  "Your share of rewards is proportional to your Votes",
                  "Rewards are distributed automatically after proposal completion",
                  "3-day cooldown period for unstaking",
                ]}
              />
            </div>

            <br />
            <div className="mb-2xl flex flex-col gap-m">
              <h4>
                <Typography
                  variant="label/Small Bold"
                  className="text-tertiary"
                >
                  EXAMPLE SCENARIOS:
                </Typography>
              </h4>
              <Table
                header={[
                  "Scenario",
                  "Scenario",
                  "Lock Period",
                  "Votes",
                  "Rewards",
                ]}
                content={[
                  ["Basic Staking", "100 NS", "None", "1000 Votes", "1x share"],
                  [
                    "6mo Staking",
                    "1000 NS",
                    "None (6mo elapsed)",
                    "1770 Votes",
                    "1.77x share",
                  ],
                  [
                    "12mo Staking",
                    "1000 NS",
                    "12 Months",
                    "3000 Votes",
                    "3x share",
                  ],
                ]}
              />
            </div>
          </div>
        )}
        <hr className="border-inherit opacity-50" />
      </div>
    </div>
  );
};
