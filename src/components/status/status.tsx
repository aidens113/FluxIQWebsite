import { LinkButton } from "@/components/ui/link-button";
import { PageSection } from "@/components/ui/page-section";
import { SectionTitle } from "@/components/ui/section-title";
import { TextLink } from "@/components/ui/text-link";
import { STATUS } from "@/content/status";
import { StatusIcon } from "./status-icon";

/**
 * What "early" means today: install, AI provider, platform, and license. An
 * icon list on the phone; four tiles from `md` up.
 */
export function Status() {
  return (
    <PageSection id={STATUS.id} labelledBy="status-title">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="mb-4 font-mono text-xs tracking-[0.08em] text-amber uppercase">{STATUS.eyebrow}</p>
          <SectionTitle id="status-title">
            {STATUS.heading.lead} <span className="text-dim">{STATUS.heading.muted}</span>
          </SectionTitle>
        </div>
        <div className="hidden flex-none md:block">
          <LinkButton action={{ ...STATUS.repo, variant: "ghost" }} />
        </div>
      </div>
      <ul className="mt-7 grid md:mt-12 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
        {STATUS.items.map((item) => (
          <li
            key={item.label}
            className="flex items-start gap-3.5 border-t border-line py-3.5 first:border-t-0 md:block md:rounded-[18px] md:border md:border-rule md:bg-panel md:p-[26px] md:first:border-t"
          >
            <StatusIcon name={item.icon} />
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold tracking-[-0.01em] md:mt-4.5 md:text-[17px]">{item.label}</h3>
              <p className="mt-0.75 text-[13.5px] leading-[1.45] text-muted md:mt-2 md:text-[14.5px] md:leading-[1.55]">
                <span className="md:hidden">{item.short}</span>
                <span className="hidden md:inline">{item.body}</span>
                {item.link ? (
                  <>
                    {" "}
                    <TextLink link={item.link} className="text-amber" trailing=" →" />
                  </>
                ) : null}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-7 flex flex-col md:hidden">
        <LinkButton action={{ ...STATUS.repo, variant: "ghost" }} />
      </div>
    </PageSection>
  );
}
