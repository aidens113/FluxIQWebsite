import { CircleCheck, FileText, Handshake, Mail } from "lucide-react";
import { LINKS } from "./links";
import type { LicensingContent } from "./types";

// Summarizes LICENSE.md in FluxIQ Core. The license text governs; this copy
// must never grant more than it does.
export const LICENSING: LicensingContent = {
  id: "license",
  eyebrow: "License",
  title: "Source-available and fair-code.",
  lede: "FluxIQ is fair-code, not OSI open source. It ships under the Sustainable Use License v1.0 with a Consulting Permission. Most uses are free; a few need a signed agreement.",
  freeFor: {
    title: "Free for",
    icon: CircleCheck,
    items: [
      "Personal and non-commercial use",
      "Internal business use",
      "Paid services that configure, integrate, or support a customer's own installation",
    ],
  },
  needsAgreement: {
    title: "Needs a signed agreement",
    icon: Handshake,
    items: [
      "Customer-facing automation",
      "Hosting FluxIQ, or running it as a managed service",
      "Embedding it in another product",
      "OEM, resale, and white-labeling",
    ],
  },
  disclaimer: "This is a summary, not the license. LICENSE.md is the governing text.",
  actions: [
    { ...LINKS.license, variant: "ghost", icon: FileText },
    { ...LINKS.licenseEmail, variant: "ghost", icon: Mail },
  ],
};
