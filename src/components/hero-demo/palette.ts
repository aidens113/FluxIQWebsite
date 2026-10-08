// Colours of the example widgets. The example site is a light, generic web
// page; the panel uses the extension's dark side-panel tones. Amber is FluxIQ
// acting, blue FluxIQ reading or scanning, green success, red the person while
// recording or a step that broke.
import type { CardState, TargetKind } from "./scenes/scene";

export const KIND: Record<TargetKind, { color: string; glow: string; wash: string; pulse: string }> = {
  auto: { color: "#f5b83d", glow: "rgba(245,184,61,0.20)", wash: "rgba(245,184,61,0.06)", pulse: "demo-breathe 1.6s" },
  user: { color: "#fa6571", glow: "rgba(250,101,113,0.10)", wash: "transparent", pulse: "demo-userpulse 1.6s" },
  fail: { color: "#fa6571", glow: "rgba(250,101,113,0.18)", wash: "transparent", pulse: "demo-alarm 0.9s" },
  scan: { color: "#5e9eea", glow: "rgba(94,158,234,0.20)", wash: "rgba(94,158,234,0.08)", pulse: "demo-scan 1.6s" },
  done: { color: "#3bc982", glow: "rgba(59,201,130,0.18)", wash: "rgba(59,201,130,0.06)", pulse: "none" },
};

export const CARD: Record<CardState, { tone: string }> = {
  working: { tone: "#5e9eea" },
  done: { tone: "#3bc982" },
  failed: { tone: "#fa6571" },
  fixing: { tone: "#f5b94a" },
  captured: { tone: "#93a4b6" },
};

export const READ_BLUE = "#5e9eea";
export const RECORD_RED = "#fa6571";
