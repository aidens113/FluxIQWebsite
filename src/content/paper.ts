import { LINKS } from "./links";
import type { HomeSectionId, SiteLink } from "./types";

/** An image served from public/, with its intrinsic size. */
export type PaperImage = { src: string; width: number; height: number; alt: string };

/** One of the paper's sections, shown with the page that opens it. */
export type PaperSection = {
  /** The paper's own section number, such as "02". */
  num: string;
  title: string;
  /** The PDF page this section's image shows. */
  page: number;
  image: PaperImage;
};

export type PaperContent = {
  id: HomeSectionId;
  title: string;
  /** Draft status and date, shown beside the title. */
  edition: string;
  /** Format, length, and size, shown on the download link. */
  format: string;
  /** The page count, used in the "page N of 12" label. */
  pageCount: number;
  /** The label shown under the stack while the cover is up. */
  coverLabel: string;
  eyebrow: string;
  /** The heading's lead, then the muted end. */
  heading: { lead: string; muted: string };
  /** What the paper covers, one line each, in order. */
  sections: readonly PaperSection[];
  link: SiteLink;
  cover: PaperImage;
  /** The one-line announcement above the home page headline. */
  banner: { tag: string; text: string; cta: string };
};

// Every page image is 640 x 829, rendered from the PDF with pdftoppm.
const PAGE = { width: 640, height: 829 } as const;

// The FluxIQ Technical Vision & Architecture draft v0.9 (October 2026), served
// from public/papers/. The section titles below are its own headings, shortened
// for the contents list; each page image is the page that opens that section
// (PDF pages 2, 3, 4, 7, 9, 10, rendered to public/papers/pages/). Its document
// properties were corrected for publishing (title v0.9, author FluxIQ); the
// pages are unchanged. See site-v2.md and home-redesign.md (v5).
export const PAPER: PaperContent = {
  id: "paper",
  title: "Technical Vision & Architecture",
  edition: "Draft v0.9 · October 2026",
  format: "PDF · 12 pages · 160 KB",
  pageCount: 12,
  coverLabel: "cover · draft v0.9",
  eyebrow: "Read the paper",
  heading: { lead: "How FluxIQ cuts your AI bill,", muted: "in twelve pages." },
  sections: [
    {
      num: "01",
      title: "Stop paying for reasoning you already did",
      page: 2,
      image: {
        ...PAGE,
        src: "/papers/pages/page-02-core-thesis.webp",
        alt: "Page 2 of the FluxIQ paper, “The core thesis”: traditional workflows, FluxIQ, and fully agentic systems compared, with the principle that stable behavior should move toward deterministic execution.",
      },
    },
    {
      num: "02",
      title: "What exists today",
      page: 3,
      image: {
        ...PAGE,
        src: "/papers/pages/page-03-what-exists-today.webp",
        alt: "Page 3, “What exists today”: a status table of FluxIQ’s parts, from instruction-first authoring to persistence and governance, each labelled implemented, near complete, or in progress.",
      },
    },
    {
      num: "03",
      title: "From intent to adaptation",
      page: 4,
      image: {
        ...PAGE,
        src: "/papers/pages/page-04-current-architecture.webp",
        alt: "Page 4, “Current architecture”: seven layers from intent through authoring, the typed Flow, runtime, evidence, and verification to adaptation.",
      },
    },
    {
      num: "04",
      title: "Verification that relaxes",
      page: 7,
      image: {
        ...PAGE,
        src: "/papers/pages/page-07-verification.webp",
        alt: "Page 7, “Confidence should change cost”: a verification schedule that checks runs 1, 2, 3, 8, 33, 158, and 783, checking less often as a Flow proves itself.",
      },
    },
    {
      num: "05",
      title: "The economics of intelligence",
      page: 9,
      image: {
        ...PAGE,
        src: "/papers/pages/page-09-economics.webp",
        alt: "Page 9, “Economics of intelligence”: author, execute, verify, and repair, each with its cost, and the north-star metric of AI cost per successful outcome over a Flow’s lifetime.",
      },
    },
    {
      num: "06",
      title: "Generated applications & roadmap",
      page: 10,
      image: {
        ...PAGE,
        src: "/papers/pages/page-10-generated-applications.webp",
        alt: "Page 10, “From flows to generated applications”: the long-term vision of generating a whole application, its interface, data, Flows, integrations, and governance, from one request. Marked as direction, not the current product.",
      },
    },
  ],
  link: LINKS.paper,
  cover: {
    src: "/papers/fluxiq-technical-vision-v0.9-cover.webp",
    width: 640,
    height: 828,
    alt: "Cover of the FluxIQ Technical Vision & Architecture paper, draft v0.9.",
  },
  banner: { tag: "New", text: "Vision paper, draft v0.9", cta: "Read it" },
};
