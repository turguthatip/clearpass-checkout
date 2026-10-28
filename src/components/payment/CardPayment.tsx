"use client";

import { useId, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { CardIcon, ChevronDownIcon, LockIcon } from "../icons";
import { Button } from "../ui";
import { PayPalMark } from "./BrandMarks";

const COUNTRIES = ["United States", "United Kingdom", "Germany", "Lithuania", "Turkey", "Canada", "Other"];

type Details = { email: string; country: string; zip: string };
type CardData = { number: string; name: string; expiry: string; cvv: string };
type Errors<T> = Partial<Record<keyof T, string>>;

export function CardPayment({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<"details" | "card">("details");
  const [details, setDetails] = useState<Details>({ email: "", country: "United States", zip: "" });

  return (
    <div className="flex flex-col gap-5">
      <ol className="flex items-center gap-2 text-caption text-ink-muted" aria-label="Card payment steps">
        <li className={step === "details" ? "font-bold text-primary" : "text-success-dark"}>1. Your details</li>
        <li aria-hidden="true">—</li>
        <li className={step === "card" ? "font-bold text-primary" : ""}>2. Card</li>
      </ol>

      {step === "details" ? (
        <DetailsForm
          initial={details}
          onSubmit={(d) => {
            setDetails(d);
            setStep("card");
          }}
        />
      ) : (
        <CardForm details={details} onBack={() => setStep("details")} onSubmit={onComplete} />
      )}

      <p className="rounded-lg border border-divider p-4 text-center text-caption text-ink-muted">
        Payments are processed by our payment partner, acting as merchant of record. Your data is shared
        with Clearpass only to fulfil your order. <a href="#" className="underline">Terms &amp; Conditions</a> ·{" "}
        <a href="#" className="underline">Privacy Policy</a>
      </p>
    </div>
  );
}

function DetailsForm({ initial, onSubmit }: { initial: Details; onSubmit: (d: Details) => void }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Errors<Details>>({});

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Errors<Details> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email address.";
    if (!values.zip.trim()) next.zip = "Enter your ZIP or postal code.";
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit(values);
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div>
        <h3 className="text-body1 font-bold">Please enter your details</h3>
        <p className="text-body2 text-ink-secondary">
          We collect this to help prevent fraud and keep your payment secure.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Email address"
          type="email"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          onChange={(v) => setValues({ ...values, email: v })}
          className="md:col-span-2"
        />
        <SelectField
          label="Country"
          value={values.country}
          options={COUNTRIES}
          onChange={(v) => setValues({ ...values, country: v })}
        />
        <Field
          label="ZIP / Postal code"
          autoComplete="postal-code"
          value={values.zip}
          error={errors.zip}
          onChange={(v) => setValues({ ...values, zip: v })}
        />
      </div>
      <Button type="submit" fullWidth>
        Continue
      </Button>
    </form>
  );
}

function CardForm({
  details,
  onBack,
  onSubmit,
}: {
  details: Details;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [values, setValues] = useState<CardData>({ number: "", name: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState<Errors<CardData>>({});
  const brand = detectBrand(values.number);

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Errors<CardData> = {};
    const digits = values.number.replace(/\D/g, "");
    if (digits.length < 13 || !luhn(digits)) next.number = "Enter a valid card number.";
    if (!values.name.trim()) next.name = "Enter the name on the card.";
    const expiryError = validateExpiry(values.expiry);
    if (expiryError) next.expiry = expiryError;
    if (!/^\d{3,4}$/.test(values.cvv)) next.cvv = "3 or 4 digits.";
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit();
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-bg-light px-3 py-2 text-caption">
        <span className="text-ink-secondary">
          {details.email} · {details.country} {details.zip}
        </span>
        <button type="button" onClick={onBack} className="rounded font-semibold text-primary hover:underline">
          Edit
        </button>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="flex h-12 items-center justify-center rounded-lg border border-[#009cde]/60 hover:bg-[#009cde]/5"
      >
        <span className="sr-only">Pay with PayPal</span>
        <PayPalMark />
      </button>

      <div className="flex items-center gap-3 text-caption text-ink-muted">
        <span className="h-px flex-1 bg-divider" />
        or pay by card
        <span className="h-px flex-1 bg-divider" />
      </div>

      <Field
        label="Card number"
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder="1234 1234 1234 1234"
        value={values.number}
        error={errors.number}
        onChange={(v) => setValues({ ...values, number: formatCardNumber(v) })}
        trailing={
          brand ? (
            <span className="text-caption font-bold text-ink-secondary">{brand}</span>
          ) : (
            <CardIcon className="size-5 text-ink-disabled" />
          )
        }
      />
      <Field
        label="Cardholder name"
        autoComplete="cc-name"
        value={values.name}
        error={errors.name}
        onChange={(v) => setValues({ ...values, name: v })}
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Expiration date"
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM/YY"
          value={values.expiry}
          error={errors.expiry}
          onChange={(v) => setValues({ ...values, expiry: formatExpiry(v) })}
        />
        <Field
          label="Security code (CVV)"
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder="CVV"
          maxLength={4}
          value={values.cvv}
          error={errors.cvv}
          onChange={(v) => setValues({ ...values, cvv: v.replace(/\D/g, "") })}
          trailing={<CardIcon className="size-5 text-ink-disabled" />}
        />
      </div>
      <Button type="submit" fullWidth>
        <LockIcon className="size-4" />
        Subscribe now
      </Button>
    </form>
  );
}

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  trailing?: ReactNode;
};

function Field({ label, error, onChange, trailing, className = "", ...input }: FieldProps) {
  const id = useId();
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-body2 font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          {...input}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={`h-12 w-full rounded-lg border bg-white px-3.5 text-body1 placeholder:text-ink-disabled focus:outline-none focus:ring-2 focus:ring-primary/30 ${
            error ? "border-error" : "border-outline focus:border-primary"
          } ${trailing ? "pr-14" : ""}`}
        />
        {trailing && <span className="absolute inset-y-0 right-3.5 flex items-center">{trailing}</span>}
      </div>
      {error && (
        <p id={`${id}-err`} className="text-caption text-error-dark">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-body2 font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="country-name"
          className="h-12 w-full appearance-none rounded-lg border border-outline bg-white px-3.5 pr-10 text-body1 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2 text-ink-secondary" />
      </div>
    </div>
  );
}

function formatCardNumber(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

function validateExpiry(v: string) {
  const m = /^(\d{2})\/(\d{2})$/.exec(v);
  if (!m) return "Use MM/YY.";
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return "Invalid month.";
  const now = new Date();
  if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
    return "This card has expired.";
  }
  return null;
}

function detectBrand(v: string) {
  const d = v.replace(/\D/g, "");
  if (/^4/.test(d)) return "VISA";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "MC";
  if (/^3[47]/.test(d)) return "AMEX";
  return null;
}

function luhn(digits: string) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let n = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}
