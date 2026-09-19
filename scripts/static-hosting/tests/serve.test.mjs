import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import { CACHE_DEFAULT, CACHE_IMMUTABLE, CACHE_REVALIDATE, SECURITY_HEADERS } from "../policy.mjs";
import { acceptsGzip, createStaticServer, DEFAULT_DIRECTORY, DEFAULT_PORT, parsePort, stopServer } from "../serve.mjs";
import { APP_JS, INDEX_HTML, NOT_FOUND_HTML, SECRET, SITE_FILES, withSite } from "./site-fixture.mjs";

const TOOL = fileURLToPath(new URL("../start.mjs", import.meta.url));
const REPOSITORY_ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const DECOY = "decoy-out-in-the-working-directory";

// Sends one request with the target exactly as given (fetch would normalize
// "/../x" away) and resolves { status, headers, body }.
function request(port, target, { method = "GET", headers = {}, agent = false } = {}) {
  return new Promise((resolve, reject) => {
    const outgoing = http.request({ host: "127.0.0.1", port, path: target, method, headers, agent }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () =>
        resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks) }),
      );
    });
    outgoing.on("error", reject);
    outgoing.end();
  });
}

async function withServer(files, run) {
  await withSite(files, async (fixture) => {
    const server = createStaticServer(fixture.site);
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    try {
      await run({ ...fixture, port: server.address().port });
    } finally {
      await stopServer(server, 1000);
    }
  });
}

function assertPolicyHeaders(response, label) {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    assert.equal(response.headers[name.toLowerCase()], value, `${label}: ${name}`);
  }
}

test("/ serves index.html with every policy header, the CSP, and validators", async () => {
  await withServer(SITE_FILES, async ({ port }) => {
    const response = await request(port, "/");
    assert.equal(response.status, 200);
    assertPolicyHeaders(response, "/");
    assert.equal(response.headers["content-type"], "text/html; charset=utf-8");
    assert.equal(response.headers["cache-control"], CACHE_REVALIDATE);
    assert.equal(response.headers["content-length"], String(Buffer.byteLength(INDEX_HTML)));
    assert.equal(response.headers.vary, "Accept-Encoding");
    assert.equal(response.headers["content-encoding"], undefined);
    assert.match(response.headers.etag, /^W\/"[0-9a-f]+-[0-9a-f]+"$/);
    assert.ok(response.headers["last-modified"]);
    assert.equal(response.body.toString(), INDEX_HTML);
  });
});

test("a missing path answers 404 with the 404.html body and the policy headers", async () => {
  await withServer(SITE_FILES, async ({ port }) => {
    for (const target of ["/nope", "/nope/", "/docs/index.html/", "/brand/", "/brand", "/docs/missing.png"]) {
      const response = await request(port, target);
      assert.equal(response.status, 404, target);
      assertPolicyHeaders(response, target);
      assert.equal(response.headers["content-type"], "text/html; charset=utf-8", target);
      assert.equal(response.headers["cache-control"], CACHE_REVALIDATE, target);
      assert.equal(response.body.toString(), NOT_FOUND_HTML, target);
    }
  });
});

test("a site without 404.html still answers 404 in plain text", async () => {
  await withServer({ "index.html": INDEX_HTML }, async ({ port }) => {
    const response = await request(port, "/nope");
    assert.equal(response.status, 404);
    assertPolicyHeaders(response, "/nope");
    assert.equal(response.body.toString(), "Not Found\n");
  });
});

