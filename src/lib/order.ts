export type Plan = {
  product: string;
  name: string;
  traffic: string;
  price: number;
  pricePerGb: number;
  listPricePerGb: number;
  savePercent: number;
  authMethods: { label: string; count: number }[];
};

export const plan: Plan = {
  product: "Dedicated DC proxies",
  name: "Starter",
  traffic: "20 GB",
  price: 242,
  pricePerGb: 10,
  listPricePerGb: 15.4,
  savePercent: 35,
  authMethods: [
    { label: "Username:password", count: 3 },
    { label: "Location whitelist", count: 3 },
  ],
};

export const planFeatures = [
  "20 GB of traffic per month",
  "Unlimited concurrent sessions",
  "HTTP(S) & SOCKS5 support",
  "99.99% uptime SLA",
];

export const wallet = { balance: 0 };

export const VAT_RATE = 0;

/** Mock promo codes — percentage off the subtotal. */
const PROMO_CODES: Record<string, number> = {
  CLEAR10: 10,
  WELCOME20: 20,
};

export function lookupPromo(code: string): number | null {
  return PROMO_CODES[code.trim().toUpperCase()] ?? null;
}

export type Totals = {
  subtotal: number;
  discountPercent: number;
  discount: number;
  vat: number;
  total: number;
  savings: number;
};

export function computeTotals(discountPercent = 0, p: Plan = plan): Totals {
  const subtotal = p.price;
  const discount = round(subtotal * (discountPercent / 100));
  const vat = round((subtotal - discount) * VAT_RATE);
  const total = round(subtotal - discount + vat);
  const traffic = parseFloat(p.traffic);
  const savings = round((p.listPricePerGb - p.pricePerGb) * traffic + discount);
  return { subtotal, discountPercent, discount, vat, total, savings };
}

export function formatMoney(value: number) {
  return `${value < 0 ? "−" : ""}$${Math.abs(value).toFixed(2)}`;
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

/** Mock receipt shown on the confirmation page. */
export const receipt = {
  email: "user@example.com",
  orderId: "4372051-3724396",
  date: "Oct 28, 2026 14:36",
};
