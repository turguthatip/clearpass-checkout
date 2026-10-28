/* Simplified, text-based payment marks — stand-ins rather than official artwork. */

export function CardBrands() {
  return (
    <span className="flex items-center gap-2" aria-label="Visa, Mastercard, American Express">
      <span aria-hidden="true" className="font-heading text-[17px] font-bold italic tracking-tight text-[#1a1f71]">
        VISA
      </span>
      <span aria-hidden="true" className="relative flex h-5 w-8">
        <span className="absolute left-0 size-5 rounded-full bg-[#eb001b]" />
        <span className="absolute right-0 size-5 rounded-full bg-[#f79e1b] mix-blend-multiply" />
      </span>
      <span
        aria-hidden="true"
        className="rounded-[3px] bg-[#2e77bc] px-1 font-heading text-[11px] leading-[18px] font-bold tracking-wide text-white"
      >
        AMEX
      </span>
    </span>
  );
}

export function PayPalMark() {
  return (
    <span aria-hidden="true" className="font-heading text-[15px] font-bold italic">
      <span className="text-[#003087]">Pay</span>
      <span className="text-[#009cde]">Pal</span>
    </span>
  );
}

export function AlipayMark() {
  return (
    <span aria-hidden="true" className="flex items-center gap-1 font-heading text-[14px] font-semibold text-ink">
      <span className="grid size-[18px] place-items-center rounded-[4px] bg-[#1677ff] text-[11px] font-bold text-white">
        A
      </span>
      Alipay
    </span>
  );
}

export function CryptoMarks() {
  return (
    <span aria-hidden="true" className="flex items-center gap-2 text-[13px] font-semibold">
      <span className="flex items-center gap-1 text-[#f7931a]">
        <span className="grid size-[18px] place-items-center rounded-full bg-[#f7931a] text-[11px] font-bold text-white">
          ₿
        </span>
        bitcoin
      </span>
      <span className="flex items-center gap-1 text-ink-secondary">
        <span className="text-[15px] leading-none">◆</span>
        ethereum
      </span>
    </span>
  );
}
