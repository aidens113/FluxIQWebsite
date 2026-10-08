"use client";

import { useRef } from "react";
import { FOCUS_RING } from "@/components/ui/focus-ring";
import type { NavItem } from "@/content/types";

export type MobileMenuProps = {
  items: readonly NavItem[];
};

/**
 * Below `md`: the page links behind a Menu button, opening as a panel under
 * the header. A native disclosure, so it works before (or without)
 * JavaScript; once hydrated, following a link or pressing Escape closes it.
 */
export function MobileMenu({ items }: MobileMenuProps) {
  const menu = useRef<HTMLDetailsElement>(null);
  const close = () => {
    if (menu.current) menu.current.open = false;
  };
  return (
    <details
      ref={menu}
      className="group md:hidden"
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
    >
      <summary
        className={`inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md border border-edge px-3 text-sm text-fg [&::-webkit-details-marker]:hidden ${FOCUS_RING}`}
      >
        <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className="size-4">
          <path
            d="M3 5h12M3 9h12M3 13h12"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="group-open:hidden"
          />
          <path
            d="M4.5 4.5l9 9M13.5 4.5l-9 9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="hidden group-open:block"
          />
        </svg>
        Menu
      </summary>
      <nav
        aria-label="Primary"
        className="absolute inset-x-0 top-full border-b border-line bg-ink shadow-[0_24px_40px_-20px_rgba(0,0,0,0.8)]"
      >
        <ul className="mx-auto flex max-w-[1160px] flex-col px-6 py-2">
          {items.map((item) => (
            <li key={item.href} className="border-b border-line last:border-b-0">
              <a
                href={item.href}
                onClick={close}
                className={`flex min-h-12 items-center rounded-sm text-base ${item.highlight ? "text-amber" : "text-fg"} ${FOCUS_RING}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
