import { LINKS } from "./links";
import type { LegalDocument, LegalText } from "./types";

// Plain boilerplate for a marketing site that runs Google Analytics on every
// visit, with a notice (added 2026-10-09 at the owner's request). The site's rules
// retire the word "policy", so these are a "privacy notice" and "terms of
// use". Not legal advice; the owner should have them reviewed. Analytics
// facts come from src/content/analytics.ts and src/components/analytics/.

const UPDATED = "October 9, 2026";
const CONTACT: LegalText = { text: LINKS.licenseEmail.label, href: LINKS.licenseEmail.href };
const t = (text: string): LegalText => ({ text });

export const TERMS: LegalDocument = {
  title: "Terms of use",
  description: "The terms for using getfluxiq.com and its content.",
  path: "/terms/",
  updated: UPDATED,
  intro:
    "These terms cover your use of getfluxiq.com. By using the site, you agree to them. If you do not agree, please do not use the site.",
  sections: [
    {
      heading: "The site",
      blocks: [
        {
          paragraph: [
            t(
              "getfluxiq.com describes FluxIQ and its direction. Illustrations, examples, and concepts on the site, such as the savings example and the generated-app concept, are illustrative and do not describe shipped features or real results.",
            ),
          ],
        },
      ],
    },
    {
      heading: "The software",
      blocks: [
        {
          paragraph: [
            t(
              "The FluxIQ framework and browser extension are licensed separately under the license in their repositories, not under these terms. Read the ",
            ),
            { text: "FluxIQ license", href: LINKS.license.href, external: true },
            t(" before you use, change, or distribute the software."),
          ],
        },
      ],
    },
    {
      heading: "Content",
      blocks: [
        {
          paragraph: [
            t(
              "The site's text, design, logo, and the vision paper belong to FluxIQ. You may read, share links to, and quote them with attribution. Do not copy the site or present its content as your own.",
            ),
          ],
        },
      ],
    },
    {
      heading: "Acceptable use",
      blocks: [
        {
          paragraph: [
            t(
              "Do not attempt to disrupt, overload, or gain unauthorised access to the site or its hosting, and do not use the site in breach of any law.",
            ),
          ],
        },
      ],
    },
    {
      heading: "Links",
      blocks: [
        {
          paragraph: [
            t(
              "The site links to other sites, such as GitHub and X. We are not responsible for their content or practices.",
            ),
          ],
        },
      ],
    },
    {
      heading: "No warranty",
      blocks: [
        {
          paragraph: [
            t(
              "The site and its content are provided as is, without warranties of any kind. Information may be incomplete or change without notice, and planned features may change or not ship.",
            ),
          ],
        },
      ],
    },
    {
      heading: "Limitation of liability",
      blocks: [
        {
          paragraph: [
            t(
              "To the extent the law allows, FluxIQ is not liable for any indirect, incidental, or consequential loss arising from your use of the site.",
            ),
          ],
        },
      ],
    },
    {
      heading: "Privacy",
      blocks: [
        {
          paragraph: [
            t("How the site handles data is described in the "),
            { text: "privacy notice", href: LINKS.privacy.href },
            t("."),
          ],
        },
      ],
    },
    {
      heading: "Changes and contact",
      blocks: [
        {
          paragraph: [
            t("We may update these terms; the date at the top shows when they last changed. Questions: "),
            CONTACT,
            t("."),
          ],
        },
      ],
    },
  ],
};
