'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Eye, Check } from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { useStore } from '@/lib/store/useStore';
import { formatPrice } from '@/lib/formatters';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { language, t, addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [isAdded, setIsAdded] = useState(false);

  const isBn = language === 'bn';
  const isFavorited = isInWishlist(product.id);

  const currentPrice = selectedVariant
    ? (selectedVariant.sale_price ?? selectedVariant.price)
    : (product.sale_price ?? product.price);

  const originalPrice = selectedVariant ? selectedVariant.price : product.price;
  const hasDiscount = (selectedVariant?.sale_price && selectedVariant.sale_price < selectedVariant.price) ||
    (!selectedVariant && product.sale_price && product.sale_price < product.price);

  const savingsAmount = originalPrice - currentPrice;
  const currentSize = selectedVariant ? selectedVariant.size : product.size;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, selectedVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className={`group relative bg-white rounded-xl border border-slate-200/80 hover:border-brand-400 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden ${className}`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden p-4 flex items-center justify-center">
        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          {hasDiscount && (
            <span className="px-2 py-0.5 bg-brand-600 text-white text-[10px] font-bold rounded-sm uppercase tracking-wider shadow-xs">
              {isBn ? product.offer_tag_bn || `সাশ্রয় ${formatPrice(savingsAmount, language)}` : product.offer_tag_en || `SAVE ${formatPrice(savingsAmount, language)}`}
            </span>
          )}
          {product.featured && (
            <span className="px-1.5 py-0.5 bg-slate-900 text-white text-[9px] font-semibold rounded-xs">
              {isBn ? 'পপুলার' : 'Popular'}
            </span>
          )}
        </div>

        {/* Wishlist & QuickView Actions */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              isFavorited
                ? 'bg-rose-50 text-rose-500 shadow-xs'
                : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white shadow-xs'
            }`}
            aria-label="Save to wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleQuickView}
            className="p-1.5 rounded-full bg-white/90 text-slate-500 hover:text-brand-600 hover:bg-white shadow-xs opacity-0 group-hover:opacity-100 transition-all duration-200 hidden sm:block"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Product Image */}
        <Link href={`/product/${product.slug_en}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.images[0]}
            alt={isBn ? product.name_bn : product.name_en}
            loading="lazy"
            className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Product Content Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Size Header */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-brand-700 tracking-wide uppercase text-[11px]">
              {product.brand}
            </span>
            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-medium rounded text-[11px]">
              {currentSize}
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug_en}`} className="block group-hover:text-brand-600 transition-colors">
            <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 leading-snug">
              {isBn ? product.name_bn : product.name_en}
            </h3>
          </Link>

          {/* Variant Selector Pills if product has variants */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-all ${
                    selectedVariant?.id === v.id
                      ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Price Block */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-900">
                {formatPrice(currentPrice, language)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(originalPrice, language)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="text-[10px] text-brand-600 font-semibold">
                {isBn ? `সাশ্রয় ${formatPrice(savingsAmount, language)}` : `Save ${formatPrice(savingsAmount, language)}`}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs shrink-0 ${
              isAdded
                ? 'bg-brand-700 text-white'
                : 'bg-brand-600 hover:bg-brand-700 text-white active:scale-95'
            } ${product.stock <= 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : ''}`}
            aria-label={t.common.addToCart}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{isBn ? 'যুক্ত' : 'Added'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t.common.addToCart}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
