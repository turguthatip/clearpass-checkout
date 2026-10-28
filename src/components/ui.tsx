import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, Ref } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outlined";
  size?: "lg" | "sm";
  fullWidth?: boolean;
};

export function buttonClasses({
  variant = "primary",
  size = "lg",
  fullWidth = false,
}: Pick<ButtonProps, "variant" | "size" | "fullWidth"> = {}) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    size === "lg" ? "h-12 px-6 text-[15px] leading-[26px]" : "h-9 px-4 text-[13px] leading-[22px]",
    variant === "primary"
      ? "bg-primary text-white shadow-primary hover:bg-primary-dark"
      : "border border-primary/50 text-primary hover:border-primary hover:bg-primary-light",
    fullWidth ? "w-full" : "",
  ].join(" ");
}

export function Button({
  variant,
  size,
  fullWidth,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${buttonClasses({ variant, size, fullWidth })} ${className}`}
      {...props}
    />
  );
}

type CardProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
  glow?: boolean;
  as?: "div" | "section" | "aside";
};

export function Card({ glow, as: Tag = "div", className = "", ...props }: CardProps) {
  return (
    <Tag
      className={`relative overflow-hidden rounded-xl bg-white shadow-card ${
        glow ? "card-glow" : ""
      } ${className}`}
      {...props}
    />
  );
}

export function Badge({
  children,
  tone = "primary",
}: {
  children: ReactNode;
  tone?: "primary" | "info" | "brand";
}) {
  const tones = {
    primary: "border border-primary text-primary bg-white",
    brand: "border border-brand text-brand bg-white",
    info: "bg-info-light text-info-dark",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-caption font-bold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Divider({ className = "" }: { className?: string }) {
  return <hr className={`border-0 border-t border-divider ${className}`} />;
}
