// Loads Google Analytics 4 (gtag.js) in the browser on every visit. It is
// injected at runtime, so the static HTML never references Google and the
// site check's local-scripts rule still holds.

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

let loaded = false;

/** Adds the Google tag once, the same setup as Google's own snippet. */
export function loadGoogleAnalytics(measurementId: string) {
  if (loaded) return;
  loaded = true;
  window.dataLayer = window.dataLayer ?? [];
  // gtag.js reads Arguments objects from the data layer, not arrays.
  window.gtag = function gtag() {
    // biome-ignore lint/complexity/noArguments: the Google tag requires the Arguments object
    window.dataLayer?.push(arguments);
  };
  (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = false;
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", measurementId);
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}
