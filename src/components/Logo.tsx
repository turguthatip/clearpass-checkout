type LogoProps = {
  /** Hide the wordmark below the `sm` breakpoint */
  compact?: boolean;
};

export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#F44862" />
      <path
        d="M21.5 9.2A8 8 0 1 0 21.5 22.8"
        fill="none"
        stroke="#fff"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M12.6 16.2l2.6 2.6 5.2-5.4"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2" aria-label="Clearpass">
      <LogoMark />
      <span
        aria-hidden="true"
        className={`font-heading text-[22px] leading-none font-semibold tracking-tight text-navy ${
          compact ? "hidden sm:inline" : ""
        }`}
      >
        clear<span className="text-brand">pass</span>
      </span>
    </span>
  );
}
