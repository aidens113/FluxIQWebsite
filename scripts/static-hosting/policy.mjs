// The one header policy for every way the static export is served: the
// security headers, the Content-Security-Policy, the cache rules, the content
// types, and which of those types are worth compressing. write-host-files.mjs
// derives out/.htaccess and out/_headers from it, and serve.mjs applies it to
// every response, so Apache, LiteSpeed, Netlify, Cloudflare Pages, the Node
// server, and the Docker image built on that server cannot drift apart.
//
// Change a header here and nowhere else; `pnpm build` regenerates the host
// files and `pnpm start` picks the change up on its next start.
//
// The CSP allows 'unsafe-inline' scripts because the export inlines its React
// Server Components payload (`self.__next_f.push(...)`) in <script> tags.

import path from "node:path";

// Google Analytics 4, loaded only after a visitor accepts the cookie banner
// (src/components/consent). These are the hosts Google documents for a GA4
// Content-Security-Policy: the tag script, and the hits it sends.
const GOOGLE_TAG = "https://*.googletagmanager.com";
const GOOGLE_ANALYTICS = "https://*.google-analytics.com https://*.analytics.google.com";

export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${GOOGLE_TAG}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: ${GOOGLE_ANALYTICS} ${GOOGLE_TAG}`,
  "font-src 'self'",
  `connect-src 'self' ${GOOGLE_ANALYTICS} ${GOOGLE_TAG}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

// Sent with every response, whatever its status.
export const SECURITY_HEADERS = Object.freeze({
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000",
  "Content-Security-Policy": CONTENT_SECURITY_POLICY,
});

// Hashed build assets never change under the same URL.
export const IMMUTABLE_PREFIX = "/_next/static/";
export const CACHE_IMMUTABLE = "public, max-age=31536000, immutable";
// Documents and the RSC payloads next to them must be fresh after a deploy.
export const CACHE_REVALIDATE = "public, max-age=0, must-revalidate";
export const REVALIDATE_EXTENSIONS = Object.freeze([".html", ".txt", ".xml"]);
// Unhashed assets (icons, images under public/) may be a day stale.
export const CACHE_DEFAULT = "public, max-age=86400";

// The Cache-Control value for a URL path. The query string and fragment are
// ignored, and a path ending in "/" is a directory URL. The extension test is
// a plain, case-sensitive suffix match, as an Apache <FilesMatch> and the
// vercel.json patterns make it, so every host agrees on "a.HTML" and ".html".
export function cacheControlFor(urlPath) {
  const pathname = String(urlPath).split(/[?#]/, 1)[0] || "/";
  if (pathname.startsWith(IMMUTABLE_PREFIX)) return CACHE_IMMUTABLE;
  if (pathname.endsWith("/")) return CACHE_REVALIDATE;
  if (REVALIDATE_EXTENSIONS.some((extension) => pathname.endsWith(extension))) return CACHE_REVALIDATE;
  return CACHE_DEFAULT;
}

// Content types by lowercase extension. Text types carry their charset.
export const CONTENT_TYPES = Object.freeze({
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
});
export const DEFAULT_CONTENT_TYPE = "application/octet-stream";

export function contentTypeFor(filePath) {
  return CONTENT_TYPES[path.extname(String(filePath)).toLowerCase()] ?? DEFAULT_CONTENT_TYPE;
}

// The media type without parameters, lowercased: "text/html; charset=utf-8"
// becomes "text/html".
export function mediaType(contentType) {
  return String(contentType).split(";", 1)[0].trim().toLowerCase();
}

// Types that shrink under gzip. Images, fonts, and video are already
// compressed, so compressing them again costs CPU for nothing.
export const COMPRESSIBLE_TYPES = Object.freeze([
  "text/html",
  "text/css",
  "text/javascript",
  "text/plain",
  "application/json",
  "application/xml",
  "application/manifest+json",
  "image/svg+xml",
  "image/x-icon",
]);

export function isCompressible(contentType) {
  return COMPRESSIBLE_TYPES.includes(mediaType(contentType));
}
