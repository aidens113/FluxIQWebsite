import { ArrowDown } from "lucide-react";
import { WHY } from "@/content/why";

/**
 * A bouncing arrow down to the Why FluxIQ section, from `md` up. The target
 * and label come from that section's content, so the anchor cannot drift from
 * the section's id. The bounce is skipped under reduced motion.
 */
export function ScrollCue() {
  return (
    <a
      href={`#${WHY.id}`}
      aria-label={`Scroll to ${WHY.eyebrow}`}
      className="mt-12 hidden rounded-full p-2 text-cyan-400/70 transition-colors hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 md:inline-flex motion-safe:animate-bounce"
    >
      <ArrowDown className="size-6" strokeWidth={2} aria-hidden="true" />
    </a>
  );
}
