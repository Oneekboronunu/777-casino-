import React from "react";
import Link from "next/link";

interface Bet777LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
}

export default function Bet777Logo({
  size = "md",
  className = "",
  href = "/",
}: Bet777LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl sm:text-3xl",
    lg: "text-3xl sm:text-4xl",
  };

  const content = (
    <div className={`inline-flex items-center font-black tracking-tight select-none ${sizeClasses[size]} ${className}`}>
      <span className="text-white font-sans font-black tracking-tighter">
        bet
      </span>
      <span className="text-[#FF1F2D] italic font-black tracking-tighter drop-shadow-sm ml-0.5">
        777
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center transition hover:opacity-95">
        {content}
      </Link>
    );
  }

  return content;
}
