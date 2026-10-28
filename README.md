# Clearpass Checkout

A clean, responsive two-step checkout for a fictional proxy subscription service, **Clearpass**. It's a portfolio project that turns a checkout redesign I made in Figma into a working front end.

> All brands, data and payment flows are mock. No real payments are processed.

## What's inside

- **Payment method** (`/checkout`)
  - An accordion of payment methods: Clearpass Wallet, credit card, PayPal, Alipay and crypto. Only one panel is open at a time, and opening one scrolls it into view.
  - A two-step card flow: billing details, then the card form. It has inline validation, card number formatting and brand detection, a Luhn check, and an expiry check.
  - A sticky order summary with a working promo code (try `CLEAR10` or `WELCOME20`) that updates the discount and total live.
  - Wallet guard: if the balance can't cover the order, the Purchase button is disabled and the panel explains why.
- **Confirmation** (`/confirmation`)
  - A success card with the receipt details and the subscription summary.
  - A dismissible "why did you choose us?" survey banner.
- Responsive layouts for desktop (1440), tablet (834) and mobile (390), matching the Figma frames.
- Accessibility: semantic headings, labelled inputs with error messages, a keyboard-operable accordion, visible focus rings, and colors that pass AA contrast.

## Design system

| Token | Value |
| --- | --- |
| Brand | `#F44862` |
| Primary | `#7856FF` |
| Navy (logo) | `#213548` |
| Text | `#212B36` / `#637381` |
| Background | `#FBFBFB` |
| Headings | Poppins SemiBold (32 / 24 / 20 / 18) |
| Body | Nunito (16 / 14 / 12) |

The tokens live in [`src/app/globals.css`](src/app/globals.css) as a Tailwind v4 `@theme`.

## Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS v4

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.
