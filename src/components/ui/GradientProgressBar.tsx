import { motion } from "framer-motion";

interface GradientProgressBarProps {
  percentage: number;
}

export function GradientProgressBar({ percentage }: GradientProgressBarProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg bg-[rgba(99,81,156,0.4)]">
      <motion.div
        className="relative h-2 w-full overflow-hidden rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1 }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #00FFAB, #00A3FF, #8A2BE2)",
            width: "100%",
          }}
        />
      </motion.div>
    </div>
  );
}
