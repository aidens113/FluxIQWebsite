// A small built site shaped like the Next export: a root page and a nested
// page with their RSC payloads, the 404 page in both places Next writes it,
// hashed assets under _next/static, an asset directory with no page, and a
// secret one level above the site that no request may reach.

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

export const SECRET = "fixture-secret-do-not-serve";
export const INDEX_HTML = `<!DOCTYPE html><html lang="en"><head><title>Home</title></head><body><h1>Home</h1>${"<p>Automate smarter.</p>".repeat(200)}</body></html>`;
export const NOT_FOUND_HTML =
  '<!DOCTYPE html><html lang="en"><head><title>Not found</title></head><body><h1>404</h1></body></html>';
export const APP_JS = `self.__app=${JSON.stringify("chunk ".repeat(300))};\n`;

export const SITE_FILES = {
  "index.html": INDEX_HTML,
  "index.txt": "0:rsc payload\n",
  "404.html": NOT_FOUND_HTML,
  "404/index.html": NOT_FOUND_HTML,
  "docs/index.html": "<!DOCTYPE html><title>Docs</title><h1>Docs</h1>",
  "docs/index.txt": "0:docs payload\n",
  "robots.txt": "User-Agent: *\nAllow: /\n",
  "sitemap.xml": '<?xml version="1.0" encoding="UTF-8"?><urlset></urlset>\n',
  "favicon.ico": "ico",
  "icon.png": "png",
  "brand/logo.webp": "webp",
  "brand/marks/mark.svg": '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
  "_not-found/index.html": NOT_FOUND_HTML,
  "_not-found/__next._not-found/__PAGE__.txt": "0:not found payload\n",
  "_next/static/chunks/app.js": APP_JS,
  "_next/static/chunks/app.css": "body{margin:0}\n",
  "_next/static/media/font.woff2": "woff2",
  "_next/static/BUILD_ID/_buildManifest.js": "self.__BUILD_MANIFEST={};\n",
};

// Writes files under <tmp>/site, with the secret at <tmp>/package.json, runs
// fn({ root, site }), and removes everything afterwards, even on failure.
export async function withSite(files, fn) {
  const root = mkdtempSync(path.join(os.tmpdir(), "static-hosting-"));
  const site = path.join(root, "site");
  try {
    writeFileSync(path.join(root, "package.json"), JSON.stringify({ secret: SECRET }));
    for (const [relative, content] of Object.entries(files)) {
      const file = path.join(site, relative);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, content);
    }
    mkdirSync(site, { recursive: true });
    return await fn({ root, site });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
