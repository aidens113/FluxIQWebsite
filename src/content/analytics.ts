// Google Analytics 4 for getfluxiq.com, added at the owner's request on
// 2026-10-09. It loads on every visit (the owner's decision, replacing an
// earlier opt-in banner); a notice tells visitors and links the privacy
// notice and terms of use. The measurement ID is public by design: it appears
// in every page that loads the tag.
export const ANALYTICS = {
  measurementId: "G-RV2KXVRZW6",
  /** Remembers, in this browser only, that the visitor dismissed the notice. */
  noticeKey: "fluxiq-analytics-notice",
  notice: {
    label: "Analytics notice",
    lead: "We use Google Analytics to see how the site is used. By using this site, you agree to our",
    privacy: "Privacy notice",
    joiner: "and",
    terms: "Terms of use",
    dismiss: "OK",
  },
} as const;
