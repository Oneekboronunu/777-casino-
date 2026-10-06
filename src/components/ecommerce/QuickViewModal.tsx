'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Check, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';
import { ProductVariant } from '@/types';
import { formatPrice } from '@/lib/formatters';

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, language, t, addToCart } = useStore();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!quickViewProduct) return null;

  const isBn = language === 'bn';
  const product = quickViewProduct;

  const currentVariant = selectedVariant || (product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
  const price = currentVariant ? (currentVariant.sale_price ?? currentVariant.price) : (product.sale_price ?? product.price);
  const originalPrice = currentVariant ? currentVariant.price : product.price;
  const hasDiscount = originalPrice > price;

  const handleAddToCart = () => {
    addToCart(product, quantity, currentVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl z-10 overflow-hidden animate-fade-in">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-square bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={isBn ? product.name_bn : product.name_en}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-lg border overflow-hidden transition-all ${
                      activeImageIndex === idx
                        ? 'border-brand-600 ring-2 ring-brand-100'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Brand & Stock */}
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-brand-700 uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isBn ? 'স্টকে আছে' : 'In Stock'}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {isBn ? product.name_bn : product.name_en}
              </h2>

              {/* SKU & Category */}
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                <span>SKU: {currentVariant ? currentVariant.sku : product.sku}</span>
                <span>•</span>
                <span>{isBn ? product.category_bn : product.category_en}</span>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-2.5 mt-3 pt-3 border-t border-slate-100">
                <span className="text-2xl font-bold text-slate-900">
                  {formatPrice(price, language)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(originalPrice, language)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="px-2 py-0.5 bg-brand-50 text-brand-700 text-xs font-bold rounded">
                    {isBn ? `সাশ্রয় ${formatPrice(originalPrice - price, language)}` : `Save ${formatPrice(originalPrice - price, language)}`}
                  </span>
                )}
              </div>

              {/* Description Snippet */}
              <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                {isBn ? product.description_bn : product.description_en}
              </p>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                    {isBn ? 'সাইজ নির্বাচন করুন:' : 'Select Size:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          (currentVariant?.id === v.id)
                            ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {v.size} — {formatPrice(v.sale_price ?? v.price, language)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity & CTA */}
            <div className="pt-4 mt-4 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-l"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-semibold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-r"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs ${
                    isAdded
                      ? 'bg-brand-700 text-white'
                      : 'bg-brand-600 hover:bg-brand-700 text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t.common.addedToCart}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t.common.addToCart}</span>
                    </>
                  )}
                </button>
              </div>

              <Link
                href={`/product/${product.slug_en}`}
                onClick={() => setQuickViewProduct(null)}
                className="w-full text-center text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center justify-center gap-1 py-1"
              >
                <span>{isBn ? 'সম্পূর্ণ বিবরণ ও স্পেসিফিকেশন দেখুন' : 'View Full Details & Specifications'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
