import { cva } from "class-variance-authority";

const BASE_STYLE = "px-xs py-2xs rounded-full flex items-center justify-center";

export const badgeVariants = cva([BASE_STYLE], {
  variants: {
    variant: {
      positive: ["bg-bg-good text-primary-darker"],
      negative: ["bg-bg-error text-primary-main"],
    },
  },
});
