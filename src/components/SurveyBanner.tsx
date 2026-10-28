"use client";

import { useId, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "./icons";

const REASONS = [
  "Price and value for money",
  "Reliability and uptime",
  "Ease of setup",
  "Recommended by someone",
  "Customer support",
];

export function SurveyBanner() {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const listId = useId();

  return (
    <section
      aria-label="Quick survey"
      className="relative overflow-hidden bg-[#0b0820] text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_140%_at_30%_100%,rgb(120_86_255/0.45),transparent_60%),radial-gradient(40%_120%_at_60%_0%,rgb(244_72_98/0.35),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-[1440px] px-6 py-6 text-center">
        {answer ? (
          <p className="flex items-center justify-center gap-2 text-body1" role="status">
            <CheckIcon className="size-5 text-success" />
            Thanks for your feedback!
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls={listId}
              className="inline-flex items-center gap-3 rounded-md text-body1"
            >
              Could you tell us why you chose Clearpass?
              <ChevronDownIcon className={`size-5 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            <ul id={listId} hidden={!open} className="mt-4 flex flex-wrap justify-center gap-2">
              {REASONS.map((r) => (
                <li key={r}>
                  <button
                    type="button"
                    onClick={() => setAnswer(r)}
                    className="rounded-full border border-white/30 px-4 py-1.5 text-body2 hover:border-white hover:bg-white/10"
                  >
                    {r}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
