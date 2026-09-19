import type { ReactNode } from "react";

export type LinkButtonProps = {
  href: string;
  variant?: "primary" | "ghost";
  /** Opens in a new tab, with `rel="noopener noreferrer"` and a screen-reader note. */
  external?: boolean;
  /** Layout additions only, such as width; the variant owns the look. */
  className?: string;
  children: ReactNode;
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300";

// The primary label is ink, not white: white on the cyan end of the gradient
// is under 2:1 contrast, while ink stays above 4.5:1 across the whole gradient.
const VARIANTS = {
  primary:
    "bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 text-ink shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-110",
  ghost: "border border-white/10 bg-white/5 text-slate-100 hover:border-white/20 hover:bg-white/10",
} as const;

/** A rounded-full pill link, the site's only button shape. */
export function LinkButton({ href, variant = "primary", external = false, className, children }: LinkButtonProps) {
  const classes = [BASE, VARIANTS[variant], className].filter(Boolean).join(" ");
  if (!external) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
