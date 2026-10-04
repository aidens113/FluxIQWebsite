import { TextLink } from "@/components/ui/text-link";
import type { Part } from "@/content/types";

export type PartCardProps = {
  part: Part;
};

/** One half of FluxIQ: what it is, four things it does, and where to read more. */
export function PartCard({ part }: PartCardProps) {
  return (
    <article className="flex flex-col rounded-xl border border-rule bg-panel p-7 md:p-8">
      <p className="font-mono text-xs text-amber uppercase">{part.kicker}</p>
      <h3 className="mt-4 mb-2.5 text-[26px] font-semibold tracking-[-0.02em]">{part.title}</h3>
      <p className="leading-relaxed text-muted">{part.body}</p>
      <ul className="mt-6 border-b border-line text-[15px] text-soft">
        {part.items.map((item) => (
          <li key={item} className="border-t border-line py-2.5">
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-7 font-medium">
        <TextLink link={part.link} trailing=" →" />
      </p>
    </article>
  );
}
