import clsx from "clsx";

import SvgLocked from "@/icons/Locked";
import SvgXFill16 from "@/icons/XFill16";
import SvgCheckFill24 from "@/icons/CheckFill24";
import { Text } from "@/components/ui/Text";

export function VoteIndicator({
  votedStatus,
  onlyStatus,
  size = "small",
}: {
  votedStatus: "Yes" | "No" | "Abstain";
  onlyStatus?: boolean;
  size?: "small" | "medium";
}) {
  const fontSize = size === "small" ? "B6/bold" : "B3/bold";

  switch (votedStatus) {
    case "No":
      return (
        <div
          className={clsx(
            "flex items-center justify-center",
            size === "small" ? "gap-2024_XS" : "gap-2024_S",
          )}
        >
          {onlyStatus ? null : (
            <SvgXFill16
              className={clsx(size === "small" ? "h-3 w-3" : "h-6 w-6")}
            />
          )}
          <Text variant={fontSize} color="issue-dark">
            No
          </Text>
        </div>
      );

    case "Abstain":
      return (
        <div
          className={clsx(
            "flex items-center justify-center",
            size === "small" ? "gap-2024_XS" : "gap-2024_S",
          )}
        >
          {onlyStatus ? null : (
            <SvgLocked
              className={clsx(size === "small" ? "h-3 w-3" : "h-6 w-6")}
            />
          )}
          <Text variant={fontSize} color="warning">
            Abstain
          </Text>
        </div>
      );
    case "Yes":
      return (
        <div
          className={clsx(
            "flex items-center justify-center",
            size === "small" ? "gap-2024_XS" : "gap-2024_S",
          )}
        >
          {onlyStatus ? null : (
            <SvgCheckFill24
              className={clsx(size === "small" ? "h-3 w-3" : "h-6 w-6")}
              color="#4BFFA6"
            />
          )}
          <Text variant={fontSize} color="good">
            Yes
          </Text>
        </div>
      );
  }
}
