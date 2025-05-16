"use client";

import { FooterLinks } from "@/components/footer/FooterLinks";
import { Text } from "@/components/ui.legacy/Text";
import { GradientBorder } from "@/components/gradient-border";
import { Button } from "@/components/ui.legacy/button/Button";
import { usePathname } from "next/navigation";
import Typography from "../ui/typography";

export function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  return (
    <div className="max-w-2024_maxWidth gap-2024_3XL divide-2024_fillContent-tertiary/30 flex w-full flex-col justify-center divide-y">
      {/* {pathname === "/" && (
        <div className="gap-2024_XL flex flex-col items-center justify-center lg:flex-row">
          <GradientBorder
            className="rounded-2024_M w-full overflow-hidden border-2 transition-all"
            variant="green_pink_blue"
            animateOnHover
          >
            <div className="gap-2024_R bg-2024_gradient-fill-background-transparent p-2024_2XL flex flex-col items-center justify-between lg:flex-row">
              <div className="gap-2024_R flex flex-col">
                <Text variant="B3/bold" color="fillContent-primary">
                  SuiNS is now open source!
                </Text>
                <div className="gap-2024_XL flex flex-row">
                  <Text variant="P1/regular" color="fillContent-secondary">
                    Use our technical docs to integrate SuiNS in your app, or
                    build off our foundation.
                  </Text>
                </div>
              </div>
              <Button
                gradient="fill/green_blue_pink"
                className="w-full lg:w-[158px]"
                variant="tall"
                href="https://docs.suins.io/sdk"
              >
                <Text variant="B4/bold" color="fillContent-primary-darker">
                  Learn More
                </Text>
              </Button>
            </div>
          </GradientBorder>
        </div>
      )} */}
      <footer className="bg-bg-primary p-3xl align-center gap-3xl flex flex-col-reverse justify-between lg:flex-row">
        <Typography
          variant="label/Small Bold"
          className="text-tertiary text-center lg:text-left"
        >
          Copyright {year} © Sui Foundation.
        </Typography>
        <FooterLinks />
      </footer>
    </div>
  );
}
