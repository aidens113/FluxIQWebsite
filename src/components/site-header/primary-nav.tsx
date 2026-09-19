import { NAV_ITEMS } from "@/content/navigation";

/** The section anchors, shown from `md` up; below that the header keeps only the logo and GitHub. */
export function PrimaryNav() {
  return (
    <nav aria-label="Primary" className="hidden md:block">
      <ul className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
