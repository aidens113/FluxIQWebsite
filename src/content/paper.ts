import { LINKS } from "./links";
import type { PaperContent } from "./types";

// The FluxIQ Technical Vision & Architecture draft v0.9 (October 2026), served
// from public/papers/. The headings below are its own sections; the quote is
// its cover line. Its document properties were corrected for publishing
// (title v0.9, author FluxIQ); the pages are unchanged. See site-v2.md.
export const PAPER: PaperContent = {
  id: "paper",
  title: "Technical Vision & Architecture",
  edition: "Draft v0.9 · October 2026",
  format: "PDF · 12 pages · 160 KB",
  eyebrow: "Read the paper",
  heading: "The thinking behind FluxIQ, in twelve pages.",
  summary:
    "How FluxIQ moves work from probabilistic reasoning into reusable, deterministic software, what exists in the code today, and where it goes from here.",
  contents: [
    "The core thesis: stop paying for reasoning you already did",
    "What exists today, labelled conservatively",
    "The architecture, from intent to adaptation",
    "Verification that relaxes as confidence grows",
    "The economics of intelligence",
    "From Flows to generated applications, and the roadmap",
  ],
  quote: "Reason when needed. Preserve what works.",
  link: LINKS.paper,
  cover: {
    src: "/papers/fluxiq-technical-vision-v0.9-cover.webp",
    width: 640,
    height: 828,
    alt: "Cover of the FluxIQ Technical Vision & Architecture paper, draft v0.9.",
  },
  banner: { tag: "New", text: "Technical Vision & Architecture, draft v0.9", cta: "Read the paper" },
};
