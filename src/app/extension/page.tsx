import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { ExtensionFeatures } from "@/components/extension/features";
import { ExtensionHero } from "@/components/extension/hero";
import { ExtensionSetup } from "@/components/extension/setup";
import { SiteFooter } from "@/components/site-footer/site-footer";
import { SiteHeader } from "@/components/site-header/site-header";
import { EXTENSION_NAV } from "@/content/navigation";

const DESCRIPTION =
  "The FluxIQ Web Extension records what you do in Chrome, Edge, or Firefox, runs your Flows on real pages, and pulls data out of lists. It pairs with FluxIQ on your machine.";

// Read from the generated alt file so the two stay in step.
const OG_ALT = readFileSync(path.join(process.cwd(), "src/app/opengraph-image.alt.txt"), "utf8");

export const metadata: Metadata = {
  title: "Web Extension",
  description: DESCRIPTION,
  alternates: { canonical: "/extension/" },
  // A page-level openGraph replaces the layout's, image included, so the
  // shared image from src/app/opengraph-image.png is named again here.
  openGraph: {
    type: "website",
    siteName: "FluxIQ",
    url: "/extension/",
    locale: "en_US",
    description: DESCRIPTION,
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: OG_ALT }],
  },
};

export default function ExtensionPage() {
  return (
    <div className="relative isolate overflow-x-clip">
      <SiteHeader nav={EXTENSION_NAV} section="Extension" />
      <main id="main">
        <ExtensionHero />
        <ExtensionFeatures />
        <ExtensionSetup />
      </main>
      <SiteFooter />
    </div>
  );
}
