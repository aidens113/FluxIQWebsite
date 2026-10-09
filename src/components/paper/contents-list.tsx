import { PAPER } from "@/content/paper";

export type ContentsListProps = {
  /** The section whose page is up, or -1 while the cover is. */
  current: number;
};

/** The paper's contents, from `md` up, with the section on the page lit. */
export function ContentsList({ current }: ContentsListProps) {
  return (
    <ol className="mt-7 hidden gap-x-7 gap-y-3 text-[14.5px] md:grid lg:grid-cols-2">
      {PAPER.sections.map((section, i) => (
        <li
          key={section.num}
          className={`-mx-2.5 -my-1.5 rounded-lg px-2.5 py-1.5 transition-[background-color,color,box-shadow] duration-400 ${
            i === current ? "bg-amber-row text-fg shadow-[inset_2px_0_0_var(--color-amber)]" : "text-muted"
          }`}
        >
          <span className="mr-2 font-mono text-amber">{section.num}</span>
          {section.title}
        </li>
      ))}
    </ol>
  );
}
