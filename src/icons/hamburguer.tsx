import type { FC, SVGProps } from "react";

const HamburgerSVG: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 18 15" fill="none" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 1.5C0 0.947715 0.447715 0.5 1 0.5H17C17.5523 0.5 18 0.947715 18 1.5C18 2.05228 17.5523 2.5 17 2.5H1C0.447715 2.5 0 2.05228 0 1.5ZM0 7.5C0 6.94772 0.447715 6.5 1 6.5H17C17.5523 6.5 18 6.94772 18 7.5C18 8.05228 17.5523 8.5 17 8.5H1C0.447715 8.5 0 8.05228 0 7.5ZM1 12.5C0.447715 12.5 0 12.9477 0 13.5C0 14.0523 0.447715 14.5 1 14.5H17C17.5523 14.5 18 14.0523 18 13.5C18 12.9477 17.5523 12.5 17 12.5H1Z"
      fill="currentColor"
    />
  </svg>
);

export default HamburgerSVG;
