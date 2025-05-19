import Discord from "@/icons/legacy/Discord";
import Twitter from "@/icons/legacy/Twitter";
import Link from "next/link";
import {
  DISCORD_URL,
  PRIVACY_POLICY_URL,
  TERMS_AND_CONDITIONS_URL,
  X_URL,
} from "@/constants/urls";
import Typography from "../ui/typography";

export function FooterLinks() {
  return (
    <div className="flex flex-col items-center gap-3xl lg:flex-row">
      <div className="flex gap-3xl">
        <Link href={DISCORD_URL} target="_blank">
          <Discord className="h-[1.5rem] w-[1.5rem] fill-primary-main" />
        </Link>
        <Link href={X_URL} target="_blank">
          <Twitter className="h-[1.5rem] w-[1.5rem] text-primary-main" />
        </Link>
      </div>
      <div className="flex gap-3xl">
        <Link href={TERMS_AND_CONDITIONS_URL}>
          <Typography
            variant="label/Small Bold"
            className="text-primary-main hover:text-secondary hover:underline"
          >
            Terms of Service
          </Typography>
        </Link>
        <Link href={PRIVACY_POLICY_URL}>
          <Typography
            variant="label/Small Bold"
            className="text-primary-main hover:text-secondary hover:underline"
          >
            Privacy Policy
          </Typography>
        </Link>
      </div>
    </div>
  );
}
