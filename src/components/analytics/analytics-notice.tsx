"use client";

import { useEffect, useState } from "react";
import { FOCUS_RING } from "@/components/ui/focus-ring";
import { ANALYTICS } from "@/content/analytics";
import { LINKS } from "@/content/links";
import { loadGoogleAnalytics } from "./google-analytics";

const LINK = `rounded-sm text-fg underline underline-offset-4 hover:text-amber ${FOCUS_RING}`;

// Whether this browser has dismissed the notice. Storage can be blocked
// (private windows, strict settings); then the notice simply shows again.
function dismissed(): boolean {
  try {
    return window.localStorage.getItem(ANALYTICS.noticeKey) === "dismissed";
  } catch {
    return false;
  }
}

/**
 * Loads Google Analytics on every visit and, until the visitor dismisses it,
 * shows a notice that the site uses analytics, linking the privacy notice and
 * terms of use. Mounted once in the root layout.
 */
export function AnalyticsNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadGoogleAnalytics(ANALYTICS.measurementId);
    setOpen(!dismissed());
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(ANALYTICS.noticeKey, "dismissed");
    } catch {
      // Not remembered; the notice shows again next visit.
    }
    setOpen(false);
  };

  if (!open) return null;
  const { notice } = ANALYTICS;
  return (
    <section
      aria-label={notice.label}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-[640px] items-center gap-4 rounded-2xl border border-edge bg-panel/95 p-4 pl-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur"
    >
      <p className="text-sm leading-relaxed text-soft">
        {notice.lead}{" "}
        <a href={LINKS.privacy.href} className={LINK}>
          {notice.privacy}
        </a>{" "}
        {notice.joiner}{" "}
        <a href={LINKS.terms.href} className={LINK}>
          {notice.terms}
        </a>
        .
      </p>
      <button
        type="button"
        onClick={dismiss}
        className={`min-h-11 shrink-0 rounded-lg bg-amber px-5 text-sm font-semibold text-ink transition-colors hover:bg-amber/90 ${FOCUS_RING}`}
      >
        {notice.dismiss}
      </button>
    </section>
  );
}
