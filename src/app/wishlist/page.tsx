'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import ProductCard from '@/components/ecommerce/ProductCard';
import { useStore } from '@/lib/store/useStore';

export default function WishlistPage() {
  const { wishlist, language, t } = useStore();
  const isBn = language === 'bn';

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-slate-50/50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>{t.common.wishlist}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isBn
              ? `আপনার পছন্দের তালিকায় মোট ${wishlistedProducts.length}টি পণ্য রয়েছে`
              : `You have saved ${wishlistedProducts.length} items`}
          </p>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              {isBn ? 'আপনার পছন্দের তালিকা খালি' : 'Your wishlist is empty'}
            </h2>
            <p className="text-xs text-slate-500">
              {isBn
                ? 'পণ্য ব্রাউজ করার সময় হার্ট আইকনে ক্লিক করে পছন্দের পণ্য সংরক্ষণ করুন।'
                : 'Click the heart icon on any product to save it for later.'}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 transition-colors"
            >
              <span>{t.cart.startShopping}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
