"use client";

import NextTopLoader from "nextjs-toploader";

export function NavigationProgress() {
  return (
    <NextTopLoader
      color="var(--color-primary)"
      height={4}
      showSpinner={false}
      shadow={false}
      showForHashAnchor={true}
    />
  );
}
