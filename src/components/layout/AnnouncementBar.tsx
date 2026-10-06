'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import { Phone, Truck, Building, ShieldCheck } from 'lucide-react';

export default function AnnouncementBar() {
  const { language, t } = useStore();
  const isBn = language === 'bn';

  return (
    <div className="bg-brand-900 text-brand-100 text-xs py-2 px-4 border-b border-brand-800 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-center sm:text-left flex-wrap justify-center sm:justify-start">
          <span className="flex items-center gap-1.5 font-medium">
            <Truck className="w-3.5 h-3.5 text-brand-400" />
            {isBn ? 'দেশব্যাপী দ্রুত হোম ডেলিভারি' : 'Nationwide Doorstep Delivery'}
          </span>
          <span className="hidden md:inline-block text-brand-700">|</span>
          <span className="hidden md:flex items-center gap-1.5 text-brand-200">
            <Building className="w-3.5 h-3.5 text-brand-400" />
            {isBn ? 'কর্পোরেট ও প্রাতিষ্ঠানিক বাল্ক সাপ্লাই' : 'Corporate & Bulk Institutional Supply'}
          </span>
          <span className="hidden lg:inline-block text-brand-700">|</span>
          <span className="hidden lg:flex items-center gap-1.5 text-brand-200">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            {isBn ? '১০০% আসল পণ্যের নিশ্চয়তা' : '100% Genuine Commercial Quality'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <a
            href="tel:01404005680"
            className="flex items-center gap-1.5 text-brand-100 hover:text-white transition-colors font-medium"
          >
            <Phone className="w-3 h-3 text-brand-400" />
            <span>01404005680</span>
          </a>
          <span className="text-brand-700">|</span>
          <a
            href="/track-order"
            className="text-brand-200 hover:text-white transition-colors underline-offset-2 hover:underline"
          >
            {t.common.orderTracking}
          </a>
        </div>
      </div>
    </div>
  );
}
