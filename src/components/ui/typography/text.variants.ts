import { cva } from "class-variance-authority";

export const textVariants = cva("", {
  variants: {
    variant: {
      "display/XLarge":
        "font-highlight text-9xl leading-8xl tracking-tighter font-[900]",
      "display/Large":
        "font-highlight text-8xl leading-7xl tracking-tighter font-[900]",
      "display/Regular":
        "font-highlight text-7xl leading-6xl tracking-tight font-[900]",
      "display/Small":
        "font-highlight text-6xl leading-3xl tracking-normal font-[900]",
      "display/XSmall":
        "font-highlight text-5xl leading-4xl tracking-normal font-[900]",
      "display/XSmall Light":
        "font-highlight text-5xl leading-4xl tracking-normal font-[750]",
      "display/XXSmall Light":
        "font-highlight text-2xl leading-xl tracking-normal font-[750]",
      "display/XXXSmall Light":
        "font-highlight text-xl leading-m tracking-normal font-[750]",
      "heading/Large SemiBold":
        "font-highlight text-5xl leading-xl tracking-normal font-[600]",
      "heading/Large Medium":
        "font-highlight text-5xl leading-xl tracking-normal font-[500]",
      "heading/Regular Bold":
        "font-highlight text-3xl leading-xl tracking-normal font-[700]",
      "heading/Regular Medium":
        "font-highlight text-3xl leading-xl tracking-normal font-[500]",
      "heading/Regular Regular":
        "font-highlight text-3xl leading-xl tracking-normal",
      "heading/Small Bold":
        "font-highlight text-2xl leading-2xl tracking-normal font-[700]",
      "heading/Small Medium":
        "font-highlight text-2xl leading-2xl tracking-normal font-[500]",
      "heading/Small Regular":
        "font-highlight text-2xl leading-2xl tracking-normal",
      "heading/XSmall Medium":
        "font-highlight text-xl leading-xl tracking-normal font-[500]",
      "label/Large Bold":
        "font-main text-l leading-xs tracking-wide font-[700]",
      "label/Large Medium":
        "font-main text-l leading-xs tracking-wide font-[500]",
      "label/Large Regular": "font-main text-l leading-xs tracking-wide",
      "label/Regular Bold":
        "font-main text-m leading-2xs tracking-wide font-[700]",
      "label/Regular Bold Mono":
        "font-mono text-m leading-2xs tracking-wide font-[700]",
      "label/Small Bold":
        "font-main text-s leading-3xs tracking-wide font-[700]",
      "label/Small Medium":
        "font-main text-s leading-3xs tracking-wide font-[500]",
      "label/Small Medium Mono":
        "font-mono text-s leading-3xs tracking-wide font-[500]",
      "label/XSmall SemiBold":
        "font-main text-xs leading-4xs tracking-wide font-[600]",
      "paragraph/XLarge": "font-main text-4xl leading-5xl tracking-normal",
      "paragraph/Large": "font-main text-l leading-l tracking-normal",
      "paragraph/Large Link":
        "font-main text-l leading-l tracking-normal underline",
      "paragraph/Regular": "font-main text-m leading-m tracking-normal",
      "paragraph/Regular Link":
        "font-main text-m leading-m tracking-normal underline",
      "paragraph/Small": "font-main text-s leading-s tracking-normal",
      "paragraph/XSmall": "font-main text-xs leading-xs tracking-normal",
    },
  },
  defaultVariants: {
    variant: "paragraph/Regular",
  },
});
