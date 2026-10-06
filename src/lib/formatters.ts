import { Product, Language } from '@/types';

// Convert English numbers to Bengali numerals when in Bengali mode
export function toBengaliNumerals(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
}

// Format currency with Bangladesh Taka symbol
export function formatPrice(amount: number, language: Language = 'en'): string {
  const formatted = amount.toLocaleString('en-US');
  if (language === 'bn') {
    return `৳${toBengaliNumerals(formatted)}`;
  }
  return `৳${formatted}`;
}

// Calculate discount percentage
export function getDiscountPercentage(original: number, sale?: number): number {
  if (!sale || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
}

// Generate Organization JSON-LD
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Carnival Mart',
    url: 'https://mycarnivalbd.com',
    logo: 'https://mycarnivalbd.com/logo.png',
    description: 'Corporate & Household Cleaning Solutions and Hygiene Products in Bangladesh',
    telephone: '01404005680',
    email: 'mycarnivalxyz@gmail.com',
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: '99/29-Dendabor, Savar Cant.',
        addressLocality: 'Savar, Dhaka',
        addressCountry: 'BD',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: '0608 - Mission Road',
        addressLocality: 'Chandpur',
        addressCountry: 'BD',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '01404005680',
      contactType: 'customer service',
      areaServed: 'BD',
      availableLanguage: ['Bengali', 'English'],
    },
  };
}

// Generate Product JSON-LD Schema
export function getProductSchema(product: Product) {
  const currentPrice = product.sale_price ?? product.price;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name_en,
    image: product.images,
    description: product.description_en,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `https://mycarnivalbd.com/product/${product.slug_en}`,
      priceCurrency: 'BDT',
      price: currentPrice,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Carnival Mart',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.review_count,
    },
  };
}
