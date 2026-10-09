// Audits the built static export in out/ for the rules every page must keep:
// one h1, resolvable anchors, allowlisted links, complete head metadata, none
// of the retired copy, and a JavaScript budget. Each page in PAGES is checked
// against its own canonical URL and required ids. It parses with regexes on
// purpose; the page is a single generated document, and a parser dependency
// would buy nothing here. Every finding fails.
//
// Rules:
//   missing-index    out/index.html exists (run `pnpm build` first)
//   missing-page     every other page in PAGES exists
//   html-lang        the root element is <html lang="en">
//   single-h1        the document has exactly one <h1>
//   img-alt          every <img> has an alt attribute (empty is allowed)
//   anchor-target    every href="#x" resolves to an element with id="x"
//   required-anchor  #main and the page's section anchors exist
//   link-allowlist   every other <a href> is on the allowlist
//   link-rel         every target="_blank" link has rel="noopener noreferrer"
//   head-meta        title, description, the page's canonical, absolute og:image, twitter:card
//   retired-phrase   no retired phrase in visible text or meta content
//   js-budget        the scripts a modern browser loads per page total at most 200 KB gzip
//
// js-budget measures what a module-supporting browser downloads: every
// <script src> in the page that has no nomodule attribute, resolved against
// the out directory, deduplicated by file, and gzipped one file at a time as a
// server would send it. Legacy nomodule polyfills, inline scripts, and files
// nothing references are not counted. A referenced file that is missing, or a
// src that is not a local file, is itself a js-budget finding, because it
// cannot be measured.
//
// Comments, the doctype, and script and style elements are removed before the
// document rules run, so the serialized RSC payload Next inlines in <script>
// tags never counts as markup or visible text.
//
// Usage:  node scripts/site-check.mjs [--out <dir>]
//   <dir> defaults to `out`, relative to the working directory. Prints one
//   `<rule>: <message>` line per finding (prefixed with the page for pages
//   other than index.html) and exits 1 if there are any,
//   otherwise prints `site-check: passed (<n> KB gzip JS)` and exits 0.

import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

export const ALLOWED_HREFS = [
  "https://github.com/aidens113/FluxIQ",
  "https://github.com/aidens113/FluxIQWebExtension",
  "https://github.com/aidens113/FluxIQ/blob/main/LICENSE.md",
  "https://x.com/GetFluxIQ",
  "mailto:license@getfluxiq.com",
  "/",
  "/extension/",
  "/papers/fluxiq-technical-vision-v0.9.pdf",
  "/privacy/",
  "/terms/",
  "https://policies.google.com/privacy",
  "https://tools.google.com/dlpage/gaoptout",
  "https://getfluxiq.com/",
];
// Every page the export must contain, its canonical URL, and the ids its
// navigation and skip link point at. The first page is the home page.
export const PAGES = [
  {
    file: "index.html",
    canonical: "https://getfluxiq.com/",
    requiredIds: ["main", "why", "framework", "how-it-works", "vision", "paper", "status"],
  },
  {
    file: "extension/index.html",
    canonical: "https://getfluxiq.com/extension/",
    requiredIds: ["main", "features", "setup"],
  },
  { file: "privacy/index.html", canonical: "https://getfluxiq.com/privacy/", requiredIds: ["main", "legal-title"] },
  { file: "terms/index.html", canonical: "https://getfluxiq.com/terms/", requiredIds: ["main", "legal-title"] },
];
export const REQUIRED_IDS = PAGES[0].requiredIds;
export const CANONICAL_URL = PAGES[0].canonical;
// Each phrase must start on a word boundary, so "many models" does not match
// "any model" and "mastodon" does not match "todo". "policy" is a whole word
// at both ends, so "policies" and "policyholder" pass.
export const RETIRED_PHRASES = [
  { phrase: "policy", pattern: /\bpolicy\b/i },
  { phrase: "learns from your demonstrations", pattern: /\blearns\s+from\s+your\s+demonstrations/i },
  { phrase: "patches the flow", pattern: /\bpatches\s+the\s+flow/i },
  { phrase: "any model", pattern: /\bany\s+model/i },
  { phrase: "lorem", pattern: /\blorem/i },
  { phrase: "todo", pattern: /\btodo/i },
  // Core removed execution grants; model limits are user-set per Flow, so the
  // site names neither the old concept nor its old $2 ceiling.
  { phrase: "execution grant", pattern: /\bexecution\s+grants?\b/i },
  { phrase: "$2", pattern: /\$2(?![\d,]|\.\d)/ },
];
export const MAX_SCRIPT_GZIP_BYTES = 200 * 1024;

