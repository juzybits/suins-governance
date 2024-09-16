import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { Red_Hat_Mono } from "next/font/google";

export const twkEverett = localFont({
  src: [
    { path: "/fonts/TWKEverett/super.otf", weight: "900", style: "normal" },
    {
      path: "/fonts/TWKEverett/TWKEverett-Extrabold.otf",
      weight: "750",
      style: "normal",
    },
    {
      path: "/fonts/TWKEverett/TWKEverett-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  style: "normal",
  weight: "400",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  style: "normal",
  weight: ["100", "400", "500", "600", "700", "900"],
});

export const redHatMono = Red_Hat_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  style: "normal",
  weight: ["400", "600", "700"],
});
