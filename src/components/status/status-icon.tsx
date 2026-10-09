import type { StatusIconName } from "@/content/status";

export type StatusIconProps = {
  name: StatusIconName;
};

/** A status item's static icon in its rounded square: 34 px on the phone, 40 px from `md` up. */
export function StatusIcon({ name }: StatusIconProps) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-[34px] flex-none items-center justify-center rounded-[9px] border border-edge bg-panel text-fg md:size-10 md:rounded-[11px]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-[17px] overflow-visible md:size-5"
      >
        {name === "install" ? <path d="M12 3v12M7 10l5 5 5-5M4 19h16" /> : null}
        {name === "key" ? (
          <>
            <circle cx="8" cy="15" r="4" />
            <path d="M11 12l9-9M17 6l3 3M15 8l2 2" />
          </>
        ) : null}
        {name === "machine" ? (
          <>
            <rect x="3" y="4" width="18" height="12" rx="2" />
            <path d="M8 20h8M12 16v4" />
            <path d="M7 10h10" className="stroke-ok" />
          </>
        ) : null}
        {name === "license" ? <path d="M6 3h9l3 3v15H6zM9 11h6M9 15h6" /> : null}
      </svg>
    </span>
  );
}
