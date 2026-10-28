type LogoProps = {
  /** Hide the wordmark below the `sm` breakpoint */
  compact?: boolean;
};

/**
 * Three forward chevrons — traffic passing through a proxy, fading in as it
 * travels. Opacity steps keep it legible as a single shape at small sizes.
 */
export function LogoMark({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 32" className={className} aria-hidden="true">
      <g
        fill="none"
        stroke="#F44862"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 5l11 11L5 27" opacity="0.35" />
        <path d="M17 5l11 11-11 11" opacity="0.65" />
        <path d="M29 5l11 11-11 11" />
      </g>
    </svg>
  );
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="Clearpass">
      <LogoMark />
      <span
        aria-hidden="true"
        className={`font-heading text-[22px] leading-none font-semibold tracking-tight text-navy ${
          compact ? "hidden sm:inline" : ""
        }`}
      >
        clearpass
      </span>
    </span>
  );
}
