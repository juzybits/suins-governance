import SvgSuinsLogoFill from "@/icons/legacy/SuinsLogoFill";
import SvgSuinsStakingLogoFill from "@/icons/legacy/SuinsStakingLogoFill";

export interface SuiNSLogoProps {
  className?: string;
  isStaking?: boolean;
}

export function SuiNSLogo({ className, isStaking }: SuiNSLogoProps) {
  if (isStaking) return <SvgSuinsStakingLogoFill className={className} />;
  return <SvgSuinsLogoFill className={className} />;
}
