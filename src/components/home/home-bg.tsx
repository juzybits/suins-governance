import { type FC } from "react";

export const HomeBg: FC = () => (
  <>
    <div className="absolute z-[-1] h-[100vh] w-[100vw] bg-[url(/images/Home/pattern-bg.png)]" />
    <div className="b absolute z-[-1] h-[250vh] w-[100vw] bg-[url(/images/Home/color-blobs.png)] bg-cover" />
  </>
);
