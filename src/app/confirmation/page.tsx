import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { CheckCircleIcon, ExternalLinkIcon } from "@/components/icons";
import { OrderSummary } from "@/components/OrderSummary";
import { SurveyBanner } from "@/components/SurveyBanner";
import { buttonClasses, Card, Divider } from "@/components/ui";
import { computeTotals, receipt } from "@/lib/order";

export const metadata: Metadata = {
  title: "Order confirmed · Clearpass Checkout",
};

export default function ConfirmationPage() {
  const totals = computeTotals();

  return (
    <>
      <Header currentStep={3} />
      <SurveyBanner />
      <main className="flex justify-center px-0 py-4 sm:px-6">
        <Card glow className="w-full max-w-[390px] rounded-none p-6 sm:rounded-xl">
          <div className="flex flex-col items-center gap-3 text-center">
            <CheckCircleIcon className="size-[68px] text-success" />
            <h1 className="font-heading text-h5 font-semibold">
              Payment successful
              <span className="block">Subscription activated</span>
            </h1>
            <p className="text-body2 text-ink">
              Your subscription will be active in a couple of minutes. We&apos;ve emailed your payment
              confirmation to <strong>{receipt.email}</strong>.
            </p>
            <Link href="/checkout" className={`${buttonClasses({ fullWidth: true })} mt-2`}>
              Go to dashboard
            </Link>
          </div>

          <section aria-labelledby="receipt-heading" className="mt-6 flex flex-col gap-3">
            <h2 id="receipt-heading" className="text-body2 font-semibold">
              Order summary
            </h2>
            <Divider />
            <dl className="flex flex-col gap-2 text-body2">
              <ReceiptRow label="Billing email" value={receipt.email} />
              <ReceiptRow label="Order ID" value={receipt.orderId} />
              <ReceiptRow label="Billing date" value={receipt.date} />
              <div className="flex justify-between gap-4">
                <dt>Receipt</dt>
                <dd>
                  <a href="#" className="inline-flex items-center gap-1 text-primary underline">
                    View receipt
                    <ExternalLinkIcon className="size-4" />
                  </a>
                </dd>
              </div>
            </dl>
            <Divider />
          </section>

          <div className="mt-3">
            <OrderSummary totals={totals} embedded />
          </div>
        </Card>
      </main>
    </>
  );
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt>{label}</dt>
      <dd className="text-right break-all">{value}</dd>
    </div>
  );
}
