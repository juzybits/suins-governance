/* eslint-disable @next/next/no-img-element */
import {
  forwardRef,
  type ImgHTMLAttributes,
  type ReactNode,
  useState,
} from "react";
import Image from "next/image";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: ReactNode;
}

export const CustomImage = forwardRef<HTMLImageElement, ImageProps>(
  (props, ref) => {
    const { src, alt, fallback, className, ...rest } = props;
    const [error, setError] = useState(false);
    const formattedSrc = src?.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/");

    return (
      <>
        {!formattedSrc || error ? (
          fallback ? (
            typeof fallback === "string" ? (
              <Image
                ref={ref}
                src={fallback}
                alt={alt ?? "falback image"}
                className={className}
              />
            ) : (
              fallback
            )
          ) : (
            <div>{alt}</div>
          )
        ) : (
          <img
            ref={ref}
            className={className}
            onError={() => {
              setError(true);
            }}
            src={formattedSrc}
            alt={alt ?? "image"}
            {...rest}
          />
        )}
      </>
    );
  },
);

CustomImage.displayName = "CustomImage";
