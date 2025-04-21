import Discord from "@/icons/Discord";
import Twitter from "@/icons/Twitter";
import { Text } from "@/components/ui/Text";
import Link from "next/link";
import { DISCORD_URL, PRIVACY_POLICY_URL, X_URL } from "@/constants/urls";

export function FooterLinks() {
  return (
    <div className="flex flex-col items-center gap-2024_3XL lg:flex-row">
      <div className="flex gap-2024_3XL">
        <Link href={DISCORD_URL} target="_blank">
          <Discord className="h-[24px] w-[24px] fill-2024_fillContent-primary" />
        </Link>
        <Link href={X_URL} target="_blank">
          <Twitter className="h-[24px] w-[24px] text-2024_fillContent-primary" />
        </Link>
      </div>
      <div className="flex gap-2024_3XL">
        <Link
          href="https://suins.io/terms-and-conditions"
          target="_blank"
          className="hover:text-2024_fillContent-primary hover:underline"
        >
          <Text variant="B6/bold" color="fillContent-primary">
            Terms of Service
          </Text>
        </Link>
        <Link
          href={PRIVACY_POLICY_URL}
          className="hover:text-2024_fillContent-primary hover:underline"
        >
          <Text variant="B6/bold" color="fillContent-primary">
            Privacy Policy
          </Text>
        </Link>
      </div>
    </div>
  );
}
