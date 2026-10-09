"use client";

import { FOCUS_RING } from "@/components/ui/focus-ring";
import { ANALYTICS } from "@/content/analytics";
import { CONSENT_REOPEN_EVENT } from "./consent-choice";

/** A footer link-styled button that reopens the cookie banner. */
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT))}
      className={`rounded-sm text-muted underline-offset-4 transition-colors hover:text-amber hover:underline ${FOCUS_RING}`}
    >
      {ANALYTICS.settingsLabel}
    </button>
  );
}
