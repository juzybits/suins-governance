import { Text } from "@/components/ui/Text";
import NSToken from "@/icons/NSToken";

export function NSAmount({ amount }: { amount: number }) {
  return (
    <div className="flex basis-1/5 items-center justify-end gap-1">
      <Text variant="P3/medium" color="fillContent-secondary">
        {amount}
      </Text>
      <NSToken className="h-3 w-3" color="white" />
    </div>
  );
}
