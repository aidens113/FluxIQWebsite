import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  CACHE_DEFAULT,
  CACHE_IMMUTABLE,
  CACHE_REVALIDATE,
  COMPRESSIBLE_TYPES,
  cacheControlFor,
  SECURITY_HEADERS,
} from "../policy.mjs";
import { cacheRules, MAX_HEADER_RULES, renderHtaccess, writeHostFiles } from "../write-host-files.mjs";
import { SITE_FILES, withSite } from "./site-fixture.mjs";

const TOOL = fileURLToPath(new URL("../write-host-files.mjs", import.meta.url));

// Parses a _headers file into [{ pattern, headers: [[name, value]] }].
function parseHeaders(text) {
  const rules = [];
  for (const line of text.split("\n")) {
    if (line.trim() === "" || line.startsWith("#")) continue;
    if (!/^\s/.test(line)) {
      rules.push({ pattern: line, headers: [] });
      continue;
    }
    const colon = line.indexOf(":");
    rules.at(-1).headers.push([line.slice(0, colon).trim(), line.slice(colon + 1).trim()]);
  }
  return rules;
}

// How Netlify and Cloudflare Pages match a pattern: a trailing splat matches
// any rest of the path, and anything else matches exactly.
const matches = (pattern, url) => (pattern.endsWith("*") ? url.startsWith(pattern.slice(0, -1)) : pattern === url);

// Every URL a host serves for a site: each file, and each directory URL that
// has an index.html.
function servedUrls(site, prefix = "/") {
  const urls = [];
  for (const name of readdirSync(path.join(site, prefix))) {
    if (name.startsWith(".") || (prefix === "/" && name === "_headers")) continue;
    if (statSync(path.join(site, prefix, name)).isDirectory()) urls.push(...servedUrls(site, `${prefix}${name}/`));
    else urls.push(`${prefix}${name}`);
    if (name === "index.html") urls.push(prefix);
  }
  return urls;
}

test("the writer refuses a missing out directory, from code and from the command line", async () => {
  await withSite({}, ({ root }) => {
    const missing = path.join(root, "nope");
    assert.throws(() => writeHostFiles(missing), /does not exist; run next build first/);
    const result = spawnSync(process.execPath, [TOOL, "--out", missing], { encoding: "utf8" });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /^host-files: .*nope does not exist/);
  });
});

test(".htaccess carries every policy header, the error page, charset, types, and compression", async () => {
  await withSite(SITE_FILES, ({ site }) => {
    writeHostFiles(site);
    const htaccess = readFileSync(path.join(site, ".htaccess"), "utf8");
    assert.equal(htaccess, renderHtaccess());
    for (const line of ["Options -Indexes", "DirectoryIndex index.html", "ErrorDocument 404 /404.html"]) {
      assert.match(htaccess, new RegExp(`^${line}$`, "m"));
    }
    assert.match(htaccess, /^AddDefaultCharset UTF-8$/m);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      assert.ok(htaccess.includes(`  Header always set ${name} "${value}"\n`), `${name} is set on every response`);
    }
    assert.ok(htaccess.includes(`  Header set Cache-Control "${CACHE_DEFAULT}"\n`));
    assert.ok(
      htaccess.includes(
        `  <FilesMatch "\\.(html|txt|xml)$">\n    Header set Cache-Control "${CACHE_REVALIDATE}"\n  </FilesMatch>\n`,
      ),
    );
    assert.match(htaccess, /^ {2}AddType text\/javascript \.js \.mjs$/m);
    assert.match(htaccess, /^ {2}AddCharset UTF-8 .*\.html/m);
    assert.ok(htaccess.includes(`    AddOutputFilterByType DEFLATE ${COMPRESSIBLE_TYPES.join(" ")}\n`));
    assert.doesNotMatch(htaccess, /<If[\s>]|<ElseIf|<Else>/, "no <If> blocks; LiteSpeed support is partial");
  });
});

test("every module-dependent .htaccess directive sits inside <IfModule>", async () => {
  const htaccess = renderHtaccess();
  let depth = 0;
  for (const line of htaccess.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("<IfModule")) depth += 1;
    else if (trimmed === "</IfModule>") depth -= 1;
    else if (/^(Header|AddType|AddCharset|AddOutputFilterByType|<FilesMatch)/.test(trimmed)) {
      assert.ok(depth > 0, `${trimmed} is guarded`);
    }
  }
  assert.equal(depth, 0);
});

