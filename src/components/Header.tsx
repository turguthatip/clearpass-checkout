import Link from "next/link";
import { CheckCircleIcon } from "./icons";
import { Logo } from "./Logo";

const steps = ["Payment method", "Confirmation"] as const;

export function Header({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <header className="sticky top-0 z-30 border-b border-divider bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-[86px] max-w-[1440px] items-center justify-between gap-4 px-6 md:px-10">
        <div className="flex items-center gap-3">
          <Link href="/checkout" className="rounded-md">
            <Logo compact />
          </Link>
          <span className="h-5 w-px bg-ink sm:block" aria-hidden="true" />
          <span className="text-body2 text-ink">Checkout</span>
        </div>

        <nav aria-label="Checkout progress">
          <ol className="flex items-center gap-3 md:gap-4">
            {steps.map((label, i) => {
              const step = i + 1;
              const done = step < currentStep;
              const active = step === currentStep;
              return (
                <li
                  key={label}
                  aria-current={active ? "step" : undefined}
                  className={`items-center gap-2 text-body2 ${
                    active || done ? "flex" : "hidden sm:flex"
                  } ${done ? "text-success-dark" : active ? "text-primary" : "text-ink-muted"}`}
                >
                  {done ? (
                    <CheckCircleIcon className="size-6 text-success" />
                  ) : (
                    <span
                      className={`grid size-6 place-items-center rounded-full text-caption font-bold text-white ${
                        active ? "bg-primary" : "bg-ink-disabled"
                      }`}
                    >
                      {step}
                    </span>
                  )}
                  <span>{label}</span>
                  {done && <span className="sr-only">(completed)</span>}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </header>
  );
}
