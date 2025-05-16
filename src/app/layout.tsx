import "@mysten/dapp-kit/dist/index.css";
import "@/styles/globals.css";
import "@/components/ui.legacy/dummy-ui/dummy-ui.css";
import { type ReactNode } from "react";
import { type Metadata } from "next";
import { twkEverett, inter, redHatMono } from "@/fonts";
import { Providers } from "@/app/Providers";
import clsx from "clsx";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer";
import { Toast } from "@/components/ui.legacy/Toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const metadata: Metadata = {
  title: "SuiNS Governance",
  description: "Join today and voice your opinion on upcoming changes to SuiNS",
  icons: [{ rel: "icon", url: "/images/apple-touch-icon.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-bg-primary_dark">
        <Providers>
          <main className="gap-xl flex flex-col">
            <Header />
            {children}
            <div className="bg-2024_gradient-fill-background-purple px-2024_XL py-2024_3XL flex w-full justify-center">
              <Footer />
            </div>
          </main>
          <ReactQueryDevtools initialIsOpen={false} />
        </Providers>
        <Toast />
      </body>
    </html>
  );
}
