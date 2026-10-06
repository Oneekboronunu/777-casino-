'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';

export default function PrivacyPolicyPage() {
  const { language, t } = useStore();
  const isBn = language === 'bn';

  return (
    <div className="bg-slate-50/50 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-subtle space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 border-b border-slate-100 pb-4">
            {t.footer.privacyPolicy}
          </h1>

          <p>
            {isBn
              ? 'কার্নিভাল মার্ট আপনার ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা করতে প্রতিশ্রুতিবদ্ধ। এই নীতিমালায় বর্ণিত হয়েছে আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত রাখি।'
              : 'Carnival Mart is committed to safeguarding your privacy. This policy outlines how we collect, handle, and protect your information when using our website and services.'}
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-2">
            {isBn ? '১. তথ্য সংগ্রহ ও ব্যবহার' : '1. Information We Collect'}
          </h2>
          <p>
            {isBn
              ? 'অর্ডার প্রসেসিং, ডেলিভারি সম্পন্নকরণ এবং কাস্টমার সাপোর্টের জন্য আমরা আপনার নাম, ফোন নম্বর, ডেলিভারির ঠিকানা ও ইমেইল সংরক্ষণ করি। আমরা কোনো অননুমোদিত তৃতীয় পক্ষের সাথে আপনার সংবেদনশীল তথ্য শেয়ার করি না।'
              : 'We collect customer contact details such as name, phone number, shipping address, and email solely to process, verify, dispatch, and track orders.'}
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-2">
            {isBn ? '২. পেমেন্ট নিরাপত্তা' : '2. Payment Security'}
          </h2>
          <p>
            {isBn
              ? 'বিকাশ, নগদ এবং অনলাইন কার্ড পেমেন্ট সুরক্ষিত এনক্রিপ্টেড পেমেন্ট গেটওয়ের মাধ্যমে পরিচালিত হয়। আমরা আমাদের সার্ভারে কোনো কার্ডের পিন বা পাসওয়ার্ড সংরক্ষণ করি না।'
              : 'All digital mobile payments and card transactions are processed securely through certified banking gateways. We never store credit card numbers, CVVs, or mobile banking PINs.'}
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-2">
            {isBn ? '৩. যোগাযোগ' : '3. Contacting Us'}
          </h2>
          <p>
            {isBn
              ? 'যেকোনো প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করুন: mycarnivalxyz@gmail.com অথবা হটলাইন: 01404005680'
              : 'For any privacy concerns, reach out at mycarnivalxyz@gmail.com or call 01404005680.'}
          </p>
        </div>
      </div>
    </div>
  );
}
