// Google Analytics 4 for getfluxiq.com, added at the owner's request on
// 2026-10-09. Nothing from Google loads until a visitor accepts in the cookie
// banner; until then, and after a decline, the site makes no request to it.
// The measurement ID is public by design: it appears in every page that loads
// the tag.
export const ANALYTICS = {
  measurementId: "G-RV2KXVRZW6",
  storageKey: "fluxiq-cookie-consent",
  banner: {
    label: "Cookie consent",
    text: "Can we use Google Analytics cookies to see which pages are useful? Nothing is loaded unless you accept, and you can change your mind any time from the footer.",
    accept: "Accept",
    decline: "Decline",
    more: "Privacy notice",
  },
  settingsLabel: "Cookie settings",
} as const;
