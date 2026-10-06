'use client';

import React, { useState } from 'react';
import HeroSection from '@/components/home/HeroSection';
import QuickCategories from '@/components/home/QuickCategories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import OfferSection from '@/components/home/OfferSection';
import CorporateSolutionsSection from '@/components/home/CorporateSolutionsSection';
import WhyCarnivalMart from '@/components/home/WhyCarnivalMart';
import FAQSection from '@/components/home/FAQSection';
import CorporateQuoteModal from '@/components/ecommerce/CorporateQuoteModal';

export default function HomePage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <HeroSection onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

      {/* 2. Popular Categories */}
      <QuickCategories />

      {/* 3. Featured Products */}
      <FeaturedProducts />

      {/* 4. Current Offers & 5L Mega Bundles */}
      <OfferSection />

      {/* 5. Corporate Solutions */}
      <CorporateSolutionsSection onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

      {/* 6. Why Carnival Mart (Trust Section) */}
      <WhyCarnivalMart />

      {/* 7. FAQ Section */}
      <FAQSection />

      {/* Corporate Quote Interactive Modal */}
      <CorporateQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
}
