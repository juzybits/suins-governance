import clsx from "clsx";
import Typography from "../typography";

export function ProposalStatus({
  status,
}: {
  status: "active" | "passed" | "failed" | "pending";
}) {
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <div
      className={clsx(
        "flex w-fit items-center justify-center rounded-full px-m py-s",
        status === "active" || status === "passed"
          ? "bg-semantic-good"
          : status === "pending"
            ? "bg-semantic-warning"
            : "bg-semantic-issue",
      )}
    >
      <Typography
        variant="label/Regular Bold"
        className={clsx(
          status === "active" ||
            status === "passed" ||
            status === "pending" ||
            status === "failed"
            ? "text-primary_darker"
            : "text-secondary",
        )}
      >
        {formattedStatus}
      </Typography>
    </div>
  );
}
