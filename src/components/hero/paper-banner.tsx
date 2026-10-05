import { FOCUS_RING } from "@/components/ui/focus-ring";
import { PAPER } from "@/content/paper";

/** A one-line announcement above the headline, linking straight to the paper. */
export function PaperBanner() {
  const { banner } = PAPER;
  return (
    <a
      href={PAPER.link.href}
      className={`group mb-8 inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-amber-edge bg-amber-wash py-1.5 pr-4 pl-1.5 text-sm sm:rounded-full transition-colors hover:border-amber ${FOCUS_RING}`}
    >
      <span className="rounded-full bg-amber px-2.5 py-0.5 text-xs font-semibold text-ink">{banner.tag}</span>
      <span className="text-soft">{banner.text}</span>
      <span className="font-medium text-amber">
        {banner.cta}{" "}
        <span
          aria-hidden="true"
          className="inline-block transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        >
          →
        </span>
      </span>
    </a>
  );
}
