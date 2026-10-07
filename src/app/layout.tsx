import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE } from "@/content/site";
import "./globals.css";

const SITE_TITLE = "FluxIQ: Only pay AI for what it doesn’t already know";

// Self-hosted at build time, so the page makes no request to Google. The
// variables feed the `font-sans` and `font-mono` tokens in globals.css.
const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-geist-mono",
});

// Open Graph and Twitter inherit the title and description, and the images
// come from the opengraph-image.png file convention beside this layout.
export const metadata: Metadata = {
  metadataBase: new URL("https://getfluxiq.com"),
  title: { default: SITE_TITLE, template: "%s | FluxIQ" },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "FluxIQ", url: "/", locale: "en_US" },
  twitter: { card: "summary_large_image", site: "@GetFluxIQ" },
};

export const viewport: Viewport = {
  themeColor: "#0c0d0f",
};

// Each page owns its header, <main id="main">, and the footer.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} antialiased`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-fg focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ink focus:outline-2 focus:outline-offset-2 focus:outline-amber"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
