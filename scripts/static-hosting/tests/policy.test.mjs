import assert from "node:assert/strict";
import test from "node:test";
import {
  CACHE_DEFAULT,
  CACHE_IMMUTABLE,
  CACHE_REVALIDATE,
  CONTENT_SECURITY_POLICY,
  CONTENT_TYPES,
  cacheControlFor,
  contentTypeFor,
  DEFAULT_CONTENT_TYPE,
  isCompressible,
  mediaType,
  SECURITY_HEADERS,
} from "../policy.mjs";

test("the security headers are exactly the ones the deployment decision names", () => {
  assert.deepEqual(SECURITY_HEADERS, {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=31536000",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://*.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; font-src 'self'; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  });
  assert.equal(SECURITY_HEADERS["Content-Security-Policy"], CONTENT_SECURITY_POLICY);
  assert.ok(Object.isFrozen(SECURITY_HEADERS));
});

test("hashed build assets are immutable, whatever their type", () => {
  for (const url of [
    "/_next/static/chunks/app.js",
    "/_next/static/chunks/app.css",
    "/_next/static/media/font.woff2",
    "/_next/static/BUILD_ID/_buildManifest.js",
    "/_next/static/chunks/app.js?v=1",
    "/_next/static/odd.txt",
  ]) {
    assert.equal(cacheControlFor(url), CACHE_IMMUTABLE, url);
  }
});

test("documents, payloads, and directory URLs must revalidate", () => {
  for (const url of [
    "/",
    "/docs/",
    "/index.html",
    "/404.html",
    "/index.txt",
    "/robots.txt",
    "/sitemap.xml",
    "/docs/?q=1",
    "/index.html#top",
    "",
    "/_next/other.html",
  ]) {
    assert.equal(cacheControlFor(url), CACHE_REVALIDATE, url);
  }
});

test("everything else may be a day stale", () => {
  for (const url of [
    "/favicon.ico",
    "/icon.png",
    "/brand/logo.webp",
    "/opengraph-image.png?abc",
    "/_next/static",
    "/_next/other.js",
    "/docs",
    "/index.HTML",
  ]) {
    assert.equal(cacheControlFor(url), CACHE_DEFAULT, url);
  }
});

test("content types come from the extension, case-insensitively, with charsets on text", () => {
  assert.equal(contentTypeFor("/a/index.html"), "text/html; charset=utf-8");
  assert.equal(contentTypeFor("C:\\out\\INDEX.HTML"), "text/html; charset=utf-8");
  assert.equal(contentTypeFor("app.js"), "text/javascript; charset=utf-8");
  assert.equal(contentTypeFor("font.woff2"), "font/woff2");
  assert.equal(contentTypeFor("logo.webp"), "image/webp");
  assert.equal(contentTypeFor("archive.tar"), DEFAULT_CONTENT_TYPE);
  assert.equal(contentTypeFor("README"), DEFAULT_CONTENT_TYPE);
  for (const [extension, type] of Object.entries(CONTENT_TYPES)) {
    assert.match(extension, /^\.[a-z0-9]+$/, "keys are lowercase extensions");
    if (type.startsWith("text/")) assert.match(type, /; charset=utf-8$/, `${extension} declares its charset`);
  }
});

test("text types compress and already-compressed media do not", () => {
  for (const type of ["text/html; charset=utf-8", "text/css", "TEXT/JAVASCRIPT", "application/json", "image/svg+xml"]) {
    assert.ok(isCompressible(type), type);
  }
  for (const type of ["image/png", "image/webp", "font/woff2", "video/mp4", DEFAULT_CONTENT_TYPE]) {
    assert.ok(!isCompressible(type), type);
  }
  assert.equal(mediaType("Text/HTML; charset=utf-8"), "text/html");
});
