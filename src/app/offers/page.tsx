'use client';

import React from 'react';
import Link from 'next/link';
import { Tag, Sparkles, Percent, ShieldCheck, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import ProductCard from '@/components/ecommerce/ProductCard';
import { useStore } from '@/lib/store/useStore';

export default function OffersPage() {
  const { language, t } = useStore();
  const isBn = language === 'bn';

  const offerProducts = PRODUCTS.filter(
    (p) => p.offer || (p.sale_price && p.sale_price < p.price)
  );

  return (
    <div className="bg-slate-50/50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Percent className="w-3.5 h-3.5 text-amber-600" />
            <span>{isBn ? 'স্পেশাল ডিসকাউন্ট ও কম্বো' : 'Special Discounts & Combos'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            {isBn ? 'কার্নিভাল মার্ট বিশেষ অফারসমূহ' : 'Carnival Mart Exclusive Offers'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {isBn
              ? 'আমাদের ৫ লিটার মেগা জার ও কম্বো বান্ডেলে উপভোগ করুন সর্বোচ্চ সাশ্রয়।'
              : 'Save more on household essentials, commercial bulk canisters, and mega value packs.'}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {offerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
