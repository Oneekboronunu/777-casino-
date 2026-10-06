import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Logo({
  className = '',
  variant = 'default',
}: {
  className?: string;
  variant?: 'default' | 'footer';
}) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 group ${className}`}>
      {/* Official Company Logo Image */}
      <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-lg bg-white overflow-hidden shrink-0 flex items-center justify-center p-0.5">
        <img
          src="/logo.png"
          alt="Carnival Mart Logo"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1 leading-tight">
          <span className={`text-lg sm:text-xl font-extrabold tracking-tight ${variant === 'footer' ? 'text-white' : 'text-slate-900'}`}>
            Carnival
          </span>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-brand-600">
            Mart
          </span>
        </div>
        <span className="text-[10px] font-medium tracking-wide text-slate-400">
          place of trust • cleaning & hygiene
        </span>
      </div>
    </Link>
  );
}
