import type { SVGProps } from "react";
const SvgTwitter = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#FFF"
      fillRule="evenodd"
      d="M21.088 2.224a.835.835 0 0 1 .041 1.178l-6.78 7.272 7.484 9.934a.834.834 0 0 1-.666 1.334H16.6a.834.834 0 0 1-.665-.332l-5.267-6.99-6.58 7.057a.834.834 0 0 1-1.218-1.137l6.78-7.271-7.484-9.934A.833.833 0 0 1 2.832 2h4.566a.833.833 0 0 1 .665.331l5.268 6.99 6.577-7.056a.834.834 0 0 1 1.179-.042Zm-8.46 8.937a.833.833 0 0 1-.064-.086L6.983 3.667h-2.48l12.514 16.609h2.479l-6.867-9.115Z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgTwitter;
