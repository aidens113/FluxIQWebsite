import type { Point } from "@/content/types";

export type PointGridProps = {
  points: readonly Point[];
  className?: string;
};

/** Short titled paragraphs in a grid that drops to one column on a phone. */
export function PointGrid({ points, className }: PointGridProps) {
  return (
    <div className={`grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 ${className ?? ""}`}>
      {points.map((point) => (
        <div key={point.title} className="border-t border-edge pt-5">
          <h3 className="mb-2 text-lg font-semibold text-fg">{point.title}</h3>
          <p className="leading-relaxed text-muted">{point.body}</p>
        </div>
      ))}
    </div>
  );
}
