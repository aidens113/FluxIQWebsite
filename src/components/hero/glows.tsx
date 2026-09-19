/**
 * The three blurred colour glows behind the hero, as on the live site. They
 * are static; the hero's decoration layer hides them from assistive tech.
 */
export function Glows() {
  return (
    <>
      <div className="absolute top-0 left-1/2 size-168 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[140px]" />
      <div className="absolute top-0 -left-40 size-120 rounded-full bg-purple-600/15 blur-[120px]" />
      <div className="absolute top-1/3 -right-40 size-120 rounded-full bg-cyan-500/10 blur-[120px]" />
    </>
  );
}
