import Countdown, { zeroPad } from "react-countdown";
import clsx from "clsx";

import { GradientBorder } from "../gradient-border";
import SvgColon from "@/icons/legacy/Colon";
import Typography from "../ui/typography";

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
      <div className="flex items-center justify-center gap-s">
        <Typography
          variant="display/Small"
          className="leading-none text-primary-main"
        >
          {zeroPad(item)}
        </Typography>
        {showColon && <SvgColon />}
      </div>
      <Typography
        variant="label/Small Bold"
        className={clsx(
          "text-secondary",
          showColon && "-ml-[15px]",
          "opacity-50",
        )}
      >
        {label}
      </Typography>
    </div>
  );
}

export function CountDownTimer({ timestamp }: { timestamp: number }) {
  return (
    <GradientBorder
      alwaysAnimate
      variant="green_blue_pink"
      className="flex w-full items-center justify-center rounded-l-s rounded-r-s border-2"
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
          if (completed) return null;

          return (
            <div className="flex min-w-[312px] flex-row items-start justify-center gap-s py-xl">
              {days && <CountdownElement item={days} label="D" showColon />}
              <CountdownElement item={hours} label="H" showColon />
              <CountdownElement item={minutes} label="M" showColon={!days} />
              {!days && (
                <CountdownElement item={seconds} label="S" showColon={false} />
              )}
            </div>
          );
        }}
        daysInHours={false}
      />
    </GradientBorder>
  );
}
