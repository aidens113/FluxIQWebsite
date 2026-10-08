import { FOCUS_RING } from "@/components/ui/focus-ring";
import type { NavItem } from "@/content/types";

export type PrimaryNavProps = {
  items: readonly NavItem[];
};

/** The page links, inline from `md` up; below that they live in the Menu. */
export function PrimaryNav({ items }: PrimaryNavProps) {
  return (
    <nav aria-label="Primary" className="ml-auto hidden md:block">
      <ul className="flex gap-7">
        {items.map((item) => (
          <li key={item.href} className="shrink-0">
            <a
              href={item.href}
              className={`inline-flex min-h-11 items-center rounded-sm text-sm transition-colors ${item.highlight ? "text-amber hover:text-[#ffc95c]" : "text-dim hover:text-fg"} ${FOCUS_RING}`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