test("path traversal, encoded or not, and null bytes are rejected", async () => {
  await withServer(SITE_FILES, async ({ port }) => {
    for (const target of [
      "/../package.json",
      "/docs/../../package.json",
      "/%2e%2e/package.json",
      "/%2E%2E/package.json",
      "/.%2e/package.json",
      "/docs/..%2f..%2fpackage.json",
      "/..%5cpackage.json",
      "/%2e%2e%5cpackage.json",
      "/index.html%00",
      "/index.html%00.png",
      "/./index.html",
      "//404",
      "/index.html.",
      "/index.html%20",
      "/C:/Windows/win.ini",
      "/%E0%A4%A",
      "http://127.0.0.1/index.html",
    ]) {
      const response = await request(port, target);
      assert.equal(response.status, 400, target);
      assertPolicyHeaders(response, target);
      assert.ok(!response.body.toString().includes(SECRET), `${target} leaks nothing`);
    }
  });
});

test("host configuration files are not served", async () => {
  await withServer(SITE_FILES, async ({ port, site }) => {
    writeFileSync(path.join(site, ".htaccess"), "Options -Indexes\n");
    writeFileSync(path.join(site, "_headers"), "/*\n  X-Test: 1\n");
    for (const target of ["/.htaccess", "/_headers", "/_HEADERS", "/docs/.env"]) {
      const response = await request(port, target);
      assert.equal(response.status, 404, target);
      assert.equal(response.body.toString(), NOT_FOUND_HTML, target);
    }
  });
});

test("methods other than GET and HEAD answer 405", async () => {
  await withServer(SITE_FILES, async ({ port }) => {
    for (const method of ["POST", "PUT", "DELETE", "PATCH", "OPTIONS"]) {
      const response = await request(port, "/", { method });
      assert.equal(response.status, 405, method);
      assert.equal(response.headers.allow, "GET, HEAD", method);
      assertPolicyHeaders(response, method);
    }
  });
});

