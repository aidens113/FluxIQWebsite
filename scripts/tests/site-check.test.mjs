import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import {
  ALLOWED_HREFS,
  checkHtml,
  checkSite,
  MAX_SCRIPT_GZIP_BYTES,
  PAGES,
  REQUIRED_IDS,
  scriptSources,
} from "../site-check.mjs";

const TOOL = fileURLToPath(new URL("../site-check.mjs", import.meta.url));
const APP_SRC = "/_next/static/chunks/app.js";
const APP_JS = "console.log(1);\n";

// A page that passes every rule. It carries the traps a real Next export has:
// an inlined RSC payload, a comment, and a style body full of text that would
// fail the h1, anchor, and phrase rules if they were read as markup. It loads
// one script, APP_SRC; the comment holds a second whose file does not exist.
const PASSING = `<!DOCTYPE html><html lang="en" class="antialiased"><head><meta charSet="utf-8"/>
<script src="${APP_SRC}" async=""></script>
<title>FluxIQ — Automate Smarter</title>
<meta name="description" content="FluxIQ is a source-available TypeScript automation framework: AI generates and repairs your Flows, and deterministic replay runs them without a model."/>
<link rel="canonical" href="https://getfluxiq.com/"/>
<meta property="og:image" content="https://getfluxiq.com/opengraph-image.png?abc123"/>
<meta name="twitter:card" content="summary_large_image"/>
<style>.x::after{content:"<h1>Coming Soon</h1>"}</style>
</head><body>
<a href="#main">Skip to content</a>
<header><a href="/"><img src="/brand/fluxiq-logo.webp" alt="FluxIQ"/></a>
<nav><a href="#how-it-works">How it works</a><a href="#framework">Framework</a><a href="#vision">Vision</a>
<a href="#status">Status</a><a href="#why">Why</a><a href="/extension/">Extension</a></nav></header>
<main id="main"><h1 class="text-4xl">Automate smarter</h1>
<section id="how-it-works"><img src="/wave.svg" alt=""/><p>Record a Flow; the Router picks a Subflow; policies &amp; a policyholder are fine words; many models too.</p></section>
<section id="framework"><p>Reviewed adaptations, never silent ones.</p></section>
<section id="vision"><a href="https://github.com/aidens113/FluxIQ" target="_blank" rel="noopener noreferrer">Core</a>
<a href="https://github.com/aidens113/FluxIQWebExtension" target="_blank" rel="noreferrer noopener external">Extension</a></section>
<section id="status"><p>In progress</p></section>
<section id="why"><a href="https://github.com/aidens113/FluxIQ/blob/main/LICENSE.md">License</a>
<a href="mailto:license@getfluxiq.com">license@getfluxiq.com</a></section></main>
<footer><a href="https://getfluxiq.com/">FluxIQ</a><a href="https://x.com/GetFluxIQ" target="_blank" rel="noopener noreferrer">X</a></footer>
<!-- TODO: Coming Soon <h1>policy</h1> <a href="#nowhere"> <script src="/_next/static/chunks/gone.js"></script> -->
<script>self.__next_f.push([1,"<h1>Coming Soon</h1><a href=\\"https://example.com\\">policy</a>"])</script>
</body></html>
`;

// The extension page, passing on its own canonical URL and ids.
const EXTENSION_PASSING = PASSING.replace(
  '<link rel="canonical" href="https://getfluxiq.com/"/>',
  '<link rel="canonical" href="https://getfluxiq.com/extension/"/>',
).replace(
  '<section id="status">',
  '<section id="features"><a href="#setup">Setup</a></section><section id="setup"></section><section id="status">',
);

// Returns PASSING with each [from, to] replacement applied, failing the test
// if a replacement would silently match nothing.
function mutate(...replacements) {
  return replacements.reduce((html, [from, to]) => {
    assert.ok(html.includes(from), `fixture does not contain ${JSON.stringify(from)}`);
    return html.replace(from, to);
  }, PASSING);
}

