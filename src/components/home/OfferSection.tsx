'use client';

import React from 'react';
import Link from 'next/link';
import { Tag, Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { useStore } from '@/lib/store/useStore';
import { formatPrice } from '@/lib/formatters';

export default function OfferSection() {
  const { language, t, addToCart } = useStore();
  const isBn = language === 'bn';

  // Mega bundle product
  const megaBundle = PRODUCTS.find((p) => p.id === 'cm-prod-010') || PRODUCTS[0];
  const otherOffers = PRODUCTS.filter((p) => p.offer && p.id !== megaBundle.id).slice(0, 3);

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <span>{isBn ? 'সাশ্রয়ী অফার ও বান্ডেল' : 'High-Value Bundles'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t.sections.offerTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            {t.sections.offerSub}
          </p>
        </div>

        {/* Highlighted Banner Card for Mega Bundle */}
        <div className="bg-gradient-to-br from-brand-900 to-slate-900 rounded-2xl text-white p-6 sm:p-8 lg:p-10 shadow-elevated mb-8 overflow-hidden relative">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wide">
                <span>{isBn ? megaBundle.offer_tag_bn : megaBundle.offer_tag_en}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                {isBn ? megaBundle.name_bn : megaBundle.name_en}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                {isBn ? megaBundle.description_bn : megaBundle.description_en}
              </p>

              {/* Checklist items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isBn ? '৪টি আলাদা ৫ লিটার ক্যান (মোট ২০ লিটার)' : '4x 5L Cans (Total 20 Liters)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isBn ? 'সারাদেশে সম্পূর্ণ ফ্রি হোম ডেলিভারি' : 'Free Nationwide Doorstep Delivery'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isBn ? 'ফ্লোর, টয়লেট, হাত ও গ্লাস সলিউশন' : 'Complete 4-in-1 Hygiene Coverage'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isBn ? 'সাশ্রয় মোট ৫৫০ টাকা' : 'Guaranteed ৳550 Direct Savings'}</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-4 flex flex-wrap items-baseline gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">
                    {formatPrice(megaBundle.sale_price ?? megaBundle.price, language)}
                  </span>
                  <span className="text-base text-slate-400 line-through">
                    {formatPrice(megaBundle.price, language)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(megaBundle, 1)}
                  className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
                >
                  {t.common.addToCart}
                </button>

                <Link
                  href={`/product/${megaBundle.slug_en}`}
                  className="text-xs text-slate-300 hover:text-white underline underline-offset-4 flex items-center gap-1"
                >
                  <span>{isBn ? 'বিস্তারিত দেখুন' : 'View Bundle Details'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Image Container */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-sm aspect-4/3 rounded-xl overflow-hidden bg-slate-800/80 border border-slate-700 shadow-2xl p-2">
                <img
                  src={megaBundle.images[0]}
                  alt={isBn ? megaBundle.name_bn : megaBundle.name_en}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3 Secondary 5L Value Deals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {otherOffers.map((item) => {
            const price = item.sale_price ?? item.price;
            const original = item.price;
            const savings = original - price;

            return (
              <div
                key={item.id}
                className="bg-slate-50 hover:bg-white rounded-xl border border-slate-200 p-4 transition-all hover:shadow-card-hover flex items-center justify-between gap-4"
              >
                <div className="w-20 h-20 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0">
                  <img
                    src={item.images[0]}
                    alt={isBn ? item.name_bn : item.name_en}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-brand-700 font-bold uppercase">
                    <span>{item.brand}</span>
                    <span>•</span>
                    <span>{item.size}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                    {isBn ? item.name_bn : item.name_en}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-bold text-slate-900">
                      {formatPrice(price, language)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {formatPrice(original, language)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(item, 1)}
                  className="p-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors shrink-0 shadow-xs"
                  aria-label="Add to cart"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
