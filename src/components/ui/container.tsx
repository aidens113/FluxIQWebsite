import type { ReactNode } from "react";

export type ContainerProps = {
  /** Layout additions such as padding, flex, or grid. */
  className?: string;
  children: ReactNode;
};

/** The site's content column: 1160 px wide at most, with a 24 px gutter. */
export function Container({ className, children }: ContainerProps) {
  return <div className={`mx-auto w-full max-w-[1160px] px-6 ${className ?? ""}`}>{children}</div>;
}
