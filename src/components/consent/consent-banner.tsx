"use client";

import { useEffect, useState } from "react";
import { FOCUS_RING } from "@/components/ui/focus-ring";
import { ANALYTICS } from "@/content/analytics";
import { CONSENT_REOPEN_EVENT, type ConsentChoice, readConsent, writeConsent } from "./consent-choice";
import { loadGoogleAnalytics, stopGoogleAnalytics } from "./google-analytics";

const BUTTON = `min-h-11 rounded-lg px-5 text-sm font-semibold transition-colors ${FOCUS_RING}`;

/**
 * Asks before any analytics load. A visitor who accepts gets Google Analytics
 * on this and later visits; one who declines gets nothing. The footer's cookie
 * settings reopen it, so the choice can change at any time.
 */
export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const choice = readConsent();
    if (choice === "granted") loadGoogleAnalytics(ANALYTICS.measurementId);
    else if (choice === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen);
  }, []);

  const choose = (choice: ConsentChoice) => {
    writeConsent(choice);
    if (choice === "granted") loadGoogleAnalytics(ANALYTICS.measurementId);
    else stopGoogleAnalytics(ANALYTICS.measurementId);
    setOpen(false);
  };

  if (!open) return null;
  return (
    <section
      aria-label={ANALYTICS.banner.label}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-[680px] flex-col gap-4 rounded-2xl border border-edge bg-panel/95 p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur sm:flex-row sm:items-center sm:gap-6"
    >
      <p className="text-sm leading-relaxed text-soft">{ANALYTICS.banner.text}</p>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => choose("denied")}
          className={`${BUTTON} flex-1 border border-edge text-fg hover:border-dim sm:flex-none`}
        >
          {ANALYTICS.banner.decline}
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className={`${BUTTON} flex-1 bg-amber text-ink hover:bg-amber/90 sm:flex-none`}
        >
          {ANALYTICS.banner.accept}
        </button>
      </div>
    </section>
  );
}
