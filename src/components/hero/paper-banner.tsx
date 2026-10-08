import { FOCUS_RING } from "@/components/ui/focus-ring";
import { PAPER } from "@/content/paper";

/**
 * A one-line announcement above the headline, linking straight to the paper.
 * Short enough for one line on a phone; if it ever wraps, the tag stays
 * top-left and the text and link flow as one paragraph beside it.
 */
export function PaperBanner() {
  const { banner } = PAPER;
  return (
    <a
      href={PAPER.link.href}
      className={`group mb-8 inline-flex max-w-full items-start gap-3 rounded-[18px] border border-amber-edge bg-amber-wash py-1.5 pr-4 pl-1.5 text-sm leading-6 transition-colors hover:border-amber ${FOCUS_RING}`}
    >
      <span className="flex-none rounded-full bg-amber px-2.5 text-xs leading-6 font-semibold text-ink">
        {banner.tag}
      </span>
      <span className="min-w-0">
        <span className="text-soft">{banner.text}</span>{" "}
        <span className="font-medium whitespace-nowrap text-amber">
          {banner.cta}{" "}
          <span
            aria-hidden="true"
            className="inline-block transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          >
            →
          </span>
        </span>
      </span>
    </a>
  );
}
