import { Category } from '@/types';

export const CATEGORIES: Category[] = [
  {
    id: 'cleaning-supplies',
    slug: 'cleaning-supplies',
    name_en: 'Cleaning Supplies',
    name_bn: 'ক্লিনিং সাপ্লাইজ',
    description_en: 'High-performance floor cleaners, toilet cleaners, glass cleaners, and disinfectants.',
    description_bn: 'উচ্চমানের ফ্লোর ক্লিনার, টয়লেট ক্লিনার, গ্লাস ক্লিনার এবং জীবাণুনাশক।',
    icon: 'Sparkles',
    productCount: 14,
    featured: true,
    subcategories: [
      { id: 'floor-cleaner', slug: 'floor-cleaner', name_en: 'Floor Cleaner', name_bn: 'ফ্লোর ক্লিনার' },
      { id: 'toilet-cleaner', slug: 'toilet-cleaner', name_en: 'Toilet Cleaner', name_bn: 'টয়লেট ক্লিনার' },
      { id: 'glass-cleaner', slug: 'glass-cleaner', name_en: 'Glass Cleaner', name_bn: 'গ্লাস ক্লিনার' },
      { id: 'dish-wash', slug: 'dish-wash', name_en: 'Dish Wash', name_bn: 'ডিশ ওয়াশ' },
      { id: 'multi-purpose', slug: 'multi-purpose', name_en: 'Multi-Purpose Cleaner', name_bn: 'মাল্টি-পারপাস ক্লিনার' },
      { id: 'disinfectant', slug: 'disinfectant', name_en: 'Disinfectant & Antiseptic', name_bn: 'জীবাণুনাশক ও অ্যান্টিসেপটিক' },
    ]
  },
  {
    id: 'hygiene-personal-care',
    slug: 'hygiene-personal-care',
    name_en: 'Hygiene & Personal Care',
    name_bn: 'হাইজিন ও পার্সোনাল কেয়ার',
    description_en: 'Antibacterial hand wash, instant hand sanitizers, and personal hygiene essentials.',
    description_bn: 'অ্যান্টিব্যাকটেরিয়াল হ্যান্ড ওয়াশ, ইনস্ট্যান্ট স্যানিটাইজার এবং হাইজিন পণ্য।',
    icon: 'ShieldCheck',
    productCount: 10,
    featured: true,
    subcategories: [
      { id: 'hand-wash', slug: 'hand-wash', name_en: 'Hand Wash', name_bn: 'হ্যান্ড ওয়াশ' },
      { id: 'hand-sanitizer', slug: 'hand-sanitizer', name_en: 'Hand Sanitizer', name_bn: 'হ্যান্ড স্যানিটাইজার' },
      { id: 'liquid-soap', slug: 'liquid-soap', name_en: 'Liquid Soap', name_bn: 'লিকুইড সোপ' },
      { id: 'hygiene-products', slug: 'hygiene-products', name_en: 'Hygiene Products', name_bn: 'হাইজিন প্রোডাক্টস' },
    ]
  },
  {
    id: 'air-care',
    slug: 'air-care',
    name_en: 'Air Care & Fragrance',
    name_bn: 'এয়ার কেয়ার ও সুগন্ধি',
    description_en: 'Long-lasting room fresheners, aerosol sprays, and premium fragrances.',
    description_bn: 'দীর্ঘস্থায়ী রুম ফ্রেশনার, অ্যারোসল স্প্রে এবং প্রিমিয়াম সুবাস।',
    icon: 'Wind',
    productCount: 8,
    featured: true,
    subcategories: [
      { id: 'room-freshener', slug: 'room-freshener', name_en: 'Room Freshener', name_bn: 'রুম ফ্রেশনার' },
      { id: 'aerosol', slug: 'aerosol', name_en: 'Aerosol Spray', name_bn: 'অ্যারোসল স্প্রে' },
      { id: 'liquid-freshener', slug: 'liquid-freshener', name_en: 'Liquid Air Freshener', name_bn: 'লিকুইড এয়ার ফ্রেশনার' },
      { id: 'fragrance', slug: 'fragrance', name_en: 'Institutional Fragrance', name_bn: 'সুগন্ধি' },
    ]
  },
  {
    id: 'laundry-fabric-care',
    slug: 'laundry-fabric-care',
    name_en: 'Laundry & Fabric Care',
    name_bn: 'লন্ড্রি ও ফ্যাব্রিক কেয়ার',
    description_en: 'Heavy-duty detergent powders, fabric softeners, and liquid detergents.',
    description_bn: 'হেভি-ডিউটি ডিটারজেন্ট পাউডার, ফ্যাব্রিক সফটনার ও লিকুইড ডিটারজেন্ট।',
    icon: 'Shirt',
    productCount: 6,
    featured: true,
    subcategories: [
      { id: 'detergent', slug: 'detergent', name_en: 'Detergent Powder', name_bn: 'ডিটারজেন্ট পাউডার' },
      { id: 'fabric-care', slug: 'fabric-care', name_en: 'Fabric Care & Liquid', name_bn: 'ফ্যাব্রিক কেয়ার' },
    ]
  },
  {
    id: 'household-accessories',
    slug: 'household-accessories',
    name_en: 'Household Accessories',
    name_bn: 'গৃহস্থালী ও এক্সেসরিজ',
    description_en: 'Durable mops, microfibers, wipers, spray bottles, and cleaning tools.',
    description_bn: 'টেকসই মপ, মাইক্রোফাইবার, ওয়াইপার, স্প্রে বোতল এবং ক্লিনিং সরঞ্জাম।',
    icon: 'Home',
    productCount: 9,
    featured: true,
    subcategories: [
      { id: 'cleaning-accessories', slug: 'cleaning-accessories', name_en: 'Cleaning Tools & Mops', name_bn: 'ক্লিনিং টুলস ও মপ' },
      { id: 'general-supplies', slug: 'general-supplies', name_en: 'General Household Supplies', name_bn: 'সাধারণ সাপ্লাই' },
    ]
  },
  {
    id: 'corporate-institutional',
    slug: 'corporate-institutional',
    name_en: 'Corporate & Institutional',
    name_bn: 'কর্পোরেট ও প্রাতিষ্ঠানিক',
    description_en: 'Bulk cleaning supplies for hospitals, restaurants, hotels, schools, and offices.',
    description_bn: 'হাসপাতাল, রেস্তোরাঁ, হোটেল, স্কুল এবং অফিসের জন্য বাল্ক ক্লিনিং পণ্য।',
    icon: 'Building2',
    productCount: 12,
    featured: true,
    subcategories: [
      { id: 'bulk-supplies', slug: 'bulk-supplies', name_en: 'Bulk Cleaning 5L/20L', name_bn: 'বাল্ক সাপ্লাই ৫ লিটার' },
      { id: 'office-hygiene', slug: 'office-hygiene', name_en: 'Office Hygiene Kits', name_bn: 'অফিস হাইজিন কিট' },
      { id: 'hospital-cleaning', slug: 'hospital-cleaning', name_en: 'Hospital-Grade Disinfection', name_bn: 'হাসপাতাল ক্লিনিং' },
      { id: 'restaurant-cleaning', slug: 'restaurant-cleaning', name_en: 'Restaurant & Kitchen Supplies', name_bn: 'রেস্তোরাঁ ও কিচেন সাপ্লাই' },
      { id: 'hotel-cleaning', slug: 'hotel-cleaning', name_en: 'Hotel Housekeeping Supplies', name_bn: 'হোটেল হাউসকিপিং' },
    ]
  }
];