// A start tag, with quoted attribute values allowed to contain ">".
const START_TAG = /<([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
const ATTRIBUTE = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
// A whole script element, so a script body is consumed and never read as tags.
const SCRIPT_ELEMENT = /<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>[\s\S]*?<\/script\s*>/gi;
const NON_CONTENT = [
  /<!--[\s\S]*?-->/g,
  /<![^>]*>/g,
  SCRIPT_ELEMENT,
  /<style\b(?:[^>"']|"[^"]*"|'[^']*')*>[\s\S]*?<\/style\s*>/gi,
];
const NAMED_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, body) => {
    if (body[0] === "#") {
      const code = body[1] === "x" || body[1] === "X" ? Number.parseInt(body.slice(2), 16) : Number(body.slice(1));
      return Number.isFinite(code) && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? entity;
  });
}

function parseAttributes(source) {
  const attributes = new Map();
  for (const match of source.matchAll(ATTRIBUTE)) {
    const name = match[1].toLowerCase();
    if (!attributes.has(name)) attributes.set(name, decodeEntities(match[2] ?? match[3] ?? match[4] ?? ""));
  }
  return attributes;
}

function startTags(markup) {
  return [...markup.matchAll(START_TAG)].map((match) => ({
    name: match[1].toLowerCase(),
    attributes: parseAttributes(match[2]),
  }));
}

function tokens(value) {
  return new Set((value ?? "").toLowerCase().split(/\s+/).filter(Boolean));
}

function visibleText(markup) {
  return decodeEntities(markup.replace(START_TAG, " ").replace(/<\/[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function excerpt(text, index) {
  const start = Math.max(0, index - 20);
  return `${start > 0 ? "…" : ""}${text.slice(start, index + 40).trim()}…`;
}

function checkDocument(tags, report) {
  const html = tags.find((tag) => tag.name === "html");
  if (!html) report("html-lang", "no <html> element");
  else if (!html.attributes.has("lang")) report("html-lang", '<html> has no lang attribute, expected lang="en"');
  else if (html.attributes.get("lang") !== "en") {
    report("html-lang", `<html> has lang="${html.attributes.get("lang")}", expected "en"`);
  }

  const headings = tags.filter((tag) => tag.name === "h1").length;
  if (headings !== 1) report("single-h1", `found ${headings} <h1> elements, expected exactly 1`);

  for (const image of tags.filter((tag) => tag.name === "img")) {
    if (!image.attributes.has("alt")) {
      report("img-alt", `<img src="${image.attributes.get("src") ?? ""}"> has no alt attribute`);
    }
  }
}

function checkLinks(tags, page, report) {
  const ids = new Set(tags.filter((tag) => tag.attributes.has("id")).map((tag) => tag.attributes.get("id")));
  for (const id of page.requiredIds) {
    if (!ids.has(id)) report("required-anchor", `no element with id="${id}"`);
  }

  for (const link of tags.filter((tag) => tag.name === "a" && tag.attributes.has("href"))) {
    const href = link.attributes.get("href").trim();
    if (href.startsWith("#")) {
      let target = href.slice(1);
      try {
        target = decodeURIComponent(target);
      } catch {
        // A malformed escape cannot match an id; report it as written.
      }
      if (target === "" || !ids.has(target)) {
        report("anchor-target", `href="${href}" has no element with id="${target}"`);
      }
    } else if (!ALLOWED_HREFS.includes(href)) {
      report("link-allowlist", `href="${href}" is not on the allowlist`);
    }

    if (link.attributes.get("target")?.toLowerCase() === "_blank") {
      const rel = tokens(link.attributes.get("rel"));
      if (!rel.has("noopener") || !rel.has("noreferrer")) {
        report("link-rel", `target="_blank" link to "${href}" needs rel="noopener noreferrer"`);
      }
    }
  }
}

function checkHead(markup, tags, page, report) {
  const head = markup.match(/<head\b[^>]*>([\s\S]*?)<\/head\s*>/i)?.[1] ?? markup;
  const title = head.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i);
  if (!title || visibleText(title[1]) === "") report("head-meta", "missing a non-empty <title>");

  const metas = tags.filter((tag) => tag.name === "meta");
  const metaContent = (key, value) =>
    metas
      .find((tag) => tag.attributes.get(key) === value && tag.attributes.get("content")?.trim())
      ?.attributes.get("content")
      .trim();

  if (!metaContent("name", "description")) report("head-meta", 'missing <meta name="description"> with content');
  if (!metaContent("name", "twitter:card")) report("head-meta", 'missing <meta name="twitter:card"> with content');

  const image = metaContent("property", "og:image");
  if (!image) report("head-meta", 'missing <meta property="og:image"> with content');
  else if (!/^https?:\/\/[^/\s]+/i.test(image)) report("head-meta", `og:image "${image}" is not an absolute URL`);

  const canonical = tags.some(
    (tag) =>
      tag.name === "link" &&
      tokens(tag.attributes.get("rel")).has("canonical") &&
      tag.attributes.get("href") === page.canonical,
  );
  if (!canonical) report("head-meta", `missing <link rel="canonical" href="${page.canonical}">`);
}

function checkPhrases(markup, tags, report) {
  const sources = [{ where: "visible text", text: visibleText(markup) }];
  for (const tag of tags) {
    if (tag.name !== "meta" || !tag.attributes.has("content")) continue;
    const key = ["name", "property", "http-equiv", "itemprop"].find((attribute) => tag.attributes.has(attribute));
    const label = key ? `<meta ${key}="${tag.attributes.get(key)}">` : "<meta>";
    sources.push({ where: `${label} content`, text: tag.attributes.get("content") });
  }
  for (const { where, text } of sources) {
    for (const { phrase, pattern } of RETIRED_PHRASES) {
      const match = pattern.exec(text);
      if (match) report("retired-phrase", `"${phrase}" in ${where}: "${excerpt(text, match.index)}"`);
    }
  }
}

// The pure checker: every rule that reads the document, given its HTML and
// the page it is (the home page unless told otherwise).
export function checkHtml(html, page = PAGES[0]) {
  const findings = [];
  const report = (rule, message) => findings.push({ rule, message });
  const markup = NON_CONTENT.reduce((text, pattern) => text.replace(pattern, " "), html);
  const tags = startTags(markup);
  checkDocument(tags, report);
  checkLinks(tags, page, report);
  checkHead(markup, tags, page, report);
  checkPhrases(markup, tags, report);
  return findings;
}

// Pure: the src of every <script> a module-supporting browser runs, in
// document order. Commented-out scripts and nomodule scripts are left out.
export function scriptSources(html) {
  const sources = [];
  for (const match of html.replace(/<!--[\s\S]*?-->/g, " ").matchAll(SCRIPT_ELEMENT)) {
    const attributes = parseAttributes(match[1]);
    const src = attributes.get("src")?.trim();
    if (src && !attributes.has("nomodule")) sources.push(src);
  }
  return sources;
}

// The file a src names inside the out directory, resolved as a browser would
// against the site root (index.html is at the root), or null when it points
// at another origin, is malformed, or escapes the directory.
const SITE_ORIGIN = "https://site.invalid";

function localScript(root, src) {
  let pathname;
  try {
    const url = new URL(src, `${SITE_ORIGIN}/`);
    if (url.origin !== SITE_ORIGIN) return null;
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return null;
  }
  const file = path.join(root, pathname);
  const relative = path.relative(root, file);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative) ? file : null;
}

// The gzip size of the given script sources, each distinct file compressed on
// its own, plus a message for every source that cannot be measured.
export function measureScripts(outDir, sources) {
  const root = path.resolve(outDir);
  const files = new Set();
  const problems = [];
  for (const src of sources) {
    const file = localScript(root, src);
    if (!file) {
      problems.push(`<script src="${src}"> is not a file in the build, so it cannot be measured`);
    } else if (!existsSync(file) || !statSync(file).isFile()) {
      problems.push(`<script src="${src}"> refers to a missing file: ${path.relative(root, file)}`);
    } else {
      files.add(file);
    }
  }
  let bytes = 0;
  for (const file of files) bytes += gzipSync(readFileSync(file)).length;
  return { bytes, problems };
}

function checkPage(outDir, page) {
  const html = readFileSync(path.join(outDir, page.file), "utf8");
  const findings = checkHtml(html, page);
  const { bytes, problems } = measureScripts(outDir, scriptSources(html));
  for (const message of problems) findings.push({ rule: "js-budget", message });
  if (bytes > MAX_SCRIPT_GZIP_BYTES) {
    const kilobytes = (bytes / 1024).toFixed(1);
    findings.push({
      rule: "js-budget",
      message: `${kilobytes} KB gzip of JavaScript loaded by ${page.file}, limit ${MAX_SCRIPT_GZIP_BYTES / 1024} KB`,
    });
  }
  return { findings, bytes };
}

// Checks every page; the reported script size is the largest any page loads.
export function checkSite(outDir, pages = PAGES) {
  const indexPath = path.join(outDir, pages[0].file);
  if (!existsSync(indexPath)) {
    return {
      findings: [{ rule: "missing-index", message: `${indexPath} does not exist; run pnpm build first` }],
      scriptBytes: 0,
    };
  }
  const findings = [];
  let scriptBytes = 0;
  for (const [index, page] of pages.entries()) {
    if (!existsSync(path.join(outDir, page.file))) {
      findings.push({ rule: "missing-page", message: `${page.file} does not exist` });
      continue;
    }
    const result = checkPage(outDir, page);
    const prefix = index === 0 ? "" : `${page.file}: `;
    for (const finding of result.findings) findings.push({ ...finding, message: prefix + finding.message });
    scriptBytes = Math.max(scriptBytes, result.bytes);
  }
  return { findings, scriptBytes };
}

function main(argv) {
  const outFlag = argv.indexOf("--out");
  const outDir = path.resolve(outFlag >= 0 && argv[outFlag + 1] ? argv[outFlag + 1] : "out");
  const { findings, scriptBytes } = checkSite(outDir);
  for (const finding of findings) console.log(`${finding.rule}: ${finding.message}`);
  if (findings.length > 0) return 1;
  console.log(`site-check: passed (${(scriptBytes / 1024).toFixed(1)} KB gzip JS)`);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
