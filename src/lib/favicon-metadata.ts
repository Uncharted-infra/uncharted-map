import type { Metadata } from "next";

const faviconLight = "/favicons/favicon-light.png";
const faviconDark = "/favicons/favicon-dark.png";
const appleLight = "/favicons/favicon-light-180.png";
const appleDark = "/favicons/favicon-dark-180.png";

export const themeFaviconMetadata: Metadata["icons"] = {
  icon: [
    { url: faviconLight, media: "(prefers-color-scheme: light)" },
    { url: faviconDark, media: "(prefers-color-scheme: dark)" },
  ],
  apple: [
    { url: appleLight, media: "(prefers-color-scheme: light)" },
    { url: appleDark, media: "(prefers-color-scheme: dark)" },
  ],
  shortcut: faviconLight,
};

export const themeFaviconPaths = {
  light: faviconLight,
  dark: faviconDark,
  appleLight,
  appleDark,
} as const;
