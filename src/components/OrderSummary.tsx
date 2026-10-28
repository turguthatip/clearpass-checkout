"use client";

import { useId, useState, type FormEvent } from "react";
import { formatMoney, lookupPromo, plan, planFeatures, type Totals } from "@/lib/order";
import { CheckIcon, ChevronDownIcon } from "./icons";
import { Badge, Divider } from "./ui";

type OrderSummaryProps = {
  totals: Totals;
  /** When provided, shows the promo-code field. */
  onApplyPromo?: (code: string, percent: number) => void;
  appliedCode?: string | null;
  /** Hides the heading and discount row; used inside the confirmation card. */
  embedded?: boolean;
};

export function OrderSummary({ totals, onApplyPromo, appliedCode, embedded }: OrderSummaryProps) {
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const featuresId = useId();

  return (
    <div className="flex flex-col gap-4">
      {!embedded && (
        <>
          <h2 className="text-body1 font-semibold text-ink">Order summary</h2>
          <Divider />
        </>
      )}

      <div>
        <p className="text-caption text-brand">Your subscription</p>
        <button
          type="button"
          onClick={() => setFeaturesOpen((o) => !o)}
          aria-expanded={featuresOpen}
          aria-controls={featuresId}
          className="mt-2 flex w-full items-start justify-between gap-3 rounded-md text-left"
        >
          <span className="font-heading text-h6 font-semibold md:text-h5">{plan.product} features</span>
          <ChevronDownIcon
            className={`mt-1.5 size-5 shrink-0 text-brand transition-transform ${featuresOpen ? "rotate-180" : ""}`}
          />
        </button>
        <ul
          id={featuresId}
          hidden={!featuresOpen}
          className="mt-3 flex flex-col gap-1.5 text-body2 text-ink-secondary"
        >
          {planFeatures.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <CheckIcon className="size-4 text-success-dark" />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center gap-2">
          <span className="font-heading text-h3 font-semibold leading-none">{plan.name}</span>
          <Badge tone="brand">{plan.traffic}</Badge>
        </div>
      </div>

      <Divider />

      <dl className="flex flex-col gap-2 text-body2">
        <Row label="Sub-total" value={formatMoney(totals.subtotal)} strong />
        {!embedded && (
          <Row
            label={`Discount (${totals.discountPercent}%)`}
            value={totals.discount ? `−${formatMoney(totals.discount)}` : formatMoney(0)}
            highlight={totals.discount > 0}
          />
        )}
        <Row label="VAT (0%)" value={formatMoney(totals.vat)} />
        <div className="mt-1 flex items-start justify-between gap-4">
          <dt className="text-body1 font-bold">Total amount</dt>
          <dd className="text-right">
            <Price value={totals.total} />
            <p className="text-caption text-ink">Billed monthly (auto-renewal)</p>
          </dd>
        </div>
      </dl>

      {totals.savings > 0 && !embedded && (
        <p className="rounded-md bg-info-light px-3 py-1 text-center text-caption text-info-dark">
          You&apos;re saving {formatMoney(totals.savings)} on this purchase
        </p>
      )}

      {onApplyPromo && <PromoCode onApply={onApplyPromo} appliedCode={appliedCode ?? null} />}

      <Divider />

      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-body1">Price per GB</span>
          <span className="flex items-center gap-2">
            <Badge tone="info">Save {plan.savePercent}%</Badge>
            <span className="text-h6 font-bold">{formatMoney(plan.pricePerGb).replace(".00", "")}</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-caption text-ink-muted">
          <span>(including extra traffic)</span>
          <s>{formatMoney(plan.listPricePerGb)}</s>
        </div>
      </div>

      <Divider />

      <div>
        <h3 className="text-caption text-ink">Authentication methods</h3>
        <ul className="mt-2 flex flex-col gap-1.5">
          {plan.authMethods.map((m) => (
            <li key={m.label} className="flex justify-between text-body1">
              <span>{m.label}</span>
              <span>{m.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  highlight,
}: {
  label: string;
  value: string;
  strong?: boolean;
  highlight?: boolean;
}) {
  const tone = highlight ? "text-success-dark font-semibold" : strong ? "text-ink" : "text-ink-muted";
  return (
    <div className={`flex justify-between ${tone}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function Price({ value }: { value: number }) {
  const [whole, cents] = value.toFixed(2).split(".");
  return (
    <span className="inline-flex items-start font-heading font-semibold" aria-label={`${formatMoney(value)} per month`}>
      <span aria-hidden="true" className="mt-1 mr-0.5 text-h6">$</span>
      <span aria-hidden="true" className="text-h4">{whole}</span>
      <span aria-hidden="true" className="mt-0.5 text-caption">.{cents}</span>
      <span aria-hidden="true" className="mt-2.5 ml-1 font-sans text-body2 font-normal text-ink-secondary">/mo</span>
    </span>
  );
}

function PromoCode({
  onApply,
  appliedCode,
}: {
  onApply: (code: string, percent: number) => void;
  appliedCode: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();

  function submit(e: FormEvent) {
    e.preventDefault();
    const percent = lookupPromo(code);
    if (percent === null) {
      setError("This code isn't valid. Try CLEAR10.");
      return;
    }
    setError(null);
    onApply(code.trim().toUpperCase(), percent);
    setOpen(false);
  }

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between text-caption">
        <span className="text-ink">
          Promo code <span className="font-bold text-success-dark">{appliedCode}</span> applied
        </span>
        <button
          type="button"
          className="rounded text-brand hover:underline"
          onClick={() => {
            onApply("", 0);
            setCode("");
          }}
        >
          Remove
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="flex items-center justify-between text-caption">
        <span>Promo code</span>
        <button type="button" className="rounded font-semibold text-brand hover:underline" onClick={() => setOpen(true)}>
          Add
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-caption">
        Promo code
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-err` : undefined}
          placeholder="Enter code"
          className="h-9 min-w-0 flex-1 rounded-lg border border-outline px-3 text-body2 uppercase placeholder:normal-case focus:border-primary focus:outline-none"
        />
        <button type="submit" className="h-9 rounded-lg bg-ink px-4 text-[13px] font-bold text-white hover:bg-navy">
          Apply
        </button>
      </div>
      {error && (
        <p id={`${inputId}-err`} role="alert" className="text-caption text-error-dark">
          {error}
        </p>
      )}
    </form>
  );
}
