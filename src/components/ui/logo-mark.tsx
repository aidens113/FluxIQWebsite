export type LogoMarkProps = {
  className?: string;
};

/**
 * The FluxIQ mark: an F whose middle bar ends in an amber node, the point
 * where a Flow calls on intelligence. Decorative; the wordmark beside it
 * names the link.
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path d="M9 26V11a5 5 0 0 1 5-5h12" stroke="#e8e6e3" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M9 16.5h9" stroke="#e8e6e3" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="23.5" cy="16.5" r="3" fill="#f5b83d" />
    </svg>
  );
}
