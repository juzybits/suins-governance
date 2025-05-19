import clsx from "clsx";
import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  useState,
} from "react";

import moduleStyles from "./index.module.css";

const colorsMap = {
  green_pink_blue: ["#4BFFA6", "#D34BFF", "#4CA2FF", "#4BFFA6"],
  green_blue_pink: ["#4bffa6", "#4ca2ff", "#d34bff", "#4bffa6"],
  orange_pink_blue: ["#FF794B", "#D962FF", "#4CA2FF", "#D962FF"].reverse(),
};

type BaseGradientBorderProps = HTMLAttributes<HTMLDivElement> & {
  bg?: string;
  style?: CSSProperties;
  animateOnHover?: boolean;
  alwaysAnimate?: boolean;
  colorsOnHover?: string[];
  animationSpeed?: number;
};

//TODO: Add support for single color instead of repeating the same color in the array
export type GradientBorderProps = BaseGradientBorderProps &
  (
    | {
        colors: string[];
        variant?: never;
      }
    | {
        colors?: never;
        variant: keyof typeof colorsMap;
      }
  );

export const GradientBorder = forwardRef<HTMLDivElement, GradientBorderProps>(
  (
    {
      bg,
      style,
      colors,
      variant,
      className,
      onMouseEnter,
      onMouseLeave,
      alwaysAnimate,
      colorsOnHover,
      animateOnHover,
      animationSpeed = 1,
      ...props
    },
    ref,
  ) => {
    const [isMouseOver, setIsMouseOver] = useState(false);

    const animation = {
      animation: `${animationSpeed}s ${moduleStyles.rotate} linear infinite`,
    };

    const colorsToUse = variant ? colorsMap[variant] : colors;

    return (
      <div
        {...props}
        ref={ref}
        onMouseEnter={(e) => {
          setIsMouseOver(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setIsMouseOver(false);
          onMouseLeave?.(e);
        }}
        style={{
          backgroundImage: `linear-gradient(${bg ?? "#221c36"} 0 0),
          conic-gradient(from var(--angle), ${(isMouseOver ? (colorsOnHover ?? colorsToUse) : colorsToUse).join(", ")})`,
          ...(alwaysAnimate || (animateOnHover && isMouseOver)
            ? animation
            : {}),
          ...style,
        }}
        className={clsx(
          "border-transparent",
          moduleStyles.gradientBorderContainer,
          className,
        )}
      />
    );
  },
);

GradientBorder.displayName = "GradientBorder";
