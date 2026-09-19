import type { ReactNode } from "react";

export type RevealProps = {
  className?: string;
  children: ReactNode;
};

/**
 * Rises and fades its children in as they scroll into view. The motion is pure
 * CSS on `[data-reveal]` in globals.css, so this stays a server component, and
 * the content is fully visible without JavaScript, without scroll-driven
 * animation support, and under reduced motion.
 */
export function Reveal({ className, children }: RevealProps) {
  return (
    <div data-reveal className={className}>
      {children}
    </div>
  );
}
