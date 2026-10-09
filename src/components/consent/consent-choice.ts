import { ANALYTICS } from "@/content/analytics";

export type ConsentChoice = "granted" | "denied";

/** Fired on window to reopen the banner, from the footer's cookie settings. */
export const CONSENT_REOPEN_EVENT = "fluxiq:cookie-settings";

// The choice lives in this browser only. Storage can be blocked (private
// windows, strict settings); then the banner simply asks again next visit.
export function readConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(ANALYTICS.storageKey);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(ANALYTICS.storageKey, choice);
  } catch {
    // Not remembered; the banner asks again next visit.
  }
}
