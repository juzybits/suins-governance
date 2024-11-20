"use client";

import { type ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

type MetadataOptions = {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
};

type MetadataManagerProps = {
  children: ReactNode;
} & MetadataOptions;

function updateMetaTag(name: string, content?: string) {
  if (!content) return;

  // Check if meta tag exists
  let meta = document.querySelector(
    `meta[name="${name}"], meta[property="${name}"]`,
  );

  if (meta) {
    // Update existing tag
    meta.setAttribute("content", content);
  } else {
    // Create new tag
    meta = document.createElement("meta");
    const isOG = name.startsWith("og:");

    if (isOG) {
      meta.setAttribute("property", name);
    } else {
      meta.setAttribute("name", name);
    }

    meta.setAttribute("content", content);
    document.head.appendChild(meta);
  }
}

export function useMetadata(options: MetadataOptions) {
  const pathname = usePathname();

  useEffect(() => {
    // Update title
    if (options.title) {
      document.title = options.title;
    }

    // Update meta description
    updateMetaTag("description", options.description);

    // Update keywords
    if (options.keywords?.length) {
      updateMetaTag("keywords", options.keywords.join(", "));
    }

    // Update OpenGraph tags
    updateMetaTag("og:title", options.ogTitle ?? options.title);
    updateMetaTag(
      "og:description",
      options.ogDescription ?? options.description,
    );
    updateMetaTag("og:image", options.ogImage);
    updateMetaTag(
      "og:url",
      typeof window !== "undefined" ? window.location.href : "",
    );

    // Cleanup function
    return () => {
      // Optional: Reset meta tags when component unmounts

      updateMetaTag("description", "");
      updateMetaTag("keywords", "");
      updateMetaTag("og:title", "");
      updateMetaTag("og:description", "");
      updateMetaTag("og:image", "");
      updateMetaTag("og:url", "");
    };
  }, [options, pathname]);
}

export function MetadataManager({
  children,
  ...metadataOptions
}: MetadataManagerProps) {
  useMetadata(metadataOptions);
  return <>{children}</>;
}
