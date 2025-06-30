import { type FC } from "react";

export const HomeBg: FC = () => (
  <>
    <div className="absolute z-[-2] h-[100vh] w-[100vw] bg-[url(/images/Home/pattern-bg.png)] bg-cover" />
    <div className="absolute z-[-1] h-[250vh] w-[100vw] bg-[url(/images/Home/color-blobs.png)] bg-cover" />
  </>
);
