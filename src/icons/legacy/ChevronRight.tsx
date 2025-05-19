import type { SVGProps } from "react";
const SvgChevronRight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.83709 15.6629C6.47097 15.2968 6.47097 14.7032 6.83709 14.3371L11.1742 10L6.83709 5.66291C6.47097 5.2968 6.47097 4.7032 6.83709 4.33709C7.2032 3.97097 7.7968 3.97097 8.16291 4.33709L13.1629 9.33709C13.529 9.7032 13.529 10.2968 13.1629 10.6629L8.16291 15.6629C7.7968 16.029 7.2032 16.029 6.83709 15.6629Z"
      fill="#D34BFF"
    />
  </svg>
);
export default SvgChevronRight;
