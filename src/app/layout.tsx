import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const SITE_TITLE = "FluxIQ — Automate Smarter";
const SITE_DESCRIPTION =
  "FluxIQ is a source-available TypeScript automation framework: AI generates and repairs your Flows, and deterministic replay runs them without a model.";

// Self-hosted at build time, so the page makes no request to Google. The
// variables feed the `font-display` and `font-body` tokens in globals.css.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

// Open Graph and Twitter inherit the title and description, and the images
// come from the opengraph-image.png file convention beside this layout.
export const metadata: Metadata = {
  metadataBase: new URL("https://getfluxiq.com"),
  title: { default: SITE_TITLE, template: "%s — FluxIQ" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "FluxIQ", url: "/", locale: "en_US" },
  twitter: { card: "summary_large_image", site: "@GetFluxIQ" },
};

export const viewport: Viewport = {
  themeColor: "#03001c",
};

// page.tsx owns the header, <main id="main">, and the footer.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ink focus:outline-2 focus:outline-offset-2 focus:outline-cyan-300"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
