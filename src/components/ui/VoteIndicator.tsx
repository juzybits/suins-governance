import clsx from "clsx";

import SvgLocked from "@/icons/Locked";
import SvgXFill16 from "@/icons/XFill16";
import SvgCheckFill24 from "@/icons/CheckFill24";
import SvgPersonIcon from "@/icons/PersonIcon";
import { Text } from "@/components/ui/Text";

export function VoteIndicator({
  votedStatus,
  onlyStatus,
  size = "small",
  isPersonVote = false,
}: {
  votedStatus: "Yes" | "No" | "Abstain";
  onlyStatus?: boolean;
  size?: "small" | "medium";
  isPersonVote?: boolean;
}) {
  const fontSize = size === "small" ? "B6/bold" : "B3/bold";

  switch (votedStatus) {
    case "No":
      return (
        <div
          className={clsx(
            "flex items-center justify-end",
            size === "small" ? "gap-2024_XS" : "gap-2024_S",
          )}
        >
          {onlyStatus ? null : isPersonVote ? (
            <SvgPersonIcon
              className={clsx(
                "text-issue-dark",
                size === "small" ? "h-3 w-3" : "h-6 w-6",
              )}
            />
          ) : (
            <SvgXFill16
              className={clsx(size === "small" ? "h-3 w-3" : "h-6 w-6")}
            />
          )}
          <Text variant={fontSize} color="issue-dark">
            {isPersonVote ? "Team 2" : "No"}
          </Text>
        </div>
      );

    case "Abstain":
      return (
        <div
          className={clsx(
            "flex items-center justify-end",
            size === "small" ? "gap-2024_XS" : "gap-2024_S",
          )}
        >
          {onlyStatus ? null : isPersonVote ? (
            <SvgPersonIcon
              className={clsx(
                "text-2024_fillContent-warning",
                size === "small" ? "h-3 w-3" : "h-6 w-6",
              )}
            />
          ) : (
            <SvgLocked
              className={clsx(size === "small" ? "h-3 w-3" : "h-6 w-6")}
            />
          )}
          <Text variant={fontSize} color="warning">
            {isPersonVote ? "Team 3" : "Abstain"}
          </Text>
        </div>
      );
    case "Yes":
      return (
        <div
          className={clsx(
            "flex items-center justify-end",
            size === "small" ? "gap-2024_XS" : "gap-2024_S",
          )}
        >
          {onlyStatus ? null : isPersonVote ? (
            <SvgPersonIcon
              className={clsx(
                "text-2024_fillContent-good",
                size === "small" ? "h-3 w-3" : "h-6 w-6",
              )}
            />
          ) : (
            <SvgCheckFill24
              className={clsx(size === "small" ? "h-3 w-3" : "h-6 w-6")}
              color="#4BFFA6"
            />
          )}
          <Text variant={fontSize} color="good">
            {isPersonVote ? "Team 1" : "Yes"}
          </Text>
        </div>
      );
  }
}
