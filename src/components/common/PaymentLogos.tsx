import React from "react";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "badge";
  size?: "sm" | "md" | "lg";
}

// ==================== BKASH LOGO ====================
export function BKashLogo({ className = "", variant = "full", size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-8 h-8";
  
  if (variant === "icon") {
    return (
      <div className={`relative flex items-center justify-center rounded-xl bg-[#E2136E] text-white shadow-md shadow-[#E2136E]/30 ${iconSize} ${className}`}>
        <svg viewBox="0 0 40 40" fill="currentColor" className="w-4/5 h-4/5">
          {/* bKash iconic Origami Bird */}
          <path d="M6 20L18 8L28 18L18 28L6 20Z" fill="#FFFFFF" fillOpacity="0.9" />
          <path d="M18 8L34 14L28 18L18 8Z" fill="#FFFFFF" />
          <path d="M18 28L34 22L28 18L18 28Z" fill="#FFFFFF" fillOpacity="0.7" />
          <path d="M28 18L38 20L34 14L28 18Z" fill="#FFFFFF" fillOpacity="0.5" />
        </svg>
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#E2136E]/15 border border-[#E2136E]/40 text-white ${className}`}>
        <div className="w-5 h-5 rounded-lg bg-[#E2136E] flex items-center justify-center flex-shrink-0 p-0.5">
          <svg viewBox="0 0 40 40" fill="currentColor" className="w-full h-full text-white">
            <path d="M6 20L18 8L28 18L18 28L6 20Z" fill="#FFFFFF" />
            <path d="M18 8L34 14L28 18L18 8Z" fill="#FFFFFF" />
            <path d="M18 28L34 22L28 18L18 28Z" fill="#FFFFFF" fillOpacity="0.8" />
          </svg>
        </div>
        <span className="font-extrabold text-xs tracking-wider text-[#FF65A5]">bKash</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#E2136E] to-[#C20E5C] text-white shadow-lg shadow-[#E2136E]/25 flex-shrink-0 ${iconSize}`}>
        <svg viewBox="0 0 40 40" fill="currentColor" className="w-3/4 h-3/4">
          <path d="M6 20L18 8L28 18L18 28L6 20Z" fill="#FFFFFF" fillOpacity="0.95" />
          <path d="M18 8L34 14L28 18L18 8Z" fill="#FFFFFF" />
          <path d="M18 28L34 22L28 18L18 28Z" fill="#FFFFFF" fillOpacity="0.75" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-black text-sm tracking-tight text-white flex items-center leading-none">
          <span className="text-[#FF4A98]">b</span>Kash
        </span>
        <span className="text-[10px] text-pink-300 font-medium tracking-wide">Personal Send</span>
      </div>
    </div>
  );
}

// ==================== NAGAD LOGO ====================
export function NagadLogo({ className = "", variant = "full", size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-8 h-8";

  if (variant === "icon") {
    return (
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#F7931E] via-[#F15A24] to-[#C1272D] text-white shadow-md shadow-[#F7931E]/30 ${iconSize} ${className}`}>
        <svg viewBox="0 0 40 40" fill="none" className="w-4/5 h-4/5">
          {/* Nagad Swirl / Flame */}
          <path d="M20 5C14 12 11 17 11 22C11 27.5 15 32 20 32C25 32 29 27.5 29 22C29 16 23 11 20 5Z" fill="#FFFFFF" />
          <path d="M20 12C17 16 15 19 15 22C15 25 17 28 20 28C23 28 25 25 25 22C25 18 22 15 20 12Z" fill="#F15A24" />
          <circle cx="20" cy="22" r="3" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#F7931E]/15 border border-[#F7931E]/40 text-white ${className}`}>
        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#F7931E] to-[#F15A24] flex items-center justify-center flex-shrink-0 p-0.5">
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
            <path d="M20 5C14 12 11 17 11 22C11 27.5 15 32 20 32C25 32 29 27.5 29 22C29 16 23 11 20 5Z" fill="#FFFFFF" />
            <circle cx="20" cy="22" r="3" fill="#F15A24" />
          </svg>
        </div>
        <span className="font-extrabold text-xs tracking-wider text-[#FFA842]">Nagad</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#F7931E] via-[#F15A24] to-[#C1272D] text-white shadow-lg shadow-[#F7931E]/25 flex-shrink-0 ${iconSize}`}>
        <svg viewBox="0 0 40 40" fill="none" className="w-3/4 h-3/4">
          <path d="M20 5C14 12 11 17 11 22C11 27.5 15 32 20 32C25 32 29 27.5 29 22C29 16 23 11 20 5Z" fill="#FFFFFF" />
          <path d="M20 12C17 16 15 19 15 22C15 25 17 28 20 28C23 28 25 25 25 22C25 18 22 15 20 12Z" fill="#F15A24" />
          <circle cx="20" cy="22" r="3" fill="#FFFFFF" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-black text-sm tracking-tight text-white leading-none">
          <span className="text-[#FFA842]">নগদ</span> <span className="text-gray-300 font-bold text-xs">(Nagad)</span>
        </span>
        <span className="text-[10px] text-amber-300/80 font-medium tracking-wide">Personal Send</span>
      </div>
    </div>
  );
}

// ==================== ROCKET LOGO ====================
export function RocketLogo({ className = "", variant = "full", size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-8 h-8";

  if (variant === "icon") {
    return (
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#8C3494] via-[#701E78] to-[#4A0E50] text-white shadow-md shadow-[#8C3494]/30 ${iconSize} ${className}`}>
        <svg viewBox="0 0 40 40" fill="none" className="w-4/5 h-4/5">
          {/* Rocket Ship Icon */}
          <path d="M20 6C20 6 26 12 26 22L20 20L14 22C14 12 20 6 20 6Z" fill="#FFFFFF" />
          <path d="M14 22L9 26L12 29L15 26L14 22Z" fill="#F5A623" />
          <path d="M26 22L31 26L28 29L25 26L26 22Z" fill="#F5A623" />
          <path d="M18 22L20 33L22 22L18 22Z" fill="#E2136E" />
          <circle cx="20" cy="15" r="2.5" fill="#8C3494" />
        </svg>
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#8C3494]/15 border border-[#8C3494]/40 text-white ${className}`}>
        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#8C3494] to-[#5C1662] flex items-center justify-center flex-shrink-0 p-0.5">
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
            <path d="M20 6C20 6 26 12 26 22L20 20L14 22C14 12 20 6 20 6Z" fill="#FFFFFF" />
            <circle cx="20" cy="15" r="2.5" fill="#8C3494" />
          </svg>
        </div>
        <span className="font-extrabold text-xs tracking-wider text-[#C87BD2]">Rocket</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#8C3494] via-[#701E78] to-[#4A0E50] text-white shadow-lg shadow-[#8C3494]/25 flex-shrink-0 ${iconSize}`}>
        <svg viewBox="0 0 40 40" fill="none" className="w-3/4 h-3/4">
          <path d="M20 6C20 6 26 12 26 22L20 20L14 22C14 12 20 6 20 6Z" fill="#FFFFFF" />
          <path d="M14 22L9 26L12 29L15 26L14 22Z" fill="#F5A623" />
          <path d="M26 22L31 26L28 29L25 26L26 22Z" fill="#F5A623" />
          <path d="M18 22L20 33L22 22L18 22Z" fill="#E2136E" />
          <circle cx="20" cy="15" r="2.5" fill="#8C3494" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-black text-sm tracking-tight text-white leading-none">
          <span className="text-[#C87BD2]">DBBL</span> Rocket
        </span>
        <span className="text-[10px] text-purple-300 font-medium tracking-wide">Personal / Agent</span>
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
      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#0D5CAB]/15 border border-[#0D5CAB]/40 text-white ${className}`}>
        <div className="w-5 h-5 rounded-lg bg-[#0D5CAB] flex items-center justify-center flex-shrink-0 p-0.5">
          <svg viewBox="0 0 40 40" fill="currentColor" className="w-3/4 h-3/4">
            <path d="M20 7L6 14V17H34V14L20 7Z" />
            <rect x="9" y="19" width="3" height="10" />
            <rect x="18.5" y="19" width="3" height="10" />
            <rect x="28" y="19" width="3" height="10" />
            <rect x="6" y="30" width="28" height="3" />
          </svg>
        </div>
        <span className="font-extrabold text-xs tracking-wider text-[#6DB1FF]">Bank Transfer</span>
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
      <BankLogo variant="badge" />
    </div>
  );
}
