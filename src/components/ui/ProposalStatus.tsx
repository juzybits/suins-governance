import clsx from "clsx";
import { Text } from "@/components/ui/Text";

export function ProposalStatus({
  status,
}: {
  status: "active" | "passed" | "failed" | "pending";
}) {
  // make first letter uppercase
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <div
      className={clsx(
        "flex w-fit items-center justify-center rounded-2024_S px-2024_M py-2024_S",
        status === "active" || status === "passed"
          ? "bg-2024_fillBackground-good"
          : status === "pending"
            ? "bg-2024_fillBackground-warning"
            : "bg-[#FF1D53]",
      )}
    >
      <Text
        variant="B5/bold"
        color={
          status === "active" || status === "passed" || status === "pending"
            ? "fillContent-primary-darker"
            : "fillContent-secondary"
        }
      >
        {formattedStatus}
      </Text>
    </div>
  );
}
