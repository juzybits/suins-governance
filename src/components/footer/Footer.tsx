"use client";

import { useProductAnalyticsConfig } from "@/hooks/useProductAnalyticsConfig";
import { FooterLinks } from "@/components/footer/FooterLinks";
import { Text } from "@/components/ui/Text";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <div className="flex w-full max-w-2024_maxWidth flex-col justify-center gap-2024_3XL divide-y divide-2024_fillContent-tertiary/30">
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
