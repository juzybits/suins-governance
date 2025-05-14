import Typography from "@/components/ui/typography";
import { type TypographyVariant } from "@/components/ui/typography/text.types";

export default function UI() {
  return (
    <div>
      {[
        "display/XLarge",
        "display/Large",
        "display/Regular",
        "display/Small",
        "display/XSmall",
        "display/XSmall Light",
        "display/XXSmall Light",
        "display/XXXSmall Light",
        "heading/Large SemiBold",
        "heading/Large Medium",
        "heading/Regular Bold",
        "heading/Regular Medium",
        "heading/Regular Regular",
        "heading/Small Bold",
        "heading/Small Medium",
        "heading/Small Regular",
        "heading/XSmall Medium",
        "label/Large Bold",
        "label/Large Medium",
        "label/Large Regular",
        "label/Regular Bold",
        "label/Regular Bold Mono",
        "label/Small Bold",
        "label/Small Medium",
        "label/Small Medium Mono",
        "label/XSmall Semi Bold",
        "paragraph/Large",
        "paragraph/Large Link",
        "paragraph/Regular",
        "paragraph/Regular Link",
        "paragraph/Small",
        "paragraph/XSmall",
      ].map((variant) => (
        <p key={variant} className="max-w-[50rem]">
          <Typography variant={variant as TypographyVariant}>
            Funky monkeys juggle quickly, vexing bored zebras.
          </Typography>
        </p>
      ))}
    </div>
  );
}
