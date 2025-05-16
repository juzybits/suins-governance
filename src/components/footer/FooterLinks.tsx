import Discord from "@/icons/Discord";
import Twitter from "@/icons/Twitter";
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
    <div className="gap-3xl flex flex-col items-center lg:flex-row">
      <div className="gap-3xl flex">
        <Link href={DISCORD_URL} target="_blank">
          <Discord className="fill-primary-main h-[1.5rem] w-[1.5rem]" />
        </Link>
        <Link href={X_URL} target="_blank">
          <Twitter className="text-primary-main h-[1.5rem] w-[1.5rem]" />
        </Link>
      </div>
      <div className="gap-3xl flex">
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
