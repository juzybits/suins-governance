"use client";

import { FooterLinks } from "@/components/footer/footer-links";
import { GradientBorder } from "@/components/gradient-border";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Typography from "../ui/typography";

export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  return (
    <div className="flex w-full flex-col items-center gap-3xl bg-bg-primary p-3xl">
      {pathname === "/" && (
        <div className="w-full max-w-page_max_width">
          <GradientBorder
            animateOnHover
            variant="green_pink_blue"
            className="mt-xl flex w-full flex-col gap-s overflow-hidden rounded-m border-2 p-l transition-all"
          >
            <h2>
              <Typography
                variant="heading/Small Bold"
                className="text-primary-main"
              >
                SuiNS is now open source!
              </Typography>
            </h2>
            <p>
              <Typography variant="paragraph/Large" className="text-secondary">
                Use our technical docs to integrate SuiNS in your app, or build
                off our foundation.
              </Typography>
            </p>
            <Button
              variant="tall/gradientA"
              className="mt-m w-full lg:w-[158px]"
              href="https://docs.suins.io/sdk"
            >
              <Typography
                variant="label/Large Bold"
                className="whitespace-nowrap text-primary-darker"
              >
                Learn More
              </Typography>
            </Button>
          </GradientBorder>
        </div>
      )}
      <footer className="flex w-full max-w-page_max_width flex-col-reverse items-center justify-between gap-3xl lg:flex-row">
        <Typography
          variant="label/Small Bold"
          className="text-center text-tertiary lg:text-left"
        >
          Copyright {year} © Sui Foundation.
        </Typography>
        <FooterLinks />
      </footer>
    </div>
  );
}
