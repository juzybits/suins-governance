import "@mysten/dapp-kit/dist/index.css";
import "@/styles/globals.css";
import "@/components/ui/dummy-ui/dummy-ui.css";
import { type ReactNode } from "react";
import { type Metadata } from "next";
import { twkEverett, inter, redHatMono } from "@/fonts";
import { Providers } from "@/app/Providers";
import clsx from "clsx";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { Toast } from "@/components/ui/Toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StakeModalProvider } from "@/components/staking/StakeModalContext";

export const metadata: Metadata = {
  title: "SuiNS Governance",
  description: "Join today and voice your opinion on upcoming changes to SuiNS",
  icons: [{ rel: "icon", url: "/images/apple-touch-icon.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={clsx(twkEverett.variable, inter.variable, redHatMono.variable)}
    >
      <body className="bg-2024_fillBackground-primary">
        <Providers>
          <StakeModalProvider>
            <div className="top bg-2024_fillBackground-primary bg-suins-background bg-auto bg-repeat-x antialiased max-lg:bg-200">
              <section className="mx-auto flex min-h-screen w-full flex-col items-center justify-between gap-2024_3XL sm:gap-2024_5XL">
                <Header />
                {children}
                <div className="flex w-full justify-center bg-2024_gradient-fill-background-purple px-2024_XL py-2024_3XL">
                  <Footer />
                </div>
              </section>
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
          </StakeModalProvider>
        </Providers>
        <Toast />
      </body>
    </html>
  );
}