test("HEAD sends the GET headers and no body", async () => {
  await withServer(SITE_FILES, async ({ port }) => {
    const get = await request(port, "/_next/static/chunks/app.js");
    const head = await request(port, "/_next/static/chunks/app.js", { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(head.body.length, 0);
    for (const name of ["content-type", "content-length", "cache-control", "etag", "content-security-policy"]) {
      assert.equal(head.headers[name], get.headers[name], name);
    }
  });
});

test("compressible types are gzipped only when the client accepts gzip", async () => {
  await withServer(SITE_FILES, async ({ port }) => {
    const gzipped = await request(port, "/_next/static/chunks/app.js", {
      headers: { "Accept-Encoding": "br;q=1, gzip;q=0.8, deflate" },
    });
    assert.equal(gzipped.headers["content-encoding"], "gzip");
    assert.equal(gzipped.headers.vary, "Accept-Encoding");
    assert.equal(gzipped.headers["content-length"], undefined);
    assert.ok(gzipped.body.length < Buffer.byteLength(APP_JS));
    assert.equal(gunzipSync(gzipped.body).toString(), APP_JS);

    const refused = await request(port, "/_next/static/chunks/app.js", { headers: { "Accept-Encoding": "gzip;q=0" } });
    assert.equal(refused.headers["content-encoding"], undefined);
    assert.equal(refused.body.toString(), APP_JS);

    const image = await request(port, "/icon.png", { headers: { "Accept-Encoding": "gzip" } });
    assert.equal(image.headers["content-encoding"], undefined);
    assert.equal(image.headers.vary, undefined);

    const notFound = await request(port, "/nope", { headers: { "Accept-Encoding": "gzip" } });
    assert.equal(notFound.status, 404);
    assert.equal(gunzipSync(notFound.body).toString(), NOT_FOUND_HTML);
  });
});

test("each file gets its cache rule: immutable _next/static, revalidated documents, a day for the rest", async () => {
  await withServer(SITE_FILES, async ({ port }) => {
    const expected = {
      "/_next/static/chunks/app.js": [CACHE_IMMUTABLE, "text/javascript; charset=utf-8"],
      "/_next/static/chunks/app.css": [CACHE_IMMUTABLE, "text/css; charset=utf-8"],
      "/_next/static/media/font.woff2": [CACHE_IMMUTABLE, "font/woff2"],
      "/docs/": [CACHE_REVALIDATE, "text/html; charset=utf-8"],
      "/index.txt": [CACHE_REVALIDATE, "text/plain; charset=utf-8"],
      "/sitemap.xml": [CACHE_REVALIDATE, "application/xml; charset=utf-8"],
      "/brand/logo.webp": [CACHE_DEFAULT, "image/webp"],
      "/favicon.ico": [CACHE_DEFAULT, "image/x-icon"],
    };
    for (const [target, [cacheControl, contentType]] of Object.entries(expected)) {
      const response = await request(port, target);
      assert.equal(response.status, 200, target);
      assert.equal(response.headers["cache-control"], cacheControl, target);
      assert.equal(response.headers["content-type"], contentType, target);
      assertPolicyHeaders(response, target);
    }
  });
});

test("a directory URL without its slash redirects with 308, keeping the query", async () => {
  await withServer(SITE_FILES, async ({ port }) => {
    const cases = { "/docs": "/docs/", "/docs?ref=nav": "/docs/?ref=nav", "/404": "/404/" };
    for (const [target, location] of Object.entries(cases)) {
      const response = await request(port, target);
      assert.equal(response.status, 308, target);
      assert.equal(response.headers.location, location, target);
      assertPolicyHeaders(response, target);
    }
    const page = await request(port, "/docs/");
    assert.equal(page.status, 200);
    assert.match(page.body.toString(), /<h1>Docs<\/h1>/);
  });
});

test("a matching ETag or an unchanged date answers 304", async () => {
  await withServer(SITE_FILES, async ({ port }) => {
    const first = await request(port, "/");
    const byTag = await request(port, "/", { headers: { "If-None-Match": first.headers.etag } });
    assert.equal(byTag.status, 304);
    assert.equal(byTag.body.length, 0);
    assert.equal(byTag.headers.etag, first.headers.etag);
    assertPolicyHeaders(byTag, "304");
    const byDate = await request(port, "/", { headers: { "If-Modified-Since": first.headers["last-modified"] } });
    assert.equal(byDate.status, 304);
    const stale = await request(port, "/", { headers: { "If-None-Match": 'W/"other"' } });
    assert.equal(stale.status, 200);
  });
});

test("Accept-Encoding parsing honours q-values and the wildcard", () => {
  assert.ok(acceptsGzip("gzip"));
  assert.ok(acceptsGzip("deflate, GZIP;q=0.5"));
  assert.ok(acceptsGzip("*"));
  assert.ok(!acceptsGzip("gzip;q=0"));
  assert.ok(!acceptsGzip("gzip;q=0.0, *;q=1"));
  assert.ok(!acceptsGzip("br, deflate"));
  assert.ok(!acceptsGzip(undefined));
});

test("PORT defaults to 3000 and must be a port number", () => {
  assert.equal(parsePort(undefined), DEFAULT_PORT);
  assert.equal(parsePort(""), DEFAULT_PORT);
  assert.equal(parsePort("8080"), 8080);
  assert.equal(parsePort("0"), 0);
  assert.equal(parsePort("70000"), null);
  assert.equal(parsePort("80a"), null);
  assert.equal(parsePort("-1"), null);
});

test("stopping closes idle keep-alive connections at once", async () => {
  await withSite(SITE_FILES, async ({ site }) => {
    const server = createStaticServer(site);
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const agent = new http.Agent({ keepAlive: true });
    try {
      const response = await request(server.address().port, "/", { agent });
      assert.equal(response.status, 200);
      const started = Date.now();
      await stopServer(server, 5000);
      assert.ok(Date.now() - started < 2000, "did not wait for the grace period");
    } finally {
      agent.destroy();
    }
  });
});

test("the command line refuses a missing directory or a bad PORT", async () => {
  await withSite(SITE_FILES, ({ root, site }) => {
    const missing = spawnSync(process.execPath, [TOOL, "--dir", path.join(root, "nope")], { encoding: "utf8" });
    assert.equal(missing.status, 1);
    assert.match(missing.stderr, /^serve: .*nope does not exist; run pnpm build first/);
    const badPort = spawnSync(process.execPath, [TOOL, "--dir", site], {
      encoding: "utf8",
      env: { ...process.env, PORT: "http" },
    });
    assert.equal(badPort.status, 1);
    assert.match(badPort.stderr, /PORT "http" is not a port number/);
  });
});

// Starts the command line on a free port. Resolves when it prints its startup
// line, with the directory it names, or when it exits first, with its code.
function launch(args, cwd) {
  const child = spawn(process.execPath, [TOOL, ...args], {
    cwd,
    env: { ...process.env, PORT: "0", HOST: "127.0.0.1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const exited = new Promise((resolve) => child.on("exit", (code, signal) => resolve({ code, signal })));
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });
  return new Promise((resolve) => {
    const result = { child, exited, output: () => stdout, errors: () => stderr };
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
      const match = stdout.match(/^serve: (.+) on http:\/\/127\.0\.0\.1:(\d+)\n/);
      if (match) resolve({ ...result, directory: match[1], port: Number(match[2]) });
    });
    exited.then(({ code }) => resolve({ ...result, code, port: null }));
  });
}

test("the command line prints one startup line, serves, and closes on a signal", async () => {
  await withSite(SITE_FILES, async ({ site }) => {
    const server = await launch(["--dir", site]);
    try {
      assert.ok(server.port, `listening: ${server.errors()}`);
      assert.equal(server.output().split("\n").filter(Boolean).length, 1, "one startup line");
      const response = await request(server.port, "/");
      assert.equal(response.status, 200);
      assertPolicyHeaders(response, "cli");
      server.child.kill("SIGTERM");
      const { code, signal } = await server.exited;
      // Windows cannot deliver SIGTERM to a handler; the process is killed.
      if (process.platform !== "win32") {
        assert.equal(code, 0, server.output());
        assert.match(server.output(), /serve: SIGTERM, closing\nserve: closed\n/);
      } else {
        assert.ok(code !== null || signal !== null);
      }
    } finally {
      // Windows keeps the working directory locked until the child is gone.
      server.child.kill("SIGKILL");
      await server.exited;
    }
  });
});

test("with no --dir it serves out/ at the repository root, whatever the working directory", async () => {
  const expected = path.join(REPOSITORY_ROOT, "out");
  assert.equal(DEFAULT_DIRECTORY, expected);
  await withSite(SITE_FILES, async ({ root }) => {
    // A decoy out/ in the working directory, which the server must ignore.
    mkdirSync(path.join(root, "out"));
    writeFileSync(path.join(root, "out", "index.html"), DECOY);
    const server = await launch([], root);
    try {
      if (server.port === null) {
        // The repository has not been built: the error names its out/.
        assert.equal(server.code, 1);
        assert.ok(server.errors().includes(`serve: ${expected} does not exist`), server.errors());
        return;
      }
      assert.equal(server.directory, expected);
      const response = await request(server.port, "/");
      assert.ok(!response.body.toString().includes(DECOY), "the working directory's out/ is not served");
      assertPolicyHeaders(response, "repository out/");
    } finally {
      // Windows keeps the working directory locked until the child is gone.
      server.child.kill("SIGKILL");
      await server.exited;
    }
  });
});

test("a --dir value resolves against the working directory", async () => {
  await withSite(SITE_FILES, async ({ root, site }) => {
    const server = await launch(["--dir", "site"], root);
    try {
      assert.ok(server.port, `listening: ${server.errors()}`);
      assert.equal(server.directory, site);
      const response = await request(server.port, "/");
      assert.equal(response.body.toString(), INDEX_HTML);
    } finally {
      // Windows keeps the working directory locked until the child is gone.
      server.child.kill("SIGKILL");
      await server.exited;
    }
  });
});
