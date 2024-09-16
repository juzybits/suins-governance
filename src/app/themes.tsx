import { type ThemeVars } from "@mysten/dapp-kit";

// Light theme copied from dapp-kit
export const suiNSTheme: ThemeVars = {
  blurs: {
    modalOverlay: "blur(0)",
  },
  backgroundColors: {
    primaryButton: "#F6F7F9",
    primaryButtonHover: "#F0F2F5",
    outlineButtonHover: "#F4F4F5",
    modalOverlay: "rgba(34, 28, 54, 80%)",
    modalPrimary: "#221C36",
    modalSecondary: "#2E2747",
    iconButton: "transparent",
    iconButtonHover: "#3C424226",
    dropdownMenu: "#FFFFFF",
    dropdownMenuSeparator: "#F3F6F8",
    walletItemSelected: "#ffffff24",
    walletItemHover: "#221C36",
  },
  borderColors: {
    outlineButton: "#ffffff24",
  },
  colors: {
    primaryButton: "#373737",
    outlineButton: "#4CA3FF",
    iconButton: "#000000",
    body: "#FFFFFF",
    bodyMuted: "#767A81",
    bodyDanger: "#FF794B",
  },
  radii: {
    small: "6px",
    medium: "8px",
    large: "12px",
    xlarge: "16px",
  },
  shadows: {
    primaryButton: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    walletItemSelected: "0px 2px 6px rgba(0, 0, 0, 0.05)",
  },
  fontWeights: {
    normal: "400",
    medium: "500",
    bold: "600",
  },
  fontSizes: {
    small: "14px",
    medium: "16px",
    large: "18px",
    xlarge: "20px",
  },
  typography: {
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    fontStyle: "normal",
    lineHeight: "1.3",
    letterSpacing: "1",
  },
};
