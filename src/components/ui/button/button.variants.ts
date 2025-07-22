import { cva } from "class-variance-authority";

const BASE_STYLE = "flex gap-2xs rounded-full leading-none justify-center";
const SHORT_STYLE = "px-m py-s";
const TALL_STYLE = "px-2xl py-l w-full";
const LARGE_STYLE = "px-xl py-m";
const MEDIUM_STYLE = "px-l py-s";
const SMALL_STYLE = "px-m py-xs";
const SOLID_STYLES = [
  "text-darker bg-bg-blue",
  "hover:bg-[linear-gradient(#fff3)]",
  "active:bg-[linear-gradient(#fff8)]",
];
const OUTLINE_STYLES = [
  "text-secondary border-secondary",
  "hover:text-primary-main hover:border-primary-main",
  "active:bg-bg-secondary_highlight",
];

export const buttonVariants = cva([BASE_STYLE], {
  variants: {
    variant: {
      "short/gradient": [
        SHORT_STYLE,
        "bg-button_orange_pink_blue text-primary-darker",
        "disabled:bg-button_orange_pink_blue disabled:text-primary-darker",
        "hover:bg-button_green_orange_pink",
      ],
      "short/solid": [
        SHORT_STYLE,
        "bg-bg-blue  text-primary-darker",
        "disabled:bg-bg-blue disabled:text-primary-darker",
        "hover:bg-button_pink_green",
      ],
      "short/solid-secondary": [
        SHORT_STYLE,
        "bg-bg-secondary_highlight text-primary-main",
        "disabled:bg-bg-secondary_highlight disabled:text-primary-main",
        "hover:bg-button_orange_pink_blue hover:text-primary-darker",
      ],
      "short/outline": [SHORT_STYLE, "text-primary-main"],
      "tall/gradientA": [
        TALL_STYLE,
        "bg-stroke_green_blue_pink text-primary-darker",
        "disabled:bg-stroke_green_blue_pink disabled:text-primary-darker",
        "hover:bg-button_pink_green",
      ],
      "tall/gradientB": [
        TALL_STYLE,
        "bg-button_orange_pink_blue text-primary-darker",
        "disabled:bg-button_orange_pink_blue disabled:text-primary-darker",
        "hover:bg-button_green_orange_pink",
      ],
      "tall/solid": [
        TALL_STYLE,
        "bg-bg-good text-primary-darker",
        "disabled:bg-bg-good disabled:text-primary-darker",
        "hover:bg-button_pink_green",
      ],
      "tall/stroke": [TALL_STYLE, "text-primary-main"],
      "solid/large": [LARGE_STYLE, ...SOLID_STYLES],
      "solid/medium": [MEDIUM_STYLE, ...SOLID_STYLES],
      "solid/small": [SMALL_STYLE, ...SOLID_STYLES],
      "outline/large": [LARGE_STYLE, ...OUTLINE_STYLES, "border-2"],
      "outline/small": [SMALL_STYLE, ...OUTLINE_STYLES, "border"],
    },
  },
  defaultVariants: {
    variant: "short/gradient",
  },
});
