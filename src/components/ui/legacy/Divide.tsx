import clsx from "clsx";

export function Divide({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "bg-2024_fillBackground-secondary-Highlight/40 h-[1px] w-full",
        className,
      )}
    />
  );
}
