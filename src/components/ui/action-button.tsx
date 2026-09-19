import type { ActionLink } from "@/content/types";
import { GitHubLogo } from "./github-logo";
import { LinkButton } from "./link-button";
import { XLogo } from "./x-logo";

export type ActionButtonProps = {
  action: ActionLink;
  /** Layout additions only; LinkButton's variant owns the look. */
  className?: string;
};

/** Renders a content `ActionLink` as a pill `LinkButton` with its brand or Lucide icon. */
export function ActionButton({ action, className }: ActionButtonProps) {
  const { href, label, variant, external, icon: Icon } = action;
  let icon = <GitHubLogo className="size-4" />;
  if (Icon === "x") icon = <XLogo className="size-4" />;
  else if (Icon !== "github") icon = <Icon className="size-4" strokeWidth={2} aria-hidden="true" />;
  return (
    <LinkButton href={href} variant={variant} external={external} className={className}>
      {icon}
      {label}
    </LinkButton>
  );
}
