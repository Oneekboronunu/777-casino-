'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';

export default function RefundPolicyPage() {
  const { language, t } = useStore();
  const isBn = language === 'bn';

  return (
    <div className="bg-slate-50/50 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-subtle space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 border-b border-slate-100 pb-4">
            {t.footer.refundPolicy}
          </h1>

          <p>
            {isBn
              ? 'কার্নিভাল মার্ট গ্রাহকের সর্বোচ্চ সন্তুষ্টি নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। পণ্য পাওয়ার পর কোনো সমস্যা বা ত্রুটি থাকলে আমাদের সহজ রিটার্ন ও রিফান্ড নীতি প্রযোজ্য হবে।'
              : 'Carnival Mart is committed to delivering flawless products. If you experience damaged packaging, leaks, or incorrect items, our return policy guarantees prompt resolution.'}
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-2">
            {isBn ? '১. রিটার্ন যোগ্যতার শর্তাবলী' : '1. Return Eligibility'}
          </h2>
          <p>
            {isBn
              ? 'ডেলিভারির সময় বোতল লিক হওয়া, সিল ভাঙা বা ভুল পণ্য পৌঁছালে ডেলিভারি ম্যানের উপস্থিতিতেই সরাসরি রিটার্ন করা যাবে অথবা ৪৮ ঘণ্টার মধ্যে আমাদের হটলাইনে কল করতে হবে।'
              : 'Damaged or leaking containers must be reported within 48 hours of delivery along with photographic evidence to our support line.'}
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-2">
            {isBn ? '২. রিফান্ড প্রক্রিয়া' : '2. Refund Timelines'}
          </h2>
          <p>
            {isBn
              ? 'অনলাইন বা মোবাইল ব্যাংকিংয়ে পরিশোধিত অগ্রিম পেমেন্টের ক্ষেত্রে রিটার্ন নিশ্চিতকরণের ৩ থেকে ৫ কার্যদিবসের মধ্যে মূল পেমেন্ট মাধ্যমে টাকা ফেরত দেওয়া হবে।'
              : 'Refunds for prepaid digital transactions are credited back to the original source (bKash/Nagad/Bank) within 3 to 5 business days.'}
          </p>
        </div>
      </div>
    </div>
  );
}
