import { LINKS } from "./links";
import type { DevelopersContent } from "./types";

// Both TypeScript samples type-check against FluxIQ Core 80a8495
// (packages/fluxiq/src) and run against its build; see the content report.
const SETUP_SAMPLE = `import { FluxIQ } from "fluxiq";

// Paths resolve from rootDir.
const fluxiq = FluxIQ.create({ rootDir: process.cwd() });

// A fresh setup writes only .fluxiq/config.json.
// Databases, logs, and caches are created on first use.
await fluxiq.setup();`;

const FLOW_SAMPLE = `import { compileFlowDefinition, defineFlow } from "fluxiq/automation-studio/dsl";

const flow = defineFlow({
  flowId: "flow.hello",
  name: "Hello",
  nodes: [
    { id: "start", definitionId: "builtin.control.start" },
    { id: "done", definitionId: "builtin.control.end" },
  ],
  edges: [{
    id: "start-done",
    sourceNodeId: "start", sourcePortId: "next",
    targetNodeId: "done", targetPortId: "in",
  }],
});

// Deterministic: the same definition gives the same digest.
const result = compileFlowDefinition(flow, { projectId: "demo" });
if (result.ok) console.log(result.plan.digest); // "sha256:…"
else console.error(result.diagnostics);`;

// `dev` is where the audited code lives (Core 80a8495); GitHub's default
// branch, `main`, was still at fluxiq 0.1.0 on 2026-09-18.
const BUILD_SAMPLE = `git clone --branch dev https://github.com/aidens113/FluxIQ.git
cd FluxIQ
pnpm install
pnpm build`;

export const DEVELOPERS: DevelopersContent = {
  id: "developers",
  eyebrow: "Developers",
  title: "Import it. Write Flows in TypeScript.",
  lede: "FluxIQ is a library you import into your own Node project. Flows are plain data you can write by hand, and they compile deterministically to a plan with a SHA-256 digest.",
  release: "npm release pending — build from source today",
  requirements: ["Node 22+", "Native ESM"],
  packages: [
    { name: "fluxiq", version: "0.6.0", summary: "The domain-neutral framework runtime for Node.js." },
    {
      name: "@fluxiq/contracts",
      version: "0.2.0",
      summary: "Browser-safe shared contracts, including the closed failure vocabulary.",
    },
    {
      name: "@fluxiq/client-gateway-websocket",
      version: "0.1.0",
      summary: "A browser-safe WebSocket client for the Client Gateway.",
    },
  ],
  samples: [
    {
      id: "setup",
      title: "Create and set up",
      filename: "setup.ts",
      language: "ts",
      code: SETUP_SAMPLE,
      caption: "Run setup once at install or startup. A fresh project gets one file; the rest is created on first use.",
    },
    {
      id: "define-flow",
      title: "Define and compile a Flow",
      filename: "compile-flow.ts",
      language: "ts",
      code: FLOW_SAMPLE,
      caption:
        "defineFlow takes plain data, never callbacks. The compiler checks it against the node registry and returns a plan with a SHA-256 digest.",
    },
  ],
  build: {
    id: "build",
    title: "Build from source",
    filename: "terminal",
    language: "sh",
    code: BUILD_SAMPLE,
    caption:
      "Current work lands on the dev branch. This builds the three packages and the Next.js control panel; it needs Node 22+ and pnpm.",
  },
  action: { ...LINKS.coreRepo, label: "Read the source", variant: "primary", icon: "github" },
};
