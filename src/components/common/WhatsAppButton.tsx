'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppButton() {
  const { language, t } = useStore();
  const [showTooltip, setShowTooltip] = useState(true);
  const isBn = language === 'bn';

  const phoneNumber = '8801404005680';
  const defaultMessage = isBn
    ? 'হ্যালো কার্নিভাল মার্ট, আমি আপনাদের ক্লিনিং ও হাইজিন পণ্য সম্পর্কে জানতে চাই।'
    : 'Hello Carnival Mart, I would like to inquire about your cleaning and hygiene products.';

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-5 z-40 flex items-end flex-col gap-2">
      {/* Interactive Tooltip popup */}
      {showTooltip && (
        <div className="bg-white px-3.5 py-2 rounded-xl shadow-elevated border border-slate-100 flex items-center gap-2.5 text-xs text-slate-800 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium">
            {isBn ? 'সরাসরি সহায়তা প্রয়োজন?' : 'Need instant assistance?'}
          </span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
            aria-label="Close tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label={t.common.whatsappUs}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="currentColor" stroke="none"/>
        </svg>
      </a>
    </div>
  );
}
