'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import ProductCard from '@/components/ecommerce/ProductCard';
import { PRODUCTS } from '@/data/products';
import { useStore } from '@/lib/store/useStore';

export default function FeaturedProducts() {
  const { language, t } = useStore();
  const [activeTab, setActiveTab] = useState('all');

  const isBn = language === 'bn';

  const filterTabs = [
    { id: 'all', label_en: 'All Products', label_bn: 'সকল পণ্য' },
    { id: 'cleaning-supplies', label_en: 'Cleaning Supplies', label_bn: 'ক্লিনিং সাপ্লাইজ' },
    { id: 'hygiene-personal-care', label_en: 'Hygiene & Care', label_bn: 'হাইজিন ও সাবান' },
    { id: 'corporate-institutional', label_en: 'Bulk & Combos', label_bn: 'বাল্ক ও কম্বো প্যাক' },
  ];

  const filteredProducts = activeTab === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category_id === activeTab);

  return (
    <section className="py-12 bg-slate-50/60 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              <span>{isBn ? 'জনপ্রিয় ও বেস্টসেলার' : 'Popular & Bestsellers'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {t.sections.featuredTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              {t.sections.featuredSub}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {isBn ? tab.label_bn : tab.label_en}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <span>{isBn ? 'সম্পূর্ণ ক্যাটালগ দেখুন' : 'Explore Complete Product Catalog'}</span>
            <ArrowRight className="w-4 h-4 text-brand-600" />
          </Link>
        </div>
      </div>
    </section>
  );
}
