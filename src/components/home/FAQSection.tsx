'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

export default function FAQSection() {
  const { language, t } = useStore();
  const isBn = language === 'bn';
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q_en: 'How long does nationwide delivery take in Bangladesh?',
      q_bn: 'সারা দেশে ডেলিভারি হতে কত সময় লাগে?',
      a_en: 'For Dhaka & Savar areas, delivery takes 24 to 48 hours. For all other districts across Bangladesh, delivery is completed within 2 to 4 business days via reliable courier partners with spill-proof packaging.',
      a_bn: 'ঢাকা ও সাভার এলাকায় সাধারণত ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি সম্পন্ন হয়। অন্যান্য সকল জেলায় ২ থেকে ৪ কার্যদিবসের মধ্যে সুরক্ষিত প্যাকেজিংয়ে হোম ডেলিভারি পৌঁছে দেওয়া হয়।',
    },
    {
      q_en: 'Can corporate clients and hospitals get bulk discounts?',
      q_bn: 'কর্পোরেট প্রতিষ্ঠান ও হাসপাতাল কি বাল্ক ডিসকাউন্ট পেতে পারে?',
      a_en: 'Yes! We offer tiered volume pricing, customized quotation sheets, monthly scheduled supply contracts, and formal corporate billing for offices, hospitals, restaurants, schools, and factories.',
      a_bn: 'হ্যাঁ! হাসপাতাল, অফিস, রেস্তোরাঁ ও শিক্ষা প্রতিষ্ঠানের জন্য বিশেষ পাইকারি মূল্য, মাসিক সরবরাহ চুক্তি এবং কর্পোরেট ইনভয়েস সুবিধা প্রদান করা হয়।',
    },
    {
      q_en: 'What payment methods are supported?',
      q_bn: 'কি কি মাধ্যমে পেমেন্ট পরিশোধ করা যায়?',
      a_en: 'We support Cash on Delivery (COD) across all districts, as well as bKash, Nagad mobile banking, and major Debit/Credit cards.',
      a_bn: 'ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে মূল্য পরিশোধ), বিকাশ, নগদ এবং ডেবিট/ক্রেডিট কার্ডের মাধ্যমে পেমেন্ট করা যায়।',
    },
    {
      q_en: 'Are the cleaning chemicals safe for homes with children and pets?',
      q_bn: 'পণ্যগুলো কি শিশু ও পোষা প্রাণীর জন্য নিরাপদ?',
      a_en: 'Our products are formulated following safe BSTI standards with non-corrosive, pH-balanced formulas. Follow dilution instructions printed on the label for optimal safety and performance.',
      a_bn: 'আমাদের সকল পণ্য বিএসটিআই ও আন্তর্জাতিক মান অনুযায়ী প্রস্তুত এবং পিএইচ ব্যালান্সড। বোতলের গায়ের ব্যবহারবিধি অনুযায়ী পানি মিশিয়ে নিরাপদভাবে ব্যবহার করা যায়।',
    },
  ];

  return (
    <section className="py-14 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
            <span>{isBn ? 'সাধারণ প্রশ্নোত্তর' : 'FAQ'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t.sections.faqTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            {t.sections.faqSub}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {isBn ? faq.q_bn : faq.q_en}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 pt-2 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in">
                    {isBn ? faq.a_bn : faq.a_en}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
