import { Developers } from "@/components/developers/developers";
import { Features } from "@/components/features/features";
import { Follow } from "@/components/follow/follow";
import { Hero } from "@/components/hero/hero";
import { HowItWorks } from "@/components/how-it-works/how-it-works";
import { Licensing } from "@/components/licensing/licensing";
import { Roadmap } from "@/components/roadmap/roadmap";
import { SiteFooter } from "@/components/site-footer/site-footer";
import { SiteHeader } from "@/components/site-header/site-header";
import { WhyFluxIQ } from "@/components/why-fluxiq/why-fluxiq";

// Section order follows the Page Plan in docs/working/landing-page.md. The
// wrapper clips horizontal overflow from the hero's decoration without
// creating a scroll container, so the sticky header keeps working.
export default function Home() {
  return (
    <div className="relative isolate overflow-x-clip">
      <SiteHeader />
      <main id="main">
        <Hero />
        <WhyFluxIQ />
        <HowItWorks />
        <Features />
        <Developers />
        <Roadmap />
        <Licensing />
        <Follow />
      </main>
      <SiteFooter />
    </div>
  );
}
