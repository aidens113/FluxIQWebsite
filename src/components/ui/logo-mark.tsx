export type LogoMarkProps = {
  className?: string;
};

/**
 * The FluxIQ mark: a wave that settles into a straight line, for uncertain
 * behaviour becoming a reliable, repeatable Flow. Decorative; the wordmark
 * beside it names the link.
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path d="M3 16 C6 6, 9 26, 13 16 L29 16" stroke="#f5b83d" strokeWidth="3" strokeLinecap="round" />
      <circle cx="29" cy="16" r="2.5" fill="#e8e6e3" />
    </svg>
  );
}
