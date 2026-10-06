'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  Check,
  Building,
  Sparkles,
  PhoneCall,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { useStore } from '@/lib/store/useStore';
import { ProductVariant } from '@/types';
import { formatPrice, getProductSchema } from '@/lib/formatters';
import ProductCard from '@/components/ecommerce/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { language, t, addToCart, toggleWishlist, isInWishlist } = useStore();
  const isBn = language === 'bn';

  // Find product by slug (English or Bengali slug)
  const product = useMemo(() => {
    return PRODUCTS.find(
      (p) => p.slug_en === slug || p.slug_bn === slug || p.id === slug
    ) || PRODUCTS[0];
  }, [slug]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'features' | 'howTo' | 'specs' | 'delivery'>('desc');
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const currentPrice = selectedVariant
    ? (selectedVariant.sale_price ?? selectedVariant.price)
    : (product.sale_price ?? product.price);

  const originalPrice = selectedVariant ? selectedVariant.price : product.price;
  const hasDiscount = originalPrice > currentPrice;
  const savings = originalPrice - currentPrice;
  const currentSize = selectedVariant ? selectedVariant.size : product.size;
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;

  // Related products from same category
  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter(
      (p) => p.id !== product.id && (p.category_id === product.category_id || p.brand === product.brand)
    ).slice(0, 4);
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    router.push('/checkout');
  };

  const productSchema = getProductSchema(product);

  return (
    <div className="bg-white py-8 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-slate-700 transition-colors">
            {t.common.home}
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-slate-700 transition-colors">
            {t.common.products}
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category_id}`}
            className="hover:text-slate-700 transition-colors"
          >
            {isBn ? product.category_bn : product.category_en}
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium truncate max-w-xs">
            {isBn ? product.name_bn : product.name_en}
          </span>
        </nav>

        {/* Product Main Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Gallery Column */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage Image */}
            <div className="aspect-square bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative group p-4 flex items-center justify-center">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={isBn ? product.name_bn : product.name_en}
                className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
              />

              {hasDiscount && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 bg-brand-600 text-white text-xs font-bold rounded-md uppercase tracking-wide shadow-xs">
                    {isBn ? `সাশ্রয় ${formatPrice(savings, language)}` : `SAVE ${formatPrice(savings, language)}`}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl border-2 overflow-hidden transition-all ${
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

          {/* Right: Product Details & Purchase Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              {/* Brand & Stock Pill */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-brand-700 uppercase tracking-wider text-xs">
                  {product.brand}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.common.inStock}</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {isBn ? product.name_bn : product.name_en}
              </h1>

              {/* SKU & Meta */}
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                <span>SKU: <strong className="text-slate-700">{currentSku}</strong></span>
                <span>•</span>
                <span>{isBn ? product.category_bn : product.category_en}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.review_count} {isBn ? 'রিভিউ' : 'reviews'})</span>
                </span>
              </div>
            </div>

            {/* Price Block */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  {formatPrice(currentPrice, language)}
                </span>
                {hasDiscount && (
                  <span className="text-base sm:text-lg text-slate-400 line-through">
                    {formatPrice(originalPrice, language)}
                  </span>
                )}
              </div>

              {hasDiscount && (
                <div className="text-xs text-brand-700 font-semibold mt-1">
                  {isBn
                    ? `আপনি পাচ্ছেন সরাসরি ${formatPrice(savings, language)} মূল্য ছাড়!`
                    : `Direct savings of ${formatPrice(savings, language)} on this order!`}
                </div>
              )}
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  {isBn ? 'সাইজ / পরিমাণ নির্বাচন করুন:' : 'Select Size / Volume:'}
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        (selectedVariant?.id === v.id)
                          ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span>{v.size}</span>
                      <span className="ml-2 opacity-80 font-bold">
                        {formatPrice(v.sale_price ?? v.price, language)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & CTA Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Spinner */}
                <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-3 text-slate-600 hover:bg-slate-100 rounded-l-xl font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-3 text-slate-600 hover:bg-slate-100 rounded-r-xl font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all ${
                    isAdded
                      ? 'bg-brand-700 text-white'
                      : 'bg-brand-600 hover:bg-brand-700 text-white active:scale-98'
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

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 border rounded-xl transition-colors shadow-xs ${
                    isFavorited
                      ? 'border-rose-200 bg-rose-50 text-rose-500'
                      : 'border-slate-300 text-slate-600 hover:text-rose-500 hover:border-slate-400 bg-white'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Direct Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <span>{t.common.buyNow}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Key Delivery Assurance Badges */}
            <div className="border-t border-slate-200 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-lg">
                <Truck className="w-4 h-4 text-brand-600 shrink-0" />
                <span>{isBn ? 'সারা দেশে দ্রুত হোম ডেলিভারি' : 'Nationwide Doorstep Delivery'}</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
                <span>{isBn ? '১০০% আসল পণ্যের গ্যারান্টি' : '100% Genuine Guaranteed'}</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-lg">
                <Building className="w-4 h-4 text-brand-600 shrink-0" />
                <span>{isBn ? 'কর্পোরেট বাল্ক অর্ডার সুবিধা' : 'Corporate Bulk Invoicing Available'}</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-lg">
                <PhoneCall className="w-4 h-4 text-brand-600 shrink-0" />
                <span>{isBn ? 'অর্ডারে সাহায্য: 01404005680' : 'Order Support: 01404005680'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Description, Features, How to Use, Specs */}
        <div className="mt-14 pt-8 border-t border-slate-200">
          <div className="flex border-b border-slate-200 gap-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'desc'
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {isBn ? 'পণ্যের বিবরণ' : 'Description'}
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'features'
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {isBn ? 'বৈশিষ্ট্য ও সুবিধা' : 'Features & Benefits'}
            </button>
            <button
              onClick={() => setActiveTab('howTo')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'howTo'
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {isBn ? 'ব্যবহারবিধি' : 'How to Use'}
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {isBn ? 'স্পেসিফিকেশন' : 'Specifications'}
            </button>
          </div>

          <div className="py-6 max-w-4xl">
            {activeTab === 'desc' && (
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                <p>{isBn ? product.description_bn : product.description_en}</p>
              </div>
            )}

            {activeTab === 'features' && (
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                {(isBn ? product.features_bn : product.features_en).map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'howTo' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <span>{isBn ? 'ব্যবহারের নিয়মাবলী' : 'Application Instructions'}</span>
                </h4>
                <p>{isBn ? product.how_to_use_bn : product.how_to_use_en}</p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {Object.entries(product.specifications).map(([key, value], i) => (
                  <div key={i} className="grid grid-cols-3 p-3 text-xs">
                    <span className="font-semibold text-slate-500">{key}</span>
                    <span className="col-span-2 text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              {isBn ? 'সম্পর্কিত অন্যান্য পণ্য' : 'Related Products in this Category'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
