import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { SiteFooter } from "@/components/site-footer/site-footer";
import { SiteHeader } from "@/components/site-header/site-header";
import { LEGAL_NAV } from "@/content/navigation";
import { PRIVACY } from "@/content/privacy";

const OG_ALT = readFileSync(path.join(process.cwd(), "src/app/opengraph-image.alt.txt"), "utf8");

export const metadata: Metadata = {
  title: PRIVACY.title,
  description: PRIVACY.description,
  alternates: { canonical: PRIVACY.path },
  openGraph: {
    type: "website",
    siteName: "FluxIQ",
    url: PRIVACY.path,
    locale: "en_US",
    description: PRIVACY.description,
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: OG_ALT }],
  },
};

export default function PrivacyPage() {
  return (
    <div className="relative isolate overflow-x-clip">
      <SiteHeader nav={LEGAL_NAV} />
      <main id="main">
        <LegalPage doc={PRIVACY} />
      </main>
      <SiteFooter />
    </div>
  );
}
