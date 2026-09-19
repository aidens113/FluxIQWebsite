// Serves the built static export with the headers in policy.mjs. It is what
// `pnpm start` runs, so the repository is a plain Node app for hosts that
// install, build, and start (Hostinger web apps, Render, Railway), and it is
// the Docker image's runtime. It has no dependencies.
//
// Behaviour:
//   - GET and HEAD only; any other method gets 405 with `Allow: GET, HEAD`.
//   - A target that is malformed, or holds (encoded or not) a null byte, a
//     backslash, a colon, a percent-encoded "/", an empty segment, or a
//     segment ending in a dot or a space, gets 400. The last rule covers "."
//     and "..", and the names Windows silently trims, so no request can name
//     a file outside the directory or reach one under a second name.
//   - Hidden files (".htaccess") and the root `_headers` are host
//     configuration and answer 404.
//   - A directory URL serves its index.html. `/x` answers 308 to `/x/` when
//     `x/index.html` exists, matching `trailingSlash: true` in next.config.ts.
//   - Anything else missing answers 404 with the body of 404.html.
//   - Every response carries the policy's security headers and a
//     Cache-Control from `cacheControlFor`. Compressible types carry
//     `Vary: Accept-Encoding` and are gzipped when the client accepts gzip.
//   - Files carry a weak ETag and Last-Modified, and a matching
//     If-None-Match or If-Modified-Since answers 304.
//
// Usage:  node scripts/static-hosting/serve.mjs [--dir <dir>]
//   <dir> defaults to `out` at the repository root, found from this file, so
//   the server serves the right directory whatever the working directory (a
//   host's entry-file mode, a Docker WORKDIR). A --dir value resolves against
//   the working directory. Listens on PORT (default 3000) and HOST (default
//   0.0.0.0), prints one startup line, and closes cleanly on SIGTERM and
//   SIGINT. Exits 1 if <dir> does not exist or PORT is not a port number.

