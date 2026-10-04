import { PageSection } from "@/components/ui/page-section";
import { SectionTitle } from "@/components/ui/section-title";
import { TextLink } from "@/components/ui/text-link";
import { STATUS } from "@/content/status";

/** What "early" means today: install, AI provider, platform, and license. */
export function Status() {
  return (
    <PageSection
      id={STATUS.id}
      labelledBy="status-title"
      className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]"
    >
      <div>
        <SectionTitle id="status-title">{STATUS.title}</SectionTitle>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">{STATUS.lede}</p>
      </div>
      <dl className="border-b border-line text-[15px]">
        {STATUS.rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-1 border-t border-line py-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6"
          >
            <dt className="text-dim">{row.label}</dt>
            <dd>
              {row.body}
              {row.link ? (
                <>
                  {" "}
                  <TextLink link={row.link} className="text-fg underline" />.
                </>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </PageSection>
  );
}
