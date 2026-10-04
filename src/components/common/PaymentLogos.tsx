import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "badge" | "image";
  size?: "sm" | "md" | "lg" | "xl";
}

// ==================== BKASH LOGO ====================
export function BKashLogo({ className = "", variant = "full", size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : size === "xl" ? "w-14 h-14" : "w-8 h-8";
  const imgHeight = size === "sm" ? 22 : size === "lg" ? 38 : size === "xl" ? 48 : 30;

  if (variant === "icon") {
    return (
      <div className={`relative flex items-center justify-center rounded-xl bg-white p-1 shadow-md border border-gray-200 flex-shrink-0 ${iconSize} ${className}`}>
        <img
          src="/images/payments/bkash.png"
          alt="bKash"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white text-gray-900 border border-gray-200 shadow-md ${className}`}>
        <img
          src="/images/payments/bkash.png"
          alt="bKash"
          className="h-5 w-auto object-contain"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <div className="bg-white px-2.5 py-1.5 rounded-xl shadow-md border border-gray-200/80 flex items-center justify-center flex-shrink-0">
        <img
          src="/images/payments/bkash.png"
          alt="bKash"
          style={{ height: `${imgHeight}px` }}
          className="w-auto object-contain"
        />
      </div>
    </div>
  );
}

// ==================== NAGAD LOGO ====================
export function NagadLogo({ className = "", variant = "full", size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : size === "xl" ? "w-14 h-14" : "w-8 h-8";
  const imgHeight = size === "sm" ? 22 : size === "lg" ? 38 : size === "xl" ? 48 : 30;

  if (variant === "icon") {
    return (
      <div className={`relative flex items-center justify-center rounded-xl bg-white p-1 shadow-md border border-gray-200 flex-shrink-0 ${iconSize} ${className}`}>
        <img
          src="/images/payments/nagad.png"
          alt="Nagad"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white text-gray-900 border border-gray-200 shadow-md ${className}`}>
        <img
          src="/images/payments/nagad.png"
          alt="Nagad"
          className="h-5 w-auto object-contain"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <div className="bg-white px-2.5 py-1.5 rounded-xl shadow-md border border-gray-200/80 flex items-center justify-center flex-shrink-0">
        <img
          src="/images/payments/nagad.png"
          alt="Nagad"
          style={{ height: `${imgHeight}px` }}
          className="w-auto object-contain"
        />
      </div>
    </div>
  );
}

// ==================== ROCKET LOGO ====================
export function RocketLogo({ className = "", variant = "full", size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : size === "xl" ? "w-14 h-14" : "w-8 h-8";
  const imgHeight = size === "sm" ? 22 : size === "lg" ? 38 : size === "xl" ? 48 : 30;

  if (variant === "icon") {
    return (
      <div className={`relative flex items-center justify-center rounded-xl bg-[#8C3494] p-1 shadow-md border border-purple-400/40 flex-shrink-0 ${iconSize} ${className}`}>
        <img
          src="/images/payments/rocket.png"
          alt="Rocket"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#8C3494] text-white border border-purple-400/40 shadow-md ${className}`}>
        <img
          src="/images/payments/rocket.png"
          alt="Rocket"
          className="h-5 w-auto object-contain"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <div className="bg-[#701E78] px-2.5 py-1.5 rounded-xl shadow-md border border-purple-400/50 flex items-center justify-center flex-shrink-0">
        <img
          src="/images/payments/rocket.png"
          alt="Rocket"
          style={{ height: `${imgHeight}px` }}
          className="w-auto object-contain"
        />
      </div>
    </div>
  );
}

// ==================== UPAY LOGO ====================
export function UpayLogo({ className = "", variant = "full", size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : size === "xl" ? "w-14 h-14" : "w-8 h-8";
  const imgHeight = size === "sm" ? 22 : size === "lg" ? 38 : size === "xl" ? 48 : 30;

  if (variant === "icon") {
    return (
      <div className={`relative flex items-center justify-center rounded-xl bg-white p-1 shadow-md border border-gray-200 flex-shrink-0 ${iconSize} ${className}`}>
        <img
          src="/images/payments/upay.png"
          alt="Upay"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white text-gray-900 border border-gray-200 shadow-md ${className}`}>
        <img
          src="/images/payments/upay.png"
          alt="Upay"
          className="h-5 w-auto object-contain"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <div className="bg-white px-2.5 py-1.5 rounded-xl shadow-md border border-gray-200/80 flex items-center justify-center flex-shrink-0">
        <img
          src="/images/payments/upay.png"
          alt="Upay"
          style={{ height: `${imgHeight}px` }}
          className="w-auto object-contain"
        />
      </div>
    </div>
  );
}

// ==================== BANK TRANSFER LOGO ====================
export function BankLogo({ className = "", variant = "full", size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-8 h-8";

  if (variant === "icon") {
    return (
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0D5CAB] to-[#083868] text-white shadow-md shadow-[#0D5CAB]/30 ${iconSize} ${className}`}>
        <svg viewBox="0 0 40 40" fill="currentColor" className="w-3/5 h-3/5">
          <path d="M20 7L6 14V17H34V14L20 7Z" />
          <rect x="9" y="19" width="3.5" height="10" rx="1" />
          <rect x="15" y="19" width="3.5" height="10" rx="1" />
          <rect x="21" y="19" width="3.5" height="10" rx="1" />
          <rect x="27" y="19" width="3.5" height="10" rx="1" />
          <rect x="6" y="30" width="28" height="3.5" rx="1" />
        </svg>
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#0D5CAB] border border-[#0D5CAB]/40 text-white shadow-md ${className}`}>
        <div className="w-4 h-4 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 40 40" fill="currentColor" className="w-full h-full text-white">
            <path d="M20 7L6 14V17H34V14L20 7Z" />
            <rect x="9" y="19" width="3" height="10" />
            <rect x="18.5" y="19" width="3" height="10" />
            <rect x="28" y="19" width="3" height="10" />
            <rect x="6" y="30" width="28" height="3" />
          </svg>
        </div>
        <span className="font-extrabold text-xs tracking-wider text-white">Bank Transfer</span>
      </div>
    );
  }

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
      <BKashLogo variant="badge" />
      <NagadLogo variant="badge" />
      <RocketLogo variant="badge" />
      <UpayLogo variant="badge" />
      <BankLogo variant="badge" />
    </div>
  );
}
