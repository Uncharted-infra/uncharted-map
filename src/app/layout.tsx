import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const fenix = localFont({
  src: "../../fonts/Fenix/Fenix-Regular.ttf",
  variable: "--font-fenix",
});

const departureMono = localFont({
  src: "../../fonts/Departure_Mono/DepartureMono-Regular.woff",
  variable: "--font-departure-mono",
});

export const metadata: Metadata = {
  title: "Map",
  description: "Planning and booking travel is now a single conversation.",
  icons: {
    icon: "/img/logo/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fenix.variable} ${departureMono.variable}`}>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