test("_next/static/.htaccess makes hashed assets immutable", async () => {
  await withSite(SITE_FILES, ({ site }) => {
    writeHostFiles(site);
    const text = readFileSync(path.join(site, "_next", "static", ".htaccess"), "utf8");
    assert.ok(text.includes(`<IfModule mod_headers.c>\n  Header set Cache-Control "${CACHE_IMMUTABLE}"\n`));
    assert.ok(!text.includes(CACHE_DEFAULT) && !text.includes(CACHE_REVALIDATE));
  });
});

test("_headers sets the security headers once, on /*", async () => {
  await withSite(SITE_FILES, ({ site }) => {
    writeHostFiles(site);
    const rules = parseHeaders(readFileSync(path.join(site, "_headers"), "utf8"));
    assert.equal(rules[0].pattern, "/*");
    assert.deepEqual(Object.fromEntries(rules[0].headers), SECURITY_HEADERS);
    for (const rule of rules.slice(1)) {
      assert.deepEqual(
        rule.headers.map(([name]) => name),
        ["Cache-Control"],
        `${rule.pattern} sets only Cache-Control`,
      );
    }
  });
});

test("_headers gives every served URL exactly one Cache-Control, the policy's", async () => {
  await withSite(SITE_FILES, ({ site }) => {
    writeHostFiles(site);
    const rules = parseHeaders(readFileSync(path.join(site, "_headers"), "utf8"));
    const urls = servedUrls(site);
    assert.ok(urls.includes("/") && urls.includes("/docs/") && urls.includes("/_next/static/chunks/app.js"));
    for (const url of urls) {
      const values = rules
        .filter((rule) => matches(rule.pattern, url))
        .flatMap((rule) => rule.headers.filter(([name]) => name === "Cache-Control").map(([, value]) => value));
      assert.deepEqual(values, [cacheControlFor(url)], `${url} gets one Cache-Control`);
    }
  });
});

test("cache rules roll up page-free directories and never overlap _next/static", async () => {
  await withSite(SITE_FILES, ({ site }) => {
    const patterns = cacheRules(site).map((rule) => rule.pattern);
    assert.equal(patterns[0], "/_next/static/*");
    assert.ok(patterns.includes("/brand/*"), "one rule for a directory of images");
    assert.ok(patterns.includes("/_not-found/__next._not-found/*"), "one rule for a directory of payloads");
    assert.ok(patterns.includes("/docs/") && patterns.includes("/docs/index.html"), "a page directory is exact");
    assert.ok(!patterns.includes("/docs/*") && !patterns.includes("/_next/*"));
    assert.equal(new Set(patterns).size, patterns.length, "no pattern twice");
  });
});

test("rerunning the writer gives the same files", async () => {
  await withSite(SITE_FILES, ({ site }) => {
    writeHostFiles(site);
    const first = readFileSync(path.join(site, "_headers"), "utf8");
    writeHostFiles(site);
    assert.equal(readFileSync(path.join(site, "_headers"), "utf8"), first);
    assert.doesNotMatch(first, /htaccess|^\/_headers$/m);
  });
});

test("the writer fails rather than exceed the Cloudflare Pages rule limit", async () => {
  const files = { "index.html": "<h1>x</h1>" };
  for (let index = 0; index < MAX_HEADER_RULES; index += 1) files[`page-${index}.png`] = "png";
  await withSite(files, ({ site }) => {
    assert.throws(() => writeHostFiles(site), /Cloudflare Pages reads at most 100/);
  });
});

test("the writer fails on a file name _headers cannot express", async () => {
  await withSite({ "index.html": "<h1>x</h1>", "brand/bad name.png": "png" }, ({ site }) => {
    assert.throws(() => writeHostFiles(site), /\/brand\/bad name\.png cannot be written as a _headers path/);
  });
});

test("the command line writes all three files and reports the rule count", async () => {
  await withSite(SITE_FILES, ({ site }) => {
    const result = spawnSync(process.execPath, [TOOL, "--out", site], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.match(
      result.stdout,
      /^host-files: wrote \.htaccess, _next\/static\/\.htaccess, _headers in .* \(\d+ _headers rules\)/,
    );
    for (const file of [".htaccess", "_headers", "_next/static/.htaccess"]) {
      assert.ok(statSync(path.join(site, file)).isFile(), file);
    }
  });
});
