import { type FC, type SVGProps } from "react";

const MinusSVG: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 22 4" fill="none" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.5 2C0.5 1.17157 1.17157 0.5 2 0.5H20C20.8284 0.5 21.5 1.17157 21.5 2C21.5 2.82843 20.8284 3.5 20 3.5H2C1.17157 3.5 0.5 2.82843 0.5 2Z"
      fill="currentColor"
    />
  </svg>
);

export default MinusSVG;