import { createReadStream, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { pipeline } from "node:stream";
import { fileURLToPath } from "node:url";
import { createGzip } from "node:zlib";
import { CACHE_REVALIDATE, cacheControlFor, contentTypeFor, isCompressible, SECURITY_HEADERS } from "./policy.mjs";

export const DEFAULT_PORT = 3000;
export const DEFAULT_HOST = "0.0.0.0";
export const ALLOWED_METHODS = ["GET", "HEAD"];
export const SHUTDOWN_GRACE_MS = 10_000;
export const DEFAULT_DIRECTORY = fileURLToPath(new URL("../../out", import.meta.url));

const UNSAFE_NAME = /[\0\\/:]|[. ]$/;
// A query string is echoed into a redirect only when it is plain printable
// ASCII, so a Location header can never carry a control character.
const SAFE_QUERY = /^\?[\x21-\x7e]*$/;

function statOrNull(file) {
  try {
    return statSync(file);
  } catch {
    return null;
  }
}

// Pure apart from stat calls: what a request target names under root.
//   { status: 200, file, urlPath }   serve file; urlPath picks the cache rule
//   { status: 308, location }        add the trailing slash
//   { status: 400 }                  unsafe or malformed target
//   { status: 404 }                  nothing to serve
export function resolveTarget(root, target) {
  const raw = String(target ?? "");
  if (!raw.startsWith("/")) return { status: 400 };
  const cut = raw.search(/[?#]/);
  const pathname = cut === -1 ? raw : raw.slice(0, cut);
  const query = cut === -1 ? "" : raw.slice(cut).split("#", 1)[0];

  let segments;
  try {
    segments = pathname.slice(1).split("/").map(decodeURIComponent);
  } catch {
    return { status: 400 };
  }
  const trailingSlash = segments.at(-1) === "";
  const names = trailingSlash ? segments.slice(0, -1) : segments;
  if (names.some((name) => name === "" || UNSAFE_NAME.test(name))) return { status: 400 };
  if (names.some((name) => name.startsWith(".")) || (names.length === 1 && names[0].toLowerCase() === "_headers")) {
    return { status: 404 };
  }

  const location = path.join(root, ...names);
  const relative = path.relative(root, location);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return { status: 400 };

  const urlPath = `/${names.join("/")}`;
  const stats = statOrNull(location);
  if (stats?.isFile()) return trailingSlash ? { status: 404 } : { status: 200, file: location, urlPath };
  if (!stats?.isDirectory()) return { status: 404 };

  const index = path.join(location, "index.html");
  if (!statOrNull(index)?.isFile()) return { status: 404 };
  if (!trailingSlash) {
    const encoded = `/${names.map(encodeURIComponent).join("/")}/`;
    return { status: 308, location: `${encoded}${SAFE_QUERY.test(query) ? query : ""}` };
  }
  return { status: 200, file: index, urlPath: names.length > 0 ? `${urlPath}/` : "/" };
}

// Whether an Accept-Encoding value allows gzip: named with a nonzero q, or
// covered by a nonzero "*" and not refused by name.
export function acceptsGzip(header) {
  let wildcard = false;
  for (const part of String(header ?? "").split(",")) {
    const [coding, ...parameters] = part.split(";").map((piece) => piece.trim().toLowerCase());
    const q = parameters.find((parameter) => parameter.startsWith("q="));
    const weight = q === undefined ? 1 : Number(q.slice(2));
    const allowed = Number.isFinite(weight) && weight > 0;
    if (coding === "gzip" || coding === "x-gzip") return allowed;
    if (coding === "*") wildcard = allowed;
  }
  return wildcard;
}

const etagFor = (stats) => `W/"${stats.size.toString(16)}-${Math.floor(stats.mtimeMs).toString(16)}"`;

function isFresh(request, etag, stats) {
  const noneMatch = request.headers["if-none-match"];
  if (noneMatch !== undefined) {
    const tags = noneMatch.split(",").map((tag) => tag.trim().replace(/^W\//, ""));
    return tags.includes("*") || tags.includes(etag.replace(/^W\//, ""));
  }
  const since = Date.parse(request.headers["if-modified-since"] ?? "");
  return Number.isFinite(since) && Math.floor(stats.mtimeMs / 1000) * 1000 <= since;
}

function sendText(request, response, status, text, headers = {}) {
  const body = Buffer.from(`${text}\n`);
  response.writeHead(status, {
    ...SECURITY_HEADERS,
    "Cache-Control": CACHE_REVALIDATE,
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": body.length,
    ...headers,
  });
  response.end(request.method === "HEAD" ? undefined : body);
}

function sendFile(request, response, status, file, urlPath, stats) {
  const contentType = contentTypeFor(file);
  const compressible = isCompressible(contentType);
  const etag = etagFor(stats);
  const headers = {
    ...SECURITY_HEADERS,
    "Cache-Control": cacheControlFor(urlPath),
    ETag: etag,
    "Last-Modified": stats.mtime.toUTCString(),
    ...(compressible ? { Vary: "Accept-Encoding" } : {}),
  };
  if (status === 200 && isFresh(request, etag, stats)) {
    response.writeHead(304, headers);
    response.end();
    return;
  }
  const gzip = compressible && acceptsGzip(request.headers["accept-encoding"]);
  headers["Content-Type"] = contentType;
  if (gzip) headers["Content-Encoding"] = "gzip";
  else headers["Content-Length"] = stats.size;
  response.writeHead(status, headers);
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  const streams = gzip ? [createReadStream(file), createGzip(), response] : [createReadStream(file), response];
  // A failed read or a client that hangs up destroys the response; there is
  // nothing left to send, so the error needs no further handling.
  pipeline(...streams, () => {});
}

function sendNotFound(request, response, root) {
  const page = path.join(root, "404.html");
  const stats = statOrNull(page);
  if (stats?.isFile()) sendFile(request, response, 404, page, "/404.html", stats);
  else sendText(request, response, 404, "Not Found");
}

function handle(root, request, response) {
  if (!ALLOWED_METHODS.includes(request.method)) {
    sendText(request, response, 405, "Method Not Allowed", { Allow: ALLOWED_METHODS.join(", ") });
    return;
  }
  const target = resolveTarget(root, request.url);
  if (target.status === 200) {
    const stats = statOrNull(target.file);
    if (stats?.isFile()) sendFile(request, response, 200, target.file, target.urlPath, stats);
    else sendNotFound(request, response, root);
  } else if (target.status === 308) {
    sendText(request, response, 308, `Permanent Redirect: ${target.location}`, { Location: target.location });
  } else if (target.status === 404) {
    sendNotFound(request, response, root);
  } else {
    sendText(request, response, 400, "Bad Request");
  }
}

export function createStaticServer(directory) {
  const root = path.resolve(directory);
  return http.createServer((request, response) => {
    try {
      handle(root, request, response);
    } catch {
      if (!response.headersSent) sendText(request, response, 500, "Internal Server Error");
      else response.destroy();
    }
  });
}

// Stops accepting connections, closes idle keep-alive sockets at once, and
// cuts any request still running after graceMs. Resolves when closed.
// A response that finishes just after close() leaves its keep-alive socket
// idle, and it would otherwise hold the server open until keepAliveTimeout,
// so idle sockets are swept until the server has closed.
export function stopServer(server, graceMs = SHUTDOWN_GRACE_MS) {
  return new Promise((resolve) => {
    const sweep = setInterval(() => server.closeIdleConnections(), 50);
    const force = setTimeout(() => server.closeAllConnections(), graceMs);
    sweep.unref();
    force.unref();
    server.close(() => {
      clearInterval(sweep);
      clearTimeout(force);
      resolve();
    });
    server.closeIdleConnections();
  });
}

export function parsePort(value) {
  if (value === undefined || value === "") return DEFAULT_PORT;
  const port = Number(value);
  return /^\d+$/.test(value) && port <= 65535 ? port : null;
}

function main(argv, environment) {
  const dirFlag = argv.indexOf("--dir");
  const root = path.resolve(dirFlag >= 0 && argv[dirFlag + 1] ? argv[dirFlag + 1] : DEFAULT_DIRECTORY);
  if (!statOrNull(root)?.isDirectory()) {
    console.error(`serve: ${root} does not exist; run pnpm build first`);
    return 1;
  }
  const port = parsePort(environment.PORT);
  if (port === null) {
    console.error(`serve: PORT "${environment.PORT}" is not a port number`);
    return 1;
  }
  const host = environment.HOST || DEFAULT_HOST;
  const server = createStaticServer(root);
  server.on("error", (error) => {
    console.error(`serve: ${error.message}`);
    process.exitCode = 1;
  });
  server.listen(port, host, () => {
    const shown = host.includes(":") ? `[${host}]` : host;
    console.log(`serve: ${root} on http://${shown}:${server.address().port}`);
  });
  const shutdown = (signal) => {
    console.log(`serve: ${signal}, closing`);
    stopServer(server).then(() => console.log("serve: closed"));
  };
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2), process.env);
}
