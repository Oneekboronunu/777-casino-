import React from "react";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "badge" | "image" | "smooth";
  size?: "sm" | "md" | "lg" | "xl";
}

// ==================== BKASH LOGO (Smooth & Seamless) ====================
export function BKashLogo({ className = "", variant = "smooth", size = "md" }: LogoProps) {
  const imgHeight = size === "sm" ? 22 : size === "lg" ? 36 : size === "xl" ? 44 : 28;

  return (
    <div className={`inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/payments/bkash.png"
        alt="bKash"
        style={{ height: `${imgHeight}px` }}
        className="w-auto max-w-full max-h-full object-contain filter drop-shadow-sm select-none"
      />
    </div>
  );
}

// ==================== NAGAD LOGO (Smooth & Seamless) ====================
export function NagadLogo({ className = "", variant = "smooth", size = "md" }: LogoProps) {
  const imgHeight = size === "sm" ? 22 : size === "lg" ? 36 : size === "xl" ? 44 : 28;

  return (
    <div className={`inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/payments/nagad.png"
        alt="Nagad"
        style={{ height: `${imgHeight}px` }}
        className="w-auto max-w-full max-h-full object-contain filter drop-shadow-sm select-none"
      />
    </div>
  );
}

// ==================== ROCKET LOGO (Smooth & Seamless) ====================
export function RocketLogo({ className = "", variant = "smooth", size = "md" }: LogoProps) {
  const imgHeight = size === "sm" ? 22 : size === "lg" ? 36 : size === "xl" ? 44 : 28;

  return (
    <div className={`inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/payments/rocket.png"
        alt="DBBL Rocket"
        style={{ height: `${imgHeight}px` }}
        className="w-auto max-w-full max-h-full object-contain filter drop-shadow-sm select-none"
      />
    </div>
  );
}

// ==================== UPAY LOGO ====================
export function UpayLogo({ className = "", size = "md" }: LogoProps) {
  const imgHeight = size === "sm" ? 22 : size === "lg" ? 36 : size === "xl" ? 44 : 28;

  return (
    <div className={`inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/payments/upay.png"
        alt="Upay"
        style={{ height: `${imgHeight}px` }}
        className="w-auto max-w-full max-h-full object-contain filter drop-shadow-sm select-none"
      />
    </div>
  );
}

// ==================== BANK TRANSFER LOGO ====================
export function BankLogo({ className = "", size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-8 h-8";

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0D5CAB] to-[#083868] text-white shadow-lg shadow-[#0D5CAB]/25 flex-shrink-0 ${iconSize}`}>
        <svg viewBox="0 0 40 40" fill="currentColor" className="w-3/5 h-3/5">
          <path d="M20 7L6 14V17H34V14L20 7Z" />
          <rect x="9" y="19" width="3.5" height="10" rx="1" />
          <rect x="15" y="19" width="3.5" height="10" rx="1" />
          <rect x="21" y="19" width="3.5" height="10" rx="1" />
          <rect x="27" y="19" width="3.5" height="10" rx="1" />
          <rect x="6" y="30" width="28" height="3.5" rx="1" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-black text-sm tracking-tight text-white leading-none">
          <span className="text-[#6DB1FF]">City / Brac</span> Bank
        </span>
        <span className="text-[10px] text-blue-300 font-medium tracking-wide">Instant Wire</span>
      </div>
    </div>
  );
}

// ==================== ALL PAYMENT BADGES BAR ====================
export function PaymentMethodsRibbon({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      <BKashLogo size="sm" />
      <NagadLogo size="sm" />
      <RocketLogo size="sm" />
      <UpayLogo size="sm" />
      <BankLogo size="sm" />
    </div>
  );
}
