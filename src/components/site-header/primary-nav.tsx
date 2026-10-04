import { FOCUS_RING } from "@/components/ui/focus-ring";
import type { NavItem } from "@/content/types";

export type PrimaryNavProps = {
  items: readonly NavItem[];
};

/**
 * The page links. From `md` up they sit inline; below that they take their
 * own row under the logo and scroll sideways if they do not fit.
 */
export function PrimaryNav({ items }: PrimaryNavProps) {
  return (
    <nav
      aria-label="Primary"
      className="order-last -mx-6 w-[calc(100%+3rem)] overflow-x-auto md:order-none md:mx-0 md:ml-auto md:w-auto"
    >
      <ul className="flex gap-6 px-6 md:gap-7 md:px-0">
        {items.map((item) => (
          <li key={item.href} className="shrink-0">
            <a
              href={item.href}
              className={`inline-flex min-h-11 items-center rounded-sm text-sm text-dim transition-colors hover:text-fg ${FOCUS_RING}`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
