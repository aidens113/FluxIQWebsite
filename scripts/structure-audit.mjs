// Enforces the machine-checkable rules in AGENTS.md "Code Structure" for the
// authored source under src/ and scripts/, and the size budget for served
// assets under public/. Every finding fails; there is no baseline, because the
// repository started clean and must stay that way.
//
// Rules:
//   file-length      a source file stays within its area's line limit
//   directory-size   a directory holds at most 25 source files directly
//   banned-name      no file or directory is named utils, helpers, misc, or common
//   test-placement   a test file sits directly in a `tests/` directory
//   one-component    a .tsx file exports at most one component
//   shared-prefix    three or more files sharing a `noun-` prefix become `noun/`
//   asset-size       a file under public/ is at most 300 KB; masters live in design/
//
// Usage:  node scripts/structure-audit.mjs [--root <repo>]
//   Prints one line per finding and exits 1 if there are any, otherwise prints
//   `structure: passed (<n> files)` and exits 0.

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Line limits per top-level area. Components are held tighter than tooling.
export const AREAS = { src: 300, scripts: 500 };
export const MAX_DIRECTORY_FILES = 25;
export const BANNED_NAMES = ["utils", "helpers", "misc", "common"];
export const SOURCE_EXTENSIONS = [".ts", ".tsx", ".mts", ".js", ".mjs", ".css"];
export const MAX_ASSET_BYTES = 300 * 1024;

const SKIPPED_DIRECTORIES = new Set(["node_modules", ".next", "out"]);
const TEST_FILE = /\.test\.[cm]?[jt]sx?$/;
// An exported function or const whose name is PascalCase, which in a .tsx
// file is a component. `FEATURES`-style constants do not match.
const COMPONENT_EXPORT = /^export\s+(?:default\s+)?(?:function\s+|const\s+)[A-Z][a-z]\w*/gm;

function walk(directory, onDirectory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  onDirectory(
    directory,
    entries.filter((entry) => entry.isFile()).map((entry) => entry.name),
  );
  for (const entry of entries) {
    if (entry.isDirectory() && !SKIPPED_DIRECTORIES.has(entry.name))
      walk(path.join(directory, entry.name), onDirectory);
  }
}

function stem(fileName) {
  return path.basename(fileName, path.extname(fileName)).replace(/\.test$/, "");
}

function auditDirectory(root, directory, fileNames, lineLimit, findings) {
  const relativeDirectory = path.relative(root, directory).split(path.sep).join("/");
  const sources = fileNames.filter((name) => SOURCE_EXTENSIONS.includes(path.extname(name)));
  const nonTests = sources.filter((name) => !TEST_FILE.test(name));
  const report = (rule, target, message) => findings.push({ rule, path: target, message });

  if (BANNED_NAMES.includes(path.basename(directory))) {
    report("banned-name", relativeDirectory, "directory name says nothing about what it owns");
  }
  if (nonTests.length > MAX_DIRECTORY_FILES) {
    report("directory-size", relativeDirectory, `${nonTests.length} source files, limit ${MAX_DIRECTORY_FILES}`);
  }

  const prefixGroups = new Map();
  for (const name of nonTests) {
    const dash = stem(name).indexOf("-");
    if (dash > 0) {
      const prefix = stem(name).slice(0, dash);
      prefixGroups.set(prefix, (prefixGroups.get(prefix) ?? 0) + 1);
    }
  }
  for (const [prefix, count] of prefixGroups) {
    if (count >= 3) report("shared-prefix", relativeDirectory, `${count} files share "${prefix}-"; make it ${prefix}/`);
  }

  for (const name of sources) {
    const relativeFile = relativeDirectory ? `${relativeDirectory}/${name}` : name;
    const text = readFileSync(path.join(directory, name), "utf8");
    const lines = text.split("\n").length - (text.endsWith("\n") ? 1 : 0);

    if (BANNED_NAMES.includes(stem(name))) {
      report("banned-name", relativeFile, "file name says nothing about what it owns");
    }
    if (lines > lineLimit) report("file-length", relativeFile, `${lines} lines, limit ${lineLimit}`);
    if (TEST_FILE.test(name) && path.basename(directory) !== "tests") {
      report("test-placement", relativeFile, "test files live directly in a tests/ directory");
    }
    if (name.endsWith(".tsx") && !TEST_FILE.test(name)) {
      const components = text.match(COMPONENT_EXPORT)?.length ?? 0;
      if (components > 1) report("one-component", relativeFile, `${components} exported components, limit 1`);
    }
  }
}

export function audit(root) {
  const findings = [];
  let fileCount = 0;
  for (const [area, lineLimit] of Object.entries(AREAS)) {
    const areaRoot = path.join(root, area);
    try {
      walk(areaRoot, (directory, fileNames) => {
        fileCount += fileNames.length;
        auditDirectory(root, directory, fileNames, lineLimit, findings);
      });
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  try {
    walk(path.join(root, "public"), (directory, fileNames) => {
      fileCount += fileNames.length;
      for (const name of fileNames) {
        const bytes = statSync(path.join(directory, name)).size;
        if (bytes > MAX_ASSET_BYTES) {
          const relativeFile = path.relative(root, path.join(directory, name)).split(path.sep).join("/");
          findings.push({
            rule: "asset-size",
            path: relativeFile,
            message: `${Math.ceil(bytes / 1024)} KB, limit ${MAX_ASSET_BYTES / 1024} KB`,
          });
        }
      }
    });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  return { findings, fileCount };
}

function main(argv) {
  const rootFlag = argv.indexOf("--root");
  const root = path.resolve(rootFlag >= 0 ? argv[rootFlag + 1] : process.cwd());
  const { findings, fileCount } = audit(root);
  for (const finding of findings) console.log(`${finding.rule}: ${finding.path}: ${finding.message}`);
  if (findings.length > 0) return 1;
  console.log(`structure: passed (${fileCount} files)`);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
