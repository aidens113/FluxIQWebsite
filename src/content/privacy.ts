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

export const PRIVACY: LegalDocument = {
  title: "Privacy notice",
  description: "What getfluxiq.com collects, why, and the choices you have, including Google Analytics and cookies.",
  path: "/privacy/",
  updated: UPDATED,
  intro:
    "This notice explains what information getfluxiq.com collects when you visit, how it is used, and the choices you have. It covers this website only. The FluxIQ software runs on your own machine and is covered separately below.",
  sections: [
    {
      heading: "What we collect",
      blocks: [
        {
          paragraph: [
            t(
              "The site has no accounts, forms, or sign-ups, so we do not ask you for personal information. The site uses Google Analytics, which records how the site is used, including:",
            ),
          ],
        },
        {
          items: [
            [t("the pages you view and how long you stay")],
            [t("the page or site that referred you")],
            [t("your browser, device type, screen size, and language")],
            [t("your approximate location, such as country or city, derived from your IP address")],
          ],
        },
        {
          paragraph: [
            t(
              "Google Analytics 4 does not log or store full IP addresses. We do not use Google Analytics to identify you, and we do not combine its data with anything else.",
            ),
          ],
        },
      ],
    },
    {
      heading: "Cookies and analytics",
      blocks: [
        {
          paragraph: [
            t(
              "Google Analytics loads when you visit and sets first-party cookies named _ga and _ga_<id> that last up to two years. A notice at the bottom of the page tells you the site uses analytics; dismissing it is remembered in your browser's local storage so it does not show again, and that record never leaves your device.",
            ),
          ],
        },
        {
          paragraph: [
            t("We do not use Google Analytics for advertising; advertising storage and ad personalisation are left off. You can stop analytics with the "),
            { text: LINKS.gaOptOut.label, href: LINKS.gaOptOut.href, external: true },
            t(", by blocking cookies in your browser, or with a content blocker."),
          ],
        },
      ],
    },
    {
      heading: "How the information is used",
      blocks: [
        {
          paragraph: [
            t(
              "Only to understand which pages are useful and to improve the site. We do not sell it, rent it, or use it for advertising.",
            ),
          ],
        },
      ],
    },
    {
      heading: "Who processes it",
      blocks: [
        {
          paragraph: [
            t(
              "Google LLC processes analytics data on our behalf and may process it outside your country, including in the United States. Google describes how it handles this data in ",
            ),
            { text: LINKS.googlePrivacy.label, href: LINKS.googlePrivacy.href, external: true },
            t(
              ". The site is hosted by a web host that keeps standard server logs, such as IP address and request time, for security and operation.",
            ),
          ],
        },
      ],
    },
    {
      heading: "Retention",
      blocks: [
        {
          paragraph: [
            t(
              "Google Analytics keeps data for the retention period set in our account, at most 14 months, and then deletes it. Server logs are kept only as long as the host needs them.",
            ),
          ],
        },
      ],
    },
    {
      heading: "The FluxIQ software",
      blocks: [
        {
          paragraph: [
            t(
              "The FluxIQ framework runs on your own machine, and the browser extension sends what it sees only to the FluxIQ you pair it with. Neither sends data to us. When FluxIQ calls an AI model, it uses the provider and key you configure, under that provider's terms.",
            ),
          ],
        },
      ],
    },
    {
      heading: "Your rights",
      blocks: [
        {
          paragraph: [
            t(
              "Depending on where you live, you may have the right to access, correct, delete, or object to the processing of personal data about you. Because we cannot identify you from analytics data, the quickest control is the opt-out add-on or your browser settings described above. For anything else, contact us at ",
            ),
            CONTACT,
            t("."),
          ],
        },
      ],
    },
    {
      heading: "Children",
      blocks: [
        {
          paragraph: [t("The site is not directed at children under 16, and we do not knowingly collect their data.")],
        },
      ],
    },
    {
      heading: "Changes",
      blocks: [
        {
          paragraph: [
            t(
              "We may update this notice. The date at the top shows when it last changed; significant changes will be noted on the site.",
            ),
          ],
        },
      ],
    },
  ],
};
