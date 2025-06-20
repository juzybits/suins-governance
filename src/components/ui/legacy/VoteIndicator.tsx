import clsx from "clsx";

import SvgLocked from "@/icons/legacy/Locked";
import SvgXFill16 from "@/icons/legacy/XFill16";
import SvgCheckFill24 from "@/icons/legacy/CheckFill24";
import SvgPersonIcon from "@/icons/legacy/PersonIcon";
import Typography from "../typography";

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
  switch (votedStatus) {
    case "No":
      return (
        <div
          className={clsx(
            "flex items-center justify-end",
            size === "small" ? "gap-2xs" : "gap-xs",
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
          <Typography
            variant="label/Regular Bold"
            className="text-semantic-issue"
          >
            {isPersonVote ? "Welp" : "No"}
          </Typography>
        </div>
      );

    case "Abstain":
      return (
        <div
          className={clsx(
            "flex items-center justify-end",
            size === "small" ? "gap-2xs" : "gap-xs",
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

          <Typography
            variant="label/Regular Bold"
            className="text-semantic-warning"
          >
            {isPersonVote ? "William" : "Abstain"}
          </Typography>
        </div>
      );
    case "Yes":
      return (
        <div
          className={clsx(
            "flex items-center justify-end",
            size === "small" ? "gap-2xs" : "gap-xs",
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
          <Typography
            variant="label/Regular Bold"
            className="text-semantic-good"
          >
            {isPersonVote ? "Nigri" : "Yes"}
          </Typography>
        </div>
      );
  }
}
