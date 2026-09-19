// Generates vercel.json at the repository root from policy.mjs. Vercel reads
// neither _headers nor .htaccess, so this file carries the same policy: the
// security headers on every path and exactly one Cache-Control for each URL.
// It is committed, because Vercel reads it before building, and a test fails
// when it drifts from policy.mjs.
//
// Vercel compiles each `source` with path-to-regexp, case-sensitively and
// without an optional trailing slash, and it does not document which rule
// wins when two that match set the same header. So only the catch-all rule
// sets the security headers, and the cache rules are regular expressions that
// split every path three ways, mirroring `cacheControlFor`:
//   immutable   the path starts with IMMUTABLE_PREFIX
//   revalidate  otherwise, the path is "/", ends in "/", or ends in one of
//               REVALIDATE_EXTENSIONS
//   default     everything else
// Every source has the form `/:path(<pattern>)`, which path-to-regexp turns
// into `^(?:\/(<pattern>))$`. A pattern may use (?:...) and (?!...) groups but
// no capturing group, and must not start with "?".
//
// There are no framework, build, or output settings: Vercel's Next.js preset
// builds the static export by itself.
//
// Usage:  node scripts/static-hosting/write-vercel-config.mjs [--check] [--file <path>]
//   Writes <path>, which defaults to vercel.json at the repository root. With
//   --check it writes nothing and exits 1 when the file is missing or differs
//   from what policy.mjs generates.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CACHE_DEFAULT,
  CACHE_IMMUTABLE,
  CACHE_REVALIDATE,
  IMMUTABLE_PREFIX,
  REVALIDATE_EXTENSIONS,
  SECURITY_HEADERS,
} from "./policy.mjs";

export const REPOSITORY_ROOT = fileURLToPath(new URL("../../", import.meta.url));
export const VERCEL_CONFIG = path.join(REPOSITORY_ROOT, "vercel.json");
export const SCHEMA_URL = "https://openapi.vercel.sh/vercel.json";
export const CATCH_ALL_SOURCE = "/:path(.*)";

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// The cache rules as patterns over the path after its leading "/".
export function cachePatterns() {
  const immutable = escapeRegExp(IMMUTABLE_PREFIX.slice(1));
  const document = `\\.(?:${REVALIDATE_EXTENSIONS.map((extension) => escapeRegExp(extension.slice(1))).join("|")})`;
  return [
    { pattern: `${immutable}.*`, cacheControl: CACHE_IMMUTABLE },
    { pattern: `(?!${immutable})(?:.*/|.*${document})?`, cacheControl: CACHE_REVALIDATE },
    { pattern: `(?!${immutable})(?!.*${document}$).*[^/]`, cacheControl: CACHE_DEFAULT },
  ];
}

export function vercelConfig() {
  const entry = (key, value) => ({ key, value });
  return {
    $schema: SCHEMA_URL,
    headers: [
      {
        source: CATCH_ALL_SOURCE,
        headers: Object.entries(SECURITY_HEADERS).map(([key, value]) => entry(key, value)),
      },
      ...cachePatterns().map(({ pattern, cacheControl }) => ({
        source: `/:path(${pattern})`,
        headers: [entry("Cache-Control", cacheControl)],
      })),
    ],
  };
}

export function renderVercelConfig() {
  return `${JSON.stringify(vercelConfig(), null, 2)}\n`;
}

// Whether the file at `file` is exactly what policy.mjs generates, ignoring
// CRLF line endings; null when the file cannot be read.
export function vercelConfigMatches(file) {
  try {
    return readFileSync(file, "utf8").replace(/\r\n/g, "\n") === renderVercelConfig();
  } catch {
    return null;
  }
}

function main(argv) {
  const fileFlag = argv.indexOf("--file");
  const file = path.resolve(fileFlag >= 0 && argv[fileFlag + 1] ? argv[fileFlag + 1] : VERCEL_CONFIG);
  if (!argv.includes("--check")) {
    writeFileSync(file, renderVercelConfig());
    console.log(`vercel-config: wrote ${file}`);
    return 0;
  }
  const matches = vercelConfigMatches(file);
  if (matches) {
    console.log(`vercel-config: ${file} matches policy.mjs`);
    return 0;
  }
  const problem = matches === null ? "is missing" : "differs from policy.mjs";
  console.error(`vercel-config: ${file} ${problem}; run pnpm vercel:config`);
  return 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
