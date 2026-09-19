import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { cacheControlFor, SECURITY_HEADERS } from "../policy.mjs";
import {
  CATCH_ALL_SOURCE,
  renderVercelConfig,
  SCHEMA_URL,
  VERCEL_CONFIG,
  vercelConfig,
  vercelConfigMatches,
} from "../write-vercel-config.mjs";
import { SITE_FILES } from "./site-fixture.mjs";

const TOOL = fileURLToPath(new URL("../write-vercel-config.mjs", import.meta.url));
const SOURCE = /^\/:path\((.+)\)$/;

// What path-to-regexp 6 compiles `/:path(<pattern>)` to, with Vercel's
// options (strict, case-sensitive). The shape test below keeps every source
// inside what this translation covers.
function sourceRegExp(source) {
  return new RegExp(`^(?:\\/(${source.match(SOURCE)[1]}))$`);
}

// URL paths chosen to sit on every boundary of the three cache rules, plus
// every file and directory URL of the fixture site.
function corpus() {
  const urls = new Set([
    "/",
    "/docs",
    "/docs/",
    "/a.HTML",
    "/a.html/",
    "/.html",
    "/x.htmlx",
    "/x.xml.png",
    "/html",
    "/deep/nested/page.txt",
    "/__next._full.txt",
    "/_next/static",
    "/_next/static/",
    "/_next/static/x.txt",
    "/_next/static/a/b/c.js",
    "/_next/staticx/a.js",
    "/_next/other.html",
    "/_next/data.json",
    "/x/_next/static/a.js",
    "/favicon.ico",
  ]);
  for (const file of Object.keys(SITE_FILES)) {
    urls.add(`/${file}`);
    if (file.endsWith("index.html")) urls.add(`/${file.slice(0, -"index.html".length)}`);
  }
  return [...urls];
}

test("the committed vercel.json is exactly what policy.mjs generates", () => {
  assert.equal(
    vercelConfigMatches(VERCEL_CONFIG),
    true,
    "vercel.json is missing or has drifted from policy.mjs; run pnpm vercel:config",
  );
  assert.equal(readFileSync(VERCEL_CONFIG, "utf8").replace(/\r\n/g, "\n"), renderVercelConfig());
});

test("vercel.json sets only the schema and headers, leaving the build to the Next.js preset", () => {
  const config = vercelConfig();
  assert.deepEqual(Object.keys(config), ["$schema", "headers"]);
  assert.equal(config.$schema, SCHEMA_URL);
  assert.equal(SCHEMA_URL, "https://openapi.vercel.sh/vercel.json");
});

test("the catch-all rule alone carries the security headers, and every other rule only Cache-Control", () => {
  const [catchAll, ...cacheRules] = vercelConfig().headers;
  assert.equal(catchAll.source, CATCH_ALL_SOURCE);
  assert.deepEqual(Object.fromEntries(catchAll.headers.map(({ key, value }) => [key, value])), { ...SECURITY_HEADERS });
  assert.equal(cacheRules.length, 3);
  for (const rule of cacheRules) {
    assert.deepEqual(
      rule.headers.map(({ key }) => key),
      ["Cache-Control"],
      rule.source,
    );
  }
});

test("every source is a pattern path-to-regexp 6 accepts", () => {
  for (const { source } of vercelConfig().headers) {
    const match = source.match(SOURCE);
    assert.ok(match, `${source} has the form /:path(<pattern>)`);
    const pattern = match[1];
    assert.ok(!pattern.startsWith("?"), `${source}: a pattern cannot start with "?"`);
    let depth = 0;
    for (let index = 0; index < pattern.length; index += 1) {
      if (pattern[index] === "\\") index += 1;
      else if (pattern[index] === "(") {
        depth += 1;
        assert.equal(pattern[index + 1], "?", `${source}: no capturing groups`);
      } else if (pattern[index] === ")") {
        depth -= 1;
        assert.ok(depth >= 0, `${source}: balanced parentheses`);
      }
    }
    assert.equal(depth, 0, `${source}: balanced parentheses`);
    assert.doesNotThrow(() => sourceRegExp(source), source);
  }
});

test("every path gets the security headers and exactly one Cache-Control, the policy's", () => {
  const [catchAll, ...cacheRules] = vercelConfig().headers.map((rule) => ({
    regExp: sourceRegExp(rule.source),
    headers: rule.headers,
  }));
  for (const url of corpus()) {
    assert.ok(catchAll.regExp.test(url), `${url} gets the security headers`);
    const values = cacheRules.filter((rule) => rule.regExp.test(url)).map((rule) => rule.headers[0].value);
    assert.deepEqual(values, [cacheControlFor(url)], `${url} gets one Cache-Control`);
  }
});

test("--check exits 0 on a current file, even with CRLF endings, and 1 on a stale or missing one", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "vercel-config-"));
  try {
    const file = path.join(root, "vercel.json");
    const check = () => spawnSync(process.execPath, [TOOL, "--check", "--file", file], { encoding: "utf8" });

    const missing = check();
    assert.equal(missing.status, 1);
    assert.match(missing.stderr, /vercel\.json is missing; run pnpm vercel:config/);

    const written = spawnSync(process.execPath, [TOOL, "--file", file], { encoding: "utf8" });
    assert.equal(written.status, 0, written.stderr);
    assert.match(written.stdout, /^vercel-config: wrote /);
    assert.equal(readFileSync(file, "utf8"), renderVercelConfig());
    assert.equal(check().status, 0);

    writeFileSync(file, renderVercelConfig().replace(/\n/g, "\r\n"));
    assert.equal(check().status, 0);

    writeFileSync(file, renderVercelConfig().replace("max-age=86400", "max-age=60"));
    const stale = check();
    assert.equal(stale.status, 1);
    assert.match(stale.stderr, /differs from policy\.mjs; run pnpm vercel:config/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
