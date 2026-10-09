// Loads and stops Google Analytics 4 (gtag.js) in the browser. Called only
// after the visitor's choice, so the static HTML never references Google.

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

/** Stops measurement in this page and removes the Google Analytics cookies. */
export function stopGoogleAnalytics(measurementId: string) {
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
  (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = true;
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name?.startsWith("_ga")) continue;
    for (const domain of domains) {
      // biome-ignore lint/suspicious/noDocumentCookie: the Cookie Store API is not in every browser this site supports
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}
