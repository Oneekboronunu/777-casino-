'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';

export default function TermsPage() {
  const { language, t } = useStore();
  const isBn = language === 'bn';

  return (
    <div className="bg-slate-50/50 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-subtle space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 border-b border-slate-100 pb-4">
            {t.footer.terms}
          </h1>

          <p>
            {isBn
              ? 'কার্নিভাল মার্ট ওয়েবসাইট ব্যবহারের মাধ্যমে আপনি আমাদের ব্যবহারের নিয়মাবলী ও শর্তাবলীর সাথে সম্মত হচ্ছেন।'
              : 'By browsing, registering, or ordering products on Carnival Mart, you agree to comply with our Terms of Service.'}
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-2">
            {isBn ? '১. অর্ডার ও মূল্য পরিশোধ' : '1. Orders & Pricing'}
          </h2>
          <p>
            {isBn
              ? 'ওয়েবসাইটে প্রদর্শিত সকল মূল্য বাংলাদেশি টাকায় (৳) নির্ধারিত। অর্ডার নিশ্চিতকরণের পর কাস্টমার কেয়ার থেকে কল করে ঠিকানা ও অর্ডার কনফার্ম করা হবে।'
              : 'All product prices are quoted in Bangladeshi Taka (৳). Orders are verified via telephone prior to dispatch from our central distribution hubs.'}
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-2">
            {isBn ? '২. ডেলিভারি ও প্যাকেজিং' : '2. Dispatch & Logistics'}
          </h2>
          <p>
            {isBn
              ? 'আমরা তরল ও লিকুইড ক্লিনিং পণ্য সুরক্ষিত সিল ও স্পিল-প্রুফ বাক্সে প্যাকেজিং করি। গ্রাহককে ডেলিভারি গ্রহণের সময় পার্সেলটি যাচাই করে গ্রহণের অনুরোধ করা হচ্ছে।'
              : 'Liquid cleaners and canisters are packaged with anti-leak seals. Customers are encouraged to inspect packaging upon delivery.'}
          </p>
        </div>
      </div>
    </div>
  );
}
