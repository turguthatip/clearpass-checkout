import type { Metadata } from "next";
import { Checkout } from "@/components/Checkout";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Payment method · Clearpass Checkout",
};

export default function CheckoutPage() {
  return (
    <>
      <Header currentStep={1} />
      <Checkout />
    </>
  );
}
