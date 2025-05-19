import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import PlusSVG from "@/icons/plus";

export default function UI() {
  return (
    <>
      <div className="flex flex-col gap-s">
        {(
          [
            ["short/gradient", "label/Regular Bold"],
            ["short/solid", "label/Regular Bold"],
            ["short/solid-secondary", "label/Regular Bold"],
            ["short/outline", "label/Regular Bold"],
            ["tall/gradientA", "label/Large Bold"],
            ["tall/gradientB", "label/Large Bold"],
            ["tall/solid", "label/Large Bold"],
            ["tall/stroke", "label/Large Bold"],
            ["outline/large", "label/Large Bold"],
            ["outline/small", "label/Small Bold"],
            ["solid/large", "label/Large Bold"],
            ["solid/medium", "label/Large Bold"],
            ["solid/small", "label/Small Bold"],
          ] as const
        ).map(([variant, textVariant]) => (
          <div className="flex gap-s" key={variant}>
            {[
              <Button variant={variant} key={[variant, "none"].join()}>
                <Typography variant={textVariant}>Button</Typography>
              </Button>,
              <Button
                variant={variant}
                key={[variant, "after"].join()}
                after={<PlusSVG width="100%" style={{ maxWidth: "1.25rem" }} />}
              >
                <Typography variant={textVariant}>Button</Typography>
              </Button>,
              <Button
                variant={variant}
                key={[variant, "before"].join()}
                before={
                  <PlusSVG width="100%" style={{ maxWidth: "1.25rem" }} />
                }
              >
                <Typography variant={textVariant}>Button</Typography>
              </Button>,
            ]}
          </div>
        ))}
      </div>
      <div>
        {(
          [
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
            "label/XSmall SemiBold",
            "paragraph/Large",
            "paragraph/Large Link",
            "paragraph/Regular",
            "paragraph/Regular Link",
            "paragraph/Small",
            "paragraph/XSmall",
          ] as const
        ).map((variant) => (
          <p key={variant} className="max-w-[50rem]">
            <Typography className="text-primary-main" variant={variant}>
              Funky monkeys juggle quickly, vexing bored zebras.
            </Typography>
          </p>
        ))}
      </div>
    </>
  );
}
