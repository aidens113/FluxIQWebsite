import { ClosingCta } from "@/components/closing-cta/closing-cta";
import { Hero } from "@/components/hero/hero";
import { HowItWorks } from "@/components/how-it-works/how-it-works";
import { Paper } from "@/components/paper/paper";
import { Parts } from "@/components/parts/parts";
import { SiteFooter } from "@/components/site-footer/site-footer";
import { SiteHeader } from "@/components/site-header/site-header";
import { Status } from "@/components/status/status";
import { Vision } from "@/components/vision/vision";
import { WhyFluxIQ } from "@/components/why-fluxiq/why-fluxiq";
import { HOME_NAV } from "@/content/navigation";

// Section order follows the approved v5 boards; see docs/working/home-redesign.md.
// The wrapper clips horizontal overflow without creating a scroll container,
// so the sticky header keeps working.
export default function Home() {
  return (
    <div className="relative isolate overflow-x-clip">
      <SiteHeader nav={HOME_NAV} />
      <main id="main">
        <Hero />
        <WhyFluxIQ />
        <Parts />
        <HowItWorks />
        <Vision />
        <Paper />
        <Status />
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  );
}
