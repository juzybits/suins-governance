"use client";

import { usePathname } from "next/navigation";
import { type PropsWithChildren, type FC } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import clsx from "clsx";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();

  return (
    <main
      className={clsx(
        "flex min-h-[100vh] flex-col justify-between gap-xl",
        pathname == "/" && "bg-[url(/images/Home/color-blobs.png)] bg-cover",
      )}
    >
      <Header />
      {children}
      <Footer />
    </main>
  );
};

export default MainLayout;