function withSite(files, run) {
  const root = mkdtempSync(path.join(os.tmpdir(), "site-check-"));
  try {
    for (const [relative, content] of Object.entries(files)) {
      mkdirSync(path.dirname(path.join(root, relative)), { recursive: true });
      writeFileSync(path.join(root, relative), content);
    }
    return run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// An out directory named `dir` holding `html` as its index and the app script
// PASSING loads, so a fixture only fails the rule it was built to fail.
const siteFiles = (dir, html) => ({
  [`${dir}/index.html`]: html,
  [`${dir}/extension/index.html`]: EXTENSION_PASSING,
  [`${dir}${APP_SRC}`]: APP_JS,
});
const rulesOf = (findings) => findings.map((finding) => finding.rule).sort();
const runSite = (html, files = {}) =>
  withSite({ ...siteFiles("out", html), ...files }, (root) => checkSite(path.join(root, "out")));
const siteRules = (html, files = {}) => rulesOf(runSite(html, files).findings);

test("the passing fixture has no findings", () => {
  assert.deepEqual(siteRules(PASSING), []);
  assert.deepEqual(checkHtml(PASSING), []);
  assert.deepEqual(checkHtml(EXTENSION_PASSING, PAGES[1]), []);
});

test("each page is held to its own canonical URL and ids, and a missing page is reported", () => {
  const findings = checkHtml(PASSING, PAGES[1]);
  assert.deepEqual(rulesOf(findings), ["head-meta", "required-anchor", "required-anchor"]);
  withSite({ "out/index.html": PASSING, [`out${APP_SRC}`]: APP_JS }, (root) => {
    const result = checkSite(path.join(root, "out"));
    assert.deepEqual(rulesOf(result.findings), ["missing-page"]);
    assert.match(result.findings[0].message, /extension\/index\.html/);
  });
  withSite({ ...siteFiles("out", PASSING), "out/extension/index.html": PASSING }, (root) => {
    const messages = checkSite(path.join(root, "out")).findings.map((finding) => finding.message);
    assert.ok(messages.length > 0 && messages.every((message) => message.startsWith("extension/index.html: ")));
  });
});

test("the fixture exercises every allowlisted href and required id", () => {
  for (const href of ALLOWED_HREFS) assert.ok(PASSING.includes(`href="${href}"`), href);
  for (const id of REQUIRED_IDS) assert.ok(PASSING.includes(`id="${id}"`), id);
});

test("html-lang requires lang=en on the root element", () => {
  assert.deepEqual(siteRules(mutate(['<html lang="en"', '<html lang="de"'])), ["html-lang"]);
  assert.deepEqual(siteRules(mutate(['<html lang="en"', "<html"])), ["html-lang"]);
});

test("single-h1 fails on zero and on two h1 elements", () => {
  assert.deepEqual(siteRules(mutate(['<h1 class="text-4xl">Automate smarter</h1>', "<p>Automate smarter</p>"])), [
    "single-h1",
  ]);
  assert.deepEqual(siteRules(mutate(["<p>In progress</p>", "<h1>In progress</h1>"])), ["single-h1"]);
});

test("img-alt fails an img with no alt attribute, but not an empty one", () => {
  const findings = checkHtml(mutate(['alt="FluxIQ"/>', "/>"]));
  assert.deepEqual(rulesOf(findings), ["img-alt"]);
  assert.match(findings[0].message, /fluxiq-logo\.webp/);
});

test("anchor-target fails an in-page href with no matching id", () => {
  const findings = checkHtml(mutate(["<p>In progress</p>", '<a href="#faq">FAQ</a><a href="#">Top</a>']));
  assert.deepEqual(rulesOf(findings), ["anchor-target", "anchor-target"]);
  assert.match(findings[0].message, /href="#faq"/);
});

test("required-anchor fails when a navigation target is missing, even with no link to it", () => {
  const findings = checkHtml(mutate(['id="status"', 'id="plans"'], ['href="#status"', 'href="#plans"']));
  assert.deepEqual(rulesOf(findings), ["required-anchor"]);
  assert.match(findings[0].message, /id="status"/);
  assert.deepEqual(rulesOf(checkHtml(mutate(['<main id="main">', "<main>"]))), ["anchor-target", "required-anchor"]);
});

test("link-allowlist fails every href that is not on the list", () => {
  const html = mutate([
    "<p>In progress</p>",
    '<a href="https://example.com">x</a><a href="http://github.com/aidens113/FluxIQ">x</a><a href="/#framework">x</a><a href="https://getfluxiq.com">x</a>',
  ]);
  assert.deepEqual(siteRules(html), ["link-allowlist", "link-allowlist", "link-allowlist", "link-allowlist"]);
});

test("link-rel requires both noopener and noreferrer on target=_blank", () => {
  const missing = mutate(['target="_blank" rel="noopener noreferrer">Core', 'target="_blank">Core']);
  const partial = mutate(['target="_blank" rel="noopener noreferrer">Core', 'target="_BLANK" rel="noopener">Core']);
  assert.deepEqual(siteRules(missing), ["link-rel"]);
  assert.deepEqual(siteRules(partial), ["link-rel"]);
});

test("head-meta fails each missing or malformed head field", () => {
  const cases = {
    title: ["<title>FluxIQ — Automate Smarter</title>", ""],
    "empty title": ["<title>FluxIQ — Automate Smarter</title>", "<title> </title>"],
    description: ['<meta name="description"', '<meta name="summary"'],
    canonical: ['<link rel="canonical" href="https://getfluxiq.com/"/>', ""],
    "wrong canonical": ['href="https://getfluxiq.com/"/>', 'href="https://getfluxiq.com/index.html"/>'],
    "og:image": ['<meta property="og:image"', '<meta property="og:title"'],
    "relative og:image": [
      'content="https://getfluxiq.com/opengraph-image.png?abc123"',
      'content="/opengraph-image.png"',
    ],
    "twitter:card": ['<meta name="twitter:card" content="summary_large_image"/>', ""],
  };
  for (const [name, replacement] of Object.entries(cases)) {
    assert.deepEqual(rulesOf(checkHtml(mutate(replacement))), ["head-meta"], name);
  }
});

test("retired-phrase finds each phrase in visible text and meta content", () => {
  const html = mutate(
    [
      "<p>In progress</p>",
      "<p>Coming <em>Soon</em> is allowed. Our policy. Lorem ipsum. It patches the  Flow. ToDo.</p>",
    ],
    [
      "<p>Reviewed adaptations, never silent ones.</p>",
      "<p>It learns from your demonstrations with any model, under an execution grant of $2.</p>",
    ],
    ['content="summary_large_image"', 'content="Our policy"'],
  );
  const findings = checkHtml(html);
  const messages = findings.map((finding) => finding.message);
  assert.deepEqual(new Set(rulesOf(findings)), new Set(["retired-phrase"]));
  assert.equal(findings.length, 9);
  for (const phrase of [
    "policy",
    "lorem",
    "patches the flow",
    "todo",
    "learns from",
    "any model",
    "execution grant",
    "$2",
  ]) {
    assert.ok(
      messages.some((message) => message.startsWith(`"${phrase}`) && message.includes("visible text")),
      phrase,
    );
  }
  assert.ok(messages.some((message) => message.includes('<meta name="twitter:card"> content')));
});

// PASSING with the given elements added at the end of <head>.
const loading = (...elements) => mutate(["</head>", `${elements.join("")}</head>`]);

test("js-budget sums the gzip size of each script index.html loads, once per file", () => {
  const half = Math.ceil(MAX_SCRIPT_GZIP_BYTES / 2);
  const a = randomBytes(half - 4096);
  const files = {
    "out/_next/static/chunks/a.js": a,
    "out/_next/static/chunks/nested/b.js": randomBytes(half + 4096),
    "out/_next/static/chunks/unused.js": randomBytes(MAX_SCRIPT_GZIP_BYTES * 2),
  };
  // a.js is loaded twice, once relatively with a query string, and counts once;
  // unused.js is never loaded, so it does not count at all.
  const under = runSite(
    loading(
      '<script src="/_next/static/chunks/a.js"></script>',
      '<script src="_next/static/chunks/a.js?v=1"></script>',
    ),
    files,
  );
  assert.deepEqual(rulesOf(under.findings), []);
  assert.equal(under.scriptBytes, gzipSync(APP_JS).length + gzipSync(a).length);

  const over = runSite(
    loading(
      '<script src="/_next/static/chunks/a.js"></script>',
      '<script src="/_next/static/chunks/nested/b.js"></script>',
    ),
    files,
  );
  assert.deepEqual(rulesOf(over.findings), ["js-budget"]);
  assert.ok(over.scriptBytes > MAX_SCRIPT_GZIP_BYTES);
  assert.match(over.findings[0].message, /KB gzip of JavaScript loaded by index\.html, limit 200 KB/);
});

test("js-budget excludes nomodule scripts, which modern browsers never load", () => {
  const polyfill = { "out/_next/static/chunks/polyfills.js": randomBytes(MAX_SCRIPT_GZIP_BYTES * 2) };
  const legacy = loading('<script src="/_next/static/chunks/polyfills.js" noModule=""></script>');
  // The commented-out script in PASSING and its inline RSC scripts are left out too.
  assert.deepEqual(scriptSources(legacy), [APP_SRC]);
  const result = runSite(legacy, polyfill);
  assert.deepEqual(rulesOf(result.findings), []);
  assert.equal(result.scriptBytes, gzipSync(APP_JS).length);
  // The same script without nomodule is loaded, and breaks the budget.
  assert.deepEqual(siteRules(legacy.replace(' noModule=""', ""), polyfill), ["js-budget"]);
});

test("js-budget fails a loaded script that is missing or is not a file in the build", () => {
  const findings = runSite(
    loading(
      '<script src="/_next/static/chunks/gone.js"></script>',
      '<script src="https://cdn.example.com/x.js"></script>',
      '<script src="//cdn.example.com/y.js"></script>',
    ),
  ).findings;
  assert.deepEqual(rulesOf(findings), ["js-budget", "js-budget", "js-budget"]);
  assert.match(findings[0].message, /gone\.js.*refers to a missing file/);
  assert.match(findings[1].message, /cdn\.example\.com\/x\.js.*cannot be measured/);
  assert.match(findings[2].message, /cdn\.example\.com\/y\.js.*cannot be measured/);
});

test("missing-index reports an out directory with no index.html", () => {
  withSite({ "out/404.html": "" }, (root) => {
    assert.deepEqual(rulesOf(checkSite(path.join(root, "out")).findings), ["missing-index"]);
  });
});

test("the CLI exits 0 when clean, 1 with findings, and 1 when out/ is missing", () => {
  withSite(siteFiles("site", PASSING), (root) => {
    const result = spawnSync(process.execPath, [TOOL, "--out", path.join(root, "site")], { encoding: "utf8" });
    assert.equal(result.status, 0);
    assert.match(result.stdout, /^site-check: passed/m);
  });
  withSite(siteFiles("site", mutate(['<html lang="en"', "<html"])), (root) => {
    const result = spawnSync(process.execPath, [TOOL, "--out", path.join(root, "site")], { encoding: "utf8" });
    assert.equal(result.status, 1);
    assert.match(result.stdout, /^html-lang: <html> has no lang attribute/m);
    assert.doesNotMatch(result.stdout, /passed/);
  });
  withSite({ "README.md": "" }, (root) => {
    const result = spawnSync(process.execPath, [TOOL], { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 1);
    assert.match(result.stdout, /^missing-index: .*index\.html does not exist/m);
  });
});
