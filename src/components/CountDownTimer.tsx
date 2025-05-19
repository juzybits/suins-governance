import { cva, type VariantProps } from "class-variance-authority";
import Countdown, { zeroPad } from "react-countdown";
import clsx from "clsx";

import { Text } from "@/components/ui/legacy/Text";
import { Heading } from "@/components/ui/legacy/Heading";
import { GradientBorder } from "./gradient-border";
import SvgColon from "@/icons/legacy/Colon";

const timeStyle = cva([], {
  variants: {
    variant: {
      body: "text-body",
      bodySmall: "text-bodySmall",
    },
    color: {
      "steel-dark": "text-steel-dark",
      "steel-darker": "text-steel-darker",
    },
    weight: {
      medium: "font-medium",
      semibold: "font-semibold",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "steel-dark",
    weight: "semibold",
  },
});

export interface CountDownTimerProps extends VariantProps<typeof timeStyle> {
  timestamp: number | undefined;
  label?: string;
  endLabel?: string;
}

type CountdownProps = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
};

function CountdownElement({
  item,
  label,
  showColon = true,
}: {
  item: number;
  label: string;
  showColon: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2024_S">
        <Heading
          variant="H4/super"
          color="fillContent-primary"
          className="leading-none"
        >
          {zeroPad(item)}
        </Heading>
        {showColon && <SvgColon />}
      </div>
      <Text
        variant="LABEL/bold"
        color="fillContent-secondary"
        className={clsx(showColon && "-ml-[15px]", "opacity-50")}
      >
        {label}
      </Text>
    </div>
  );
}

export function CountDownTimer({ timestamp }: CountDownTimerProps) {
  return (
    <GradientBorder
      variant="green_blue_pink"
      className="flex w-full items-center justify-center rounded-2024_S border-2"
      alwaysAnimate
    >
      <Countdown
        date={timestamp}
        renderer={({
          days,
          hours,
          minutes,
          seconds,
          completed,
        }: CountdownProps) => {
          // const hoursInDays = days * 24 + hours;
          if (completed) {
            return null;
          }
          return (
            <div className="flex min-w-[312px] flex-row items-start justify-center gap-2024_S py-2024_XL">
              <CountdownElement item={days} label="D" showColon />
              <CountdownElement item={hours} label="H" showColon />
              <CountdownElement item={minutes} label="M" showColon />
              <CountdownElement item={seconds} label="S" showColon={false} />
            </div>
          );
        }}
        daysInHours={false}
      />
    </GradientBorder>
  );
}
