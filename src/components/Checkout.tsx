"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, type ReactNode } from "react";
import { computeTotals, formatMoney, wallet } from "@/lib/order";
import { ArrowLeftIcon, ChevronDownIcon, ExternalLinkIcon, ShieldCheckIcon } from "./icons";
import { OrderSummary } from "./OrderSummary";
import { AlipayMark, CardBrands, CryptoMarks, PayPalMark } from "./payment/BrandMarks";
import { CardPayment } from "./payment/CardPayment";
import { Button, Card } from "./ui";

type Method = "wallet" | "card" | "paypal" | "alipay" | "crypto";

export function Checkout() {
  const router = useRouter();
  const [open, setOpen] = useState<Method | null>("wallet");
  const [promo, setPromo] = useState<{ code: string; percent: number } | null>(null);
  const totals = computeTotals(promo?.percent ?? 0);
  const complete = () => router.push("/confirmation");

  const balanceAfter = wallet.balance - totals.total;
  const canPayWithWallet = balanceAfter >= 0;

  return (
    <main className="mx-auto grid w-full max-w-[1440px] gap-6 px-6 py-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_437px] lg:items-start">
      <section aria-labelledby="checkout-heading" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2.5">
          <h1 id="checkout-heading" className="font-heading text-h5 font-semibold md:text-h4">
            Select your payment method
          </h1>
          <p className="flex items-center gap-1.5 text-body2">
            <ShieldCheckIcon className="size-6" />
            SSL secure payment · your details are encrypted end-to-end
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <MethodPanel
            id="wallet"
            open={open}
            onToggle={setOpen}
            title={
              <span className="font-heading text-h6 font-semibold md:text-h5">
                <span className="text-brand">Clearpass</span> Wallet
              </span>
            }
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <dl className="grid grid-cols-3 gap-4 text-body2 md:flex md:gap-8 md:text-body1">
                <WalletStat label="Current balance" value={formatMoney(wallet.balance)} />
                <WalletStat label="Order" value={formatMoney(totals.total)} />
                <WalletStat
                  label="Balance after purchase"
                  value={formatMoney(balanceAfter)}
                  negative={!canPayWithWallet}
                />
              </dl>
              <Button onClick={complete} disabled={!canPayWithWallet} className="md:min-w-[120px]">
                Purchase
              </Button>
            </div>
            {!canPayWithWallet && (
              <p className="mt-3 text-caption text-error-dark">
                Not enough funds — top up your wallet or choose another payment method below.
              </p>
            )}
            <p className="mt-4 text-caption text-ink">
              <strong>Note:</strong> Wallet payments are non-refundable. However, you can get the{" "}
              <a href="#" className="inline-flex items-center gap-0.5 underline">
                credits back
                <ExternalLinkIcon className="size-3.5" />
              </a>{" "}
              to your Clearpass Wallet.
            </p>
          </MethodPanel>

          <MethodPanel id="card" open={open} onToggle={setOpen} title={<MethodTitle label="Credit card" mark={<CardBrands />} />}>
            <CardPayment onComplete={complete} />
          </MethodPanel>

          <MethodPanel id="paypal" open={open} onToggle={setOpen} title={<MethodTitle label="PayPal" mark={<PayPalMark />} />}>
            <RedirectPanel provider="PayPal" amount={totals.total} onContinue={complete} />
          </MethodPanel>

          <MethodPanel id="alipay" open={open} onToggle={setOpen} title={<MethodTitle label="Alipay" mark={<AlipayMark />} />}>
            <RedirectPanel provider="Alipay" amount={totals.total} onContinue={complete} />
          </MethodPanel>

          <MethodPanel
            id="crypto"
            open={open}
            onToggle={setOpen}
            title={<MethodTitle label="Cryptocurrency" mark={<CryptoMarks />} />}
            hint="Non-refundable. An additional network fee will be applied."
          >
            <RedirectPanel provider="our crypto processor" amount={totals.total} onContinue={complete} />
          </MethodPanel>
        </div>

        <p className="text-caption text-ink-muted">
          Checkouts are processed by our trusted payment partners. Your data is shared with Clearpass only to
          handle your order and any related inquiries.
        </p>

        <Link
          href="#"
          className="inline-flex w-fit items-center gap-3 rounded text-caption font-semibold text-brand hover:underline"
        >
          <ArrowLeftIcon className="size-[18px]" />
          Back to pricing
        </Link>
      </section>

      <Card as="aside" glow aria-label="Order summary" className="p-6 lg:sticky lg:top-[110px]">
        <OrderSummary
          totals={totals}
          appliedCode={promo?.code}
          onApplyPromo={(code, percent) => setPromo(code ? { code, percent } : null)}
        />
      </Card>
    </main>
  );
}

function MethodPanel({
  id,
  open,
  onToggle,
  title,
  hint,
  children,
}: {
  id: Method;
  open: Method | null;
  onToggle: (m: Method | null) => void;
  title: ReactNode;
  hint?: string;
  children: ReactNode;
}) {
  const isOpen = open === id;
  const panelId = useId();
  const ref = useRef<HTMLDivElement>(null);

  function toggle() {
    onToggle(isOpen ? null : id);
    if (!isOpen) {
      // Wait for the previous panel to collapse before scrolling.
      setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 220);
    }
  }

  return (
    <Card
      ref={ref}
      className={`scroll-mt-28 transition-shadow ${isOpen ? "ring-1 ring-primary/40" : ""}`}
    >
      <h2>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 rounded-xl px-6 py-5 text-left"
        >
          <span className="flex flex-col gap-1.5">
            {title}
            {hint && <span className="text-body2 font-normal text-ink-secondary">{hint}</span>}
          </span>
          <ChevronDownIcon
            className={`size-6 shrink-0 text-ink transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </h2>
      <div
        id={panelId}
        inert={!isOpen}
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6">{children}</div>
        </div>
      </div>
    </Card>
  );
}

function MethodTitle({ label, mark }: { label: string; mark: ReactNode }) {
  return (
    <span className="flex flex-wrap items-center gap-3 text-body1 font-semibold">
      {label}
      {mark}
    </span>
  );
}

function WalletStat({ label, value, negative }: { label: string; value: string; negative?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-ink">{label}:</dt>
      <dd className={`text-h6 font-bold ${negative ? "text-error-dark" : ""}`}>{value}</dd>
    </div>
  );
}

function RedirectPanel({
  provider,
  amount,
  onContinue,
}: {
  provider: string;
  amount: number;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <p className="text-body2 text-ink-secondary">
        You&apos;ll be redirected to {provider} to pay <strong className="text-ink">{formatMoney(amount)}</strong>{" "}
        securely, then brought back here.
      </p>
      <Button onClick={onContinue} className="shrink-0">
        Continue to payment
      </Button>
    </div>
  );
}
