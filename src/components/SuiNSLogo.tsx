import SvgSuinsStakingLogoFill from "@/icons/legacy/SuinsStakingLogoFill";

export interface SuiNSLogoProps {
  className?: string;
  children?: never;
}

export function SuiNSLogo({ className }: SuiNSLogoProps) {
  return <SvgSuinsStakingLogoFill className={className} />;
}
