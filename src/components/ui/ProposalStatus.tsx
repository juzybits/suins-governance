import clsx from "clsx";
import { Text } from "@/components/ui/Text";

export function ProposalStatus({ status }: { status: "active" | "closed" }) {
  return (
    <div
      className={clsx(
        "flex w-fit items-center justify-center rounded-2024_S px-2024_M py-2024_S",
        status === "active" ? "bg-2024_fillBackground-good" : "bg-[#62519C]",
      )}
    >
      <Text
        variant="B5/bold"
        color={
          status === "active"
            ? "fillContent-primary-darker"
            : "fillContent-secondary"
        }
      >
        {status === "active" ? "Active" : "Closed"}
      </Text>
    </div>
  );
}
