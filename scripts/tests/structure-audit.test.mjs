import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { AREAS, audit, MAX_ASSET_BYTES, MAX_DIRECTORY_FILES } from "../structure-audit.mjs";

const TOOL = fileURLToPath(new URL("../structure-audit.mjs", import.meta.url));

function withRepo(files, run) {
  const root = mkdtempSync(path.join(os.tmpdir(), "structure-audit-"));
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

const rules = (root) => audit(root).findings.map((finding) => `${finding.rule}:${finding.path}`);
const lines = (count) => "x\n".repeat(count);

test("a clean tree has no findings", () => {
  withRepo(
    {
      "src/app/page.tsx": "export default function Home() {}\nexport const metadata = {};\n",
      "src/components/hero/hero.tsx": "export function Hero() {}\n",
      "src/components/hero/tests/hero.test.tsx": "export function Fixture() {}\nexport function Other() {}\n",
      "scripts/tool.mjs": "export const x = 1;\n",
    },
    (root) => assert.deepEqual(rules(root), []),
  );
});

test("file-length holds each area to its own limit", () => {
  withRepo(
    {
      "src/at-limit.ts": lines(AREAS.src),
      "src/over.ts": lines(AREAS.src + 1),
      "scripts/long-but-allowed.mjs": lines(AREAS.src + 1),
      "scripts/over.mjs": lines(AREAS.scripts + 1),
    },
    (root) => assert.deepEqual(rules(root).sort(), ["file-length:scripts/over.mjs", "file-length:src/over.ts"]),
  );
});

test("directory-size counts source files but not tests or assets", () => {
  const files = { "src/big/tests/a.test.ts": "", "src/big/icon.svg": "" };
  for (let i = 0; i < MAX_DIRECTORY_FILES; i++) files[`src/big/f${i}.ts`] = "";
  withRepo(files, (root) => assert.deepEqual(rules(root), []));
  files[`src/big/f${MAX_DIRECTORY_FILES}.ts`] = "";
  withRepo(files, (root) => assert.deepEqual(rules(root), ["directory-size:src/big"]));
});

test("banned-name catches files and directories", () => {
  withRepo({ "src/utils.ts": "", "src/helpers/format.ts": "" }, (root) =>
    assert.deepEqual(rules(root).sort(), ["banned-name:src/helpers", "banned-name:src/utils.ts"]),
  );
});

test("test-placement requires a tests/ directory", () => {
  withRepo({ "src/hero.test.tsx": "", "src/tests/nested/deep.test.ts": "" }, (root) =>
    assert.deepEqual(rules(root).sort(), [
      "test-placement:src/hero.test.tsx",
      "test-placement:src/tests/nested/deep.test.ts",
    ]),
  );
});

test("one-component counts PascalCase exports only", () => {
  withRepo(
    {
      "src/one.tsx": "export function Card() {}\nexport const FEATURES = [];\nexport const metadata = {};\n",
      "src/two.tsx": "export function Card() {}\nexport const Badge = () => null;\n",
    },
    (root) => assert.deepEqual(rules(root), ["one-component:src/two.tsx"]),
  );
});

test("shared-prefix fires at three files, ignoring the .test suffix", () => {
  withRepo({ "src/hero-title.tsx": "", "src/hero-body.tsx": "" }, (root) => assert.deepEqual(rules(root), []));
  withRepo({ "src/hero-title.tsx": "", "src/hero-body.tsx": "", "src/hero-cta.tsx": "" }, (root) =>
    assert.deepEqual(rules(root), ["shared-prefix:src"]),
  );
});

test("asset-size fails a served file over the budget, but not a design master", () => {
  withRepo(
    {
      "public/ok.webp": "x".repeat(MAX_ASSET_BYTES),
      "public/brand/huge.png": "x".repeat(MAX_ASSET_BYTES + 1),
      "design/brand/master.png": "x".repeat(MAX_ASSET_BYTES * 4),
    },
    (root) => assert.deepEqual(rules(root), ["asset-size:public/brand/huge.png"]),
  );
});

test("node_modules, .next, and out are skipped", () => {
  withRepo({ "src/node_modules/utils.ts": "", "src/.next/utils.ts": "", "src/out/utils.ts": "" }, (root) =>
    assert.deepEqual(rules(root), []),
  );
});

test("the CLI exits 1 with findings and 0 when clean", () => {
  withRepo({ "src/utils.ts": "" }, (root) => {
    const result = spawnSync(process.execPath, [TOOL, "--root", root], { encoding: "utf8" });
    assert.equal(result.status, 1);
    assert.match(result.stdout, /^banned-name: src\/utils\.ts: /m);
  });
  withRepo({ "src/page.tsx": "" }, (root) => {
    const result = spawnSync(process.execPath, [TOOL, "--root", root], { encoding: "utf8" });
    assert.equal(result.status, 0);
    assert.match(result.stdout, /structure: passed \(1 files\)/);
  });
});
