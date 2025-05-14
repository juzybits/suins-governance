"use client";

import { FooterLinks } from "@/components/footer/FooterLinks";
import { Text } from "@/components/ui.legacy/Text";
import { GradientBorder } from "@/components/gradient-border";
import { Button } from "@/components/ui.legacy/button/Button";
import { usePathname } from "next/navigation";

export function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  return (
    <div className="flex w-full max-w-2024_maxWidth flex-col justify-center gap-2024_3XL divide-y divide-2024_fillContent-tertiary/30">
      {pathname === "/" && (
        <div className="flex flex-col items-center justify-center gap-2024_XL lg:flex-row">
          <GradientBorder
            className="w-full overflow-hidden rounded-2024_M border-2 transition-all"
            variant="green_pink_blue"
            animateOnHover
          >
            <div className="flex flex-col items-center justify-between gap-2024_R bg-2024_gradient-fill-background-transparent p-2024_2XL lg:flex-row">
              <div className="flex flex-col gap-2024_R">
                <Text variant="B3/bold" color="fillContent-primary">
                  SuiNS is now open source!
                </Text>
                <div className="flex flex-row gap-2024_XL">
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
      )}
      <div className="flex flex-col items-center gap-2024_3XL pt-2024_3XL lg:flex-row lg:justify-between">
        <FooterLinks />
        <Text
          variant="B6/semibold"
          color="fillContent-tertiary"
          className="md:-order-1"
        >
          Copyright {year} © Sui Foundation.
        </Text>
      </div>
    </div>
  );
}
