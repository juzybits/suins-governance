import clsx from "clsx";

export function Divide({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "h-[1px] w-full bg-2024_fillBackground-secondary-Highlight/40",
        className,
      )}
    />
  );
}
