import { Product } from '@/types';

export const PRODUCTS: Product[] = [
  {
    id: 'cm-prod-001',
    sku: 'AM-FLC-5L-LMN',
    name_en: 'AMANA Floor Cleaner Lemon Fresh',
    name_bn: 'আমনা ফ্লোর ক্লিনার লেমন ফ্রেশ',
    slug_en: 'amana-floor-cleaner-lemon-5l',
    slug_bn: 'amana-floor-cleaner-lemon-5l',
    brand: 'AMANA',
    category_id: 'cleaning-supplies',
    category_en: 'Cleaning Supplies',
    category_bn: 'ক্লিনিং সাপ্লাইজ',
    subcategory_id: 'floor-cleaner',
    subcategory_en: 'Floor Cleaner',
    subcategory_bn: 'ফ্লোর ক্লিনার',
    description_en: 'AMANA Floor Cleaner Lemon Fresh provides 99.9% germ protection while leaving a streak-free, gleaming shine and an invigorating lemon citrus fragrance. Ideal for tiles, marble, granite, mosaic, and vinyl floors across homes and corporate spaces.',
    description_bn: 'আমনা ফ্লোর ক্লিনার লেমন ফ্রেশ ৯৯.৯% জীবাণু ধ্বংস করে এবং মেঝেতে দাগহীন উজ্জ্বলতা ও দীর্ঘস্থায়ী লেবুর সতেজ সুবাস এনে দেয়। বাসা-বাড়ি, অফিস ও বাণিজ্যিক ফ্লোরের জন্য উপযোগী।',
    features_en: [
      'Eliminates 99.9% of bacteria and common household pathogens',
      'Streak-free quick-drying formula with sparkling shine',
      'Long-lasting natural lemon zest aroma',
      'Safe on marble, ceramic tile, granite, and polished concrete',
      'Economical corporate & household concentrate'
    ],
    features_bn: [
      '৯৯.৯% জীবাণু ও ক্ষতিকর ব্যাকটেরিয়া দূর করে',
      'দাগহীন দ্রুত শুকিয়ে যাওয়ার ফর্মুলা ও ঝকঝকে উজ্জ্বলতা',
      'দীর্ঘস্থায়ী প্রাকৃতিক লেবুর সতেজ সুবাস',
      'মার্বেল, সিরামিক টাইলস, গ্রানাইট ও মোজাইকের জন্য সম্পূর্ণ নিরাপদ',
      'সাশ্রয়ী ও ঘন ফর্মুলেশন'
    ],
    how_to_use_en: 'Mix 1 cap (approx. 20-30ml) into half a bucket of clean water (approx. 4-5 liters). Gently mop the floor surface. No rinsing required.',
    how_to_use_bn: 'আধা বালতি পরিষ্কার পানিতে (প্রায় ৪-৫ লিটার) ১ ক্যাপ (২০-৩০ মিলি) ক্লিনার মিশিয়ে নিন। মপ দিয়ে আলতোভাবে মেঝে মুছে নিন। পুনরায় পানি দিয়ে ধোয়ার প্রয়োজন নেই।',
    specifications: {
      'Volume / Size': '5 Liters (5000ml)',
      'Form': 'Concentrated Liquid',
      'Scent': 'Citrus Lemon',
      'Application': 'Floor & Hard Surface Sanitization',
      'pH Level': 'Neutral 7.0 - 7.5 (Non-corrosive)',
      'Country of Origin': 'Bangladesh'
    },
    price: 750,
    sale_price: 650,
    currency: 'BDT',
    size: '5 L',
    unit: 'L',
    variants: [
      { id: 'v-flc-1l', size: '1 L', unit: 'L', price: 190, sale_price: 170, sku: 'AM-FLC-1L-LMN', stock: 85 },
      { id: 'v-flc-5l', size: '5 L', unit: 'L', price: 750, sale_price: 650, sku: 'AM-FLC-5L-LMN', stock: 120 }
    ],
    images: [
      'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 120,
    featured: true,
    popular: true,
    new: false,
    offer: true,
    offer_tag_en: 'SAVE ৳100',
    offer_tag_bn: '৳১০০ সাশ্রয়',
    tags: ['Floor Cleaner', '5L', 'Lemon', 'Disinfection', 'AMANA', 'Corporate Cleaning'],
    rating: 4.9,
    review_count: 86,
    keywords_en: ['floor cleaner', 'floor wash', 'lemon cleaner', 'tile cleaner', '5 liter floor cleaner', 'amana floor cleaner', 'disinfectant liquid'],
    keywords_bn: ['ফ্লোর ক্লিনার', 'মেঝে পরিষ্কার', 'আমনা ফ্লোর ক্লিনার', 'লেমন ফ্লোর ক্লিনার', '৫ লিটার ফ্লোর ক্লিনার', 'টাইলস ক্লিনার'],
    search_aliases: [
      'floor cleaner', 'floor kliner', 'floor cleanar', '5 liter floor', '5l floor',
      'amana', 'lemon floor cleaner', 'ফ্লোর ক্লিনার', 'লেবু ফ্লোর ক্লিনার', 'flur cleaner'
    ]
  },
  {
    id: 'cm-prod-002',
    sku: 'PW-TLC-5L-ULT',
    name_en: 'Power Max Toilet Cleaner Ultra Clean',
    name_bn: 'পাওয়ার ম্যাক্স টয়লেট ক্লিনার আল্ট্রা ক্লিন',
    slug_en: 'power-max-toilet-cleaner-ultra-5l',
    slug_bn: 'power-max-toilet-cleaner-ultra-5l',
    brand: 'Power Max',
    category_id: 'cleaning-supplies',
    category_en: 'Cleaning Supplies',
    category_bn: 'ক্লিনিং সাপ্লাইজ',
    subcategory_id: 'toilet-cleaner',
    subcategory_en: 'Toilet Cleaner',
    subcategory_bn: 'টয়লেট ক্লিনার',
    description_en: 'Power Max Toilet Cleaner features an ultra-thick descaling formula that clings to bowl surfaces, dissolving tough yellow stains, hard-water mineral buildup, and eliminating 99.9% of bacteria and unpleasant odors.',
    description_bn: 'পাওয়ার ম্যাক্স টয়লেট ক্লিনার অত্যন্ত কার্যকর গাঢ় ফর্মুলা যা টয়লেট বোলের কঠিন হলুদ দাগ, লবণাক্ত পানির দাগ এবং দুর্গন্ধ দূর করে ৯৯.৯% জীবাণু ধ্বংস করে।',
    features_en: [
      'Thick active gel formula clings for deep stain removal',
      'Removes tough limescale, rust, and yellow water stains',
      'Eliminates odor-causing bacteria instantly',
      'Angled nozzle compatibility for rim cleaning',
      'Bulk 5L container ideal for institutions & family refills'
    ],
    features_bn: [
      'ঘন সক্রিয় জেল ফর্মুলা কঠিন দাগ দূর করে',
      'লবণাক্ত পানির দাগ ও মরিচা নিমিষেই পরিষ্কার করে',
      'দুর্গন্ধ সৃষ্টিকারী জীবাণু ধ্বংস করে সুবাস ছড়ায়',
      'টয়লেট কমোড ও প্যানের জন্য উপযোগী',
      'সাশ্রয়ী ৫ লিটার বড় জার'
    ],
    how_to_use_en: 'Pour directly around the rim and inner bowl. Allow to act for 15-20 minutes, scrub lightly with a toilet brush, and flush.',
    how_to_use_bn: 'কমোড বা প্যানের চারপাশে সরাসরি ঢালুন। ১৫-২০ মিনিট অপেক্ষা করুন, ব্রাশ দিয়ে আলতোভাবে ঘষে ফ্লাশ করে দিন।',
    specifications: {
      'Volume / Size': '5 Liters',
      'Form': 'Thick Acidic Gel',
      'Target': 'Ceramic Toilet Bowls & Urinals',
      'Germ Kill': '99.9% Certified',
      'Country of Origin': 'Bangladesh'
    },
    price: 800,
    sale_price: 680,
    currency: 'BDT',
    size: '5 L',
    unit: 'L',
    variants: [
      { id: 'v-tlc-750ml', size: '750 ml', unit: 'ml', price: 160, sale_price: 145, sku: 'PW-TLC-750ML', stock: 150 },
      { id: 'v-tlc-5l', size: '5 L', unit: 'L', price: 800, sale_price: 680, sku: 'PW-TLC-5L-ULT', stock: 90 }
    ],
    images: [
      'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 90,
    featured: true,
    popular: true,
    new: false,
    offer: true,
    offer_tag_en: 'SAVE ৳120',
    offer_tag_bn: '৳১২০ সাশ্রয়',
    tags: ['Toilet Cleaner', '5L', 'Power Max', 'Stain Remover', 'Disinfectant'],
    rating: 4.8,
    review_count: 64,
    keywords_en: ['toilet cleaner', 'toilet wash', 'harpic alternative', 'commode cleaner', '5 liter toilet cleaner', 'power max'],
    keywords_bn: ['টয়লেট ক্লিনার', 'কমোড ক্লিনার', 'টয়লেট পরিষ্কার', 'পাওয়ার ম্যাক্স', '৫ লিটার টয়লেট ক্লিনার'],
    search_aliases: [
      'toilet cleaner', 'toilet kliner', 'toilet wash', 'toiled cleaner', 'commode cleaner',
      '5 liter toilet', '5l toilet', 'power max', 'টয়লেট ক্লিনার', 'হাড়পিক'
    ]
  },
  {
    id: 'cm-prod-003',
    sku: 'ST-HW-5L-ALOE',
    name_en: 'SoftTouch Antibacterial Liquid Hand Wash (Aloe & Tea Tree)',
    name_bn: 'সফটটাচ অ্যান্টিব্যাকটেরিয়াল লিকুইড হ্যান্ড ওয়াশ (অ্যালোভেরা ও টি ট্রি)',
    slug_en: 'softtouch-antibacterial-hand-wash-5l',
    slug_bn: 'softtouch-antibacterial-hand-wash-5l',
    brand: 'SoftTouch',
    category_id: 'hygiene-personal-care',
    category_en: 'Hygiene & Personal Care',
    category_bn: 'হাইজিন ও পার্সোনাল কেয়ার',
    subcategory_id: 'hand-wash',
    subcategory_en: 'Hand Wash',
    subcategory_bn: 'হ্যান্ড ওয়াশ',
    description_en: 'SoftTouch Liquid Hand Wash is enriched with natural Aloe Vera, Vitamin E, and Tea Tree oil. Provides hospital-grade antibacterial protection while keeping hands soft, moisturized, and pleasantly scented even with frequent handwashing.',
    description_bn: 'সফটটাচ লিকুইড হ্যান্ড ওয়াশ প্রাকৃতিক অ্যালোভেরা ও ভিটামিন ই সমৃদ্ধ। হাতকে জীবাণুমুক্ত রাখার পাশাপাশি কোমল ও মসৃণ রাখে। বারবার ব্যবহারে ত্বক শুষ্ক হয় না।',
    features_en: [
      'Eliminates 99.9% of harmful bacteria and germs',
      'Infused with Aloe Vera & moisturizing Vitamin E',
      'Rich foaming lather with easy rinse-off',
      'Pleasant calming botanical fragrance',
      'Economical 5L bulk refill for corporate dispensers and home'
    ],
    features_bn: [
      '৯৯.৯% ক্ষতিকর জীবাণু দূর করে',
      'প্রাকৃতিক অ্যালোভেরা ও ভিটামিন ই যুক্ত ময়েশ্চারাইজিং ফর্মুলা',
      'ঘন ফেনা ও সহজে ধুয়ে ফেলা যায়',
      'মনোরম প্রাকৃতিক সুবাস',
      'অফিস, রেস্তোরাঁ ও পরিবারের রিফিলের জন্য সাশ্রয়ী ৫ লিটার জার'
    ],
    how_to_use_en: 'Pump a small amount onto wet hands, rub thoroughly for at least 20 seconds including palms, nails, and back of hands, then rinse clean with water.',
    how_to_use_bn: 'ভেজা হাতে সামান্য হ্যান্ড ওয়াশ নিন, অন্তত ২০ সেকেন্ড দুই হাত ভালোভাবে ঘষুন এবং পরিষ্কার পানি দিয়ে ধুয়ে ফেলুন।',
    specifications: {
      'Volume / Size': '5 Liters (5000ml)',
      'Key Active': 'Chloroxylenol / Tea Tree Essence',
      'Skin Compatibility': 'Dermatologically Tested, pH 5.5',
      'Refill Type': 'Universal Dispenser Friendly'
    },
    price: 850,
    sale_price: 720,
    currency: 'BDT',
    size: '5 L',
    unit: 'L',
    variants: [
      { id: 'v-hw-250ml', size: '250 ml (Pump)', unit: 'ml', price: 110, sale_price: 95, sku: 'ST-HW-250ML', stock: 200 },
      { id: 'v-hw-500ml', size: '500 ml (Pump)', unit: 'ml', price: 180, sale_price: 160, sku: 'ST-HW-500ML', stock: 140 },
      { id: 'v-hw-5l', size: '5 L (Jar)', unit: 'L', price: 850, sale_price: 720, sku: 'ST-HW-5L-ALOE', stock: 110 }
    ],
    images: [
      'https://images.unsplash.com/photo-1608248597359-0021c32fa1d7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 110,
    featured: true,
    popular: true,
    new: false,
    offer: true,
    offer_tag_en: 'BESTSELLER',
    offer_tag_bn: 'সেরা বিক্রিত',
    tags: ['Hand Wash', '5L', 'Antibacterial', 'Aloe Vera', 'Hygiene', 'Bulk'],
    rating: 4.95,
    review_count: 112,
    keywords_en: ['hand wash', 'hand soap', 'liquid soap', '5 liter hand wash', 'hand sanitizer', 'softtouch', 'bulk handwash'],
    keywords_bn: ['হ্যান্ড ওয়াশ', 'হ্যান্ডওয়াশ', 'হাত ধোয়ার সাবান', 'লিকুইড সোপ', '৫ লিটার হ্যান্ডওয়াশ', 'সফটটাচ'],
    search_aliases: [
      'hand wash', 'handwash', 'hand was', 'liquid hand soap', '5 liter hand wash',
      '5l hand wash', 'hand soap', 'হ্যান্ড ওয়াশ', 'হ্যান্ডওয়াশ', 'হাত ধোয়ার সাবান'
    ]
  },
  {
    id: 'cm-prod-004',
    sku: 'CC-GLC-5L-SPR',
    name_en: 'Crystal Clear Glass & Surface Cleaner Spray',
    name_bn: 'ক্রিস্টাল ক্লিয়ার গ্লাস ও সারফেস ক্লিনার',
    slug_en: 'crystal-clear-glass-cleaner-5l',
    slug_bn: 'crystal-clear-glass-cleaner-5l',
    brand: 'Crystal Clear',
    category_id: 'cleaning-supplies',
    category_en: 'Cleaning Supplies',
    category_bn: 'ক্লিনিং সাপ্লাইজ',
    subcategory_id: 'glass-cleaner',
    subcategory_en: 'Glass Cleaner',
    subcategory_bn: 'গ্লাস ক্লিনার',
    description_en: 'Crystal Clear Glass & Surface Cleaner removes fingerprints, grease films, dust, and water spots without leaving streaks or haze. Formulated with anti-static agents to repel dust on mirrors, windows, car windshields, and chrome fixtures.',
    description_bn: 'ক্রিস্টাল ক্লিয়ার গ্লাস ক্লিনার কাচ, আয়না, জানালার গ্লাস ও টেবিলের উপরিভাগ থেকে কোনো দাগ বা অস্পষ্টতা ছাড়াই দ্রুত ধুলা ও তৈলাক্ত দাগ পরিষ্কার করে।',
    features_en: [
      'Instant crystal-clear transparency with zero residue',
      'Anti-fog & anti-static dust-repelling formulation',
      'Safe for glass, mirrors, acrylic, stainless steel, and TV screens',
      'Fast-evaporating professional formula'
    ],
    features_bn: [
      'দাগহীন স্বচ্ছ ও চকচকে কাচ',
      'ধুলা ও আঙুলের ছাপ নিরোধক বিশেষ ফর্মুলা',
      'গ্লাস, আয়না, জানালা ও স্টিলের জন্য শতভাগ নিরাপদ',
      'দ্রুত বাষ্পীভূত হয় ও সহজে মোছা যায়'
    ],
    how_to_use_en: 'Spray 6-8 inches from surface and wipe dry immediately with a clean lint-free microfiber cloth or squeegee.',
    how_to_use_bn: 'কাচের উপরিভাগে স্প্রে করুন এবং শুকনো পরিষ্কার মাইক্রোফাইবার কাপড় বা ওয়াইপার দিয়ে মুছে ফেলুন।',
    specifications: {
      'Volume / Size': '5 Liters',
      'Formula': 'Streak-Free Ammonia-Optimized',
      'Applications': 'Windows, Glass Partitions, Showcases, Windshields'
    },
    price: 680,
    sale_price: 580,
    currency: 'BDT',
    size: '5 L',
    unit: 'L',
    variants: [
      { id: 'v-glc-500ml', size: '500 ml (Trigger)', unit: 'ml', price: 140, sale_price: 125, sku: 'CC-GLC-500ML', stock: 160 },
      { id: 'v-glc-5l', size: '5 L (Refill)', unit: 'L', price: 680, sale_price: 580, sku: 'CC-GLC-5L-SPR', stock: 75 }
    ],
    images: [
      'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 75,
    featured: false,
    popular: true,
    new: false,
    offer: true,
    offer_tag_en: 'SAVE ৳100',
    offer_tag_bn: '৳১০০ সাশ্রয়',
    tags: ['Glass Cleaner', '5L', 'Crystal Clear', 'Window Spray', 'Surface Care'],
    rating: 4.85,
    review_count: 51,
    keywords_en: ['glass cleaner', 'window cleaner', 'mr brasso', 'glass spray', '5 liter glass cleaner', 'crystal clear'],
    keywords_bn: ['গ্লাস ক্লিনার', 'কাচ পরিষ্কার', 'গ্লাস স্প্রে', 'আয়না ক্লিনার', '৫ লিটার গ্লাস ক্লিনার'],
    search_aliases: [
      'glass cleaner', 'glass klinar', 'glass cleanar', 'window cleaner', 'glas cleaner',
      '5 liter glass', '5l glass', 'গ্লাস ক্লিনার', 'কাচ পরিষ্কার স্প্রে'
    ]
  },
  {
    id: 'cm-prod-005',
    sku: 'FA-RF-300ML-JAS',
    name_en: 'FreshAir Automatic Room Freshener Spray (Jasmine Breeze 300ml)',
    name_bn: 'ফ্রেশএয়ার অটোমেটিক রুম ফ্রেশনার স্প্রে (জেসমিন ব্রিজ ৩০০মিলি)',
    slug_en: 'freshair-room-freshener-jasmine-300ml',
    slug_bn: 'freshair-room-freshener-jasmine-300ml',
    brand: 'FreshAir',
    category_id: 'air-care',
    category_en: 'Air Care & Fragrance',
    category_bn: 'এয়ার কেয়ার ও সুগন্ধি',
    subcategory_id: 'room-freshener',
    subcategory_en: 'Room Freshener',
    subcategory_bn: 'রুম ফ্রেশনার',
    description_en: 'FreshAir Room Freshener Aerosol neutralizes unpleasant airborne odors and fills your living room, office cabin, hotel lobby, or restroom with an authentic natural Jasmine blossom aroma that lasts for hours.',
    description_bn: 'ফ্রেশএয়ার রুম ফ্রেশনার স্প্রে যেকোনো দুর্গন্ধ দ্রুত দূর করে ঘর, অফিস, হোটেল রুম বা ওয়াশরুমে মনোরম বেলি ফুলের সুবাস ছড়িয়ে দেয়।',
    features_en: [
      'Instant odor neutralization technology (Dual action)',
      'Fine micro-mist spray for wide room coverage',
      'Contains 3000+ controlled fragrance sprays',
      'Available in Jasmine, Lavender, Citrus, and Ocean Fresh'
    ],
    features_bn: [
      'দ্রুত দুর্গন্ধ দূর করার শক্তিশালী ফর্মুলা',
      'সূক্ষ্ম মিস্ট স্প্রে যা ঘরের সর্বত্র ছড়িয়ে পড়ে',
      '৩০০০+ স্প্রে সম্পন্ন দীর্ঘস্থায়ী ক্যান',
      'জেসমিন, ল্যাভেন্ডার, সাইট্রাস ও ওশান ফ্রেশ সুবাসে উপলভ্য'
    ],
    specifications: {
      'Net Content': '300 ml / 175g',
      'Fragrance Note': 'Natural Jasmine Floral',
      'Dispenser Type': 'Aerosol Spray Can',
      'Shelf Life': '36 Months'
    },
    price: 320,
    sale_price: 270,
    currency: 'BDT',
    size: '300 ml',
    unit: 'ml',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 180,
    featured: true,
    popular: true,
    new: true,
    offer: true,
    offer_tag_en: '15% OFF',
    offer_tag_bn: '১৫% ছাড়',
    tags: ['Room Freshener', 'Aerosol', 'Jasmine', 'Air Care', 'Fragrance'],
    rating: 4.9,
    review_count: 73,
    keywords_en: ['room freshener', 'air freshener', 'aerosol spray', 'jasmine freshener', 'office fragrance', 'freshair'],
    keywords_bn: ['রুম ফ্রেশনার', 'এয়ার ফ্রেশনার', 'অ্যারোসল', 'সুগন্ধি স্প্রে', 'বেলি ফুল ফ্রেশনার'],
    search_aliases: [
      'room freshener', 'room freshnar', 'air freshener', 'air freshner', 'aerosol',
      'fragrance', 'jasmine freshener', 'রুম ফ্রেশনার', 'এয়ার ফ্রেশনার', 'রুম স্প্রে'
    ]
  },
  {
    id: 'cm-prod-006',
    sku: 'DW-PRO-5L-LMN',
    name_en: 'DishWash Pro Lemon Degreasing Liquid 5L',
    name_bn: 'ডিশওয়াশ প্রো লেমন ডিটারজেন্ট লিকুইড ৫ লিটার',
    slug_en: 'dishwash-pro-lemon-liquid-5l',
    slug_bn: 'dishwash-pro-lemon-liquid-5l',
    brand: 'DishWash Pro',
    category_id: 'cleaning-supplies',
    category_en: 'Cleaning Supplies',
    category_bn: 'ক্লিনিং সাপ্লাইজ',
    subcategory_id: 'dish-wash',
    subcategory_en: 'Dish Wash',
    subcategory_bn: 'ডিশ ওয়াশ',
    description_en: 'Commercial-grade dishwashing liquid with turbo grease-cutting enzymes. Easily cuts through heavy burnt oils, curry stains, and food odours on stainless steel, melamine, glassware, and cookware with minimal scrubbing.',
    description_bn: 'রেস্তোরাঁ ও গৃহস্থালীর জন্য বিশেষ ঘন ডিশওয়াশ লিকুইড। কঠিন তেল-চর্বি ও পোড়া দাগ নিমিষেই দূর করে এবং বাসনকোসনে চমৎকার লেবুর ঘ্রাণ রাখে।',
    features_en: [
      'Ultra-concentrated grease-cutting formula',
      'Gentle on chef & home cook hands',
      'Rinses completely clean without chemical film',
      'Economical 5L canister for restaurants & homes'
    ],
    features_bn: [
      'কঠিন তেল-চর্বি দূর করার সুপার কনসেন্ট্রেটেড ফর্মুলা',
      'হাতের ত্বকের জন্য কোমল ও নিরাপদ',
      'সহজে ধুয়ে যায় ও কোনো গন্ধ থাকে না',
      'রেস্তোরাঁ ও পরিবারের জন্য সাশ্রয়ী ৫ লিটার জার'
    ],
    specifications: {
      'Volume': '5 Liters',
      'Concentration': 'Super Concentrated (Dilution 1:10)',
      'Active Ingredients': 'Anionic Surfactants, Real Lemon Extract'
    },
    price: 720,
    sale_price: 620,
    currency: 'BDT',
    size: '5 L',
    unit: 'L',
    variants: [
      { id: 'v-dw-500ml', size: '500 ml', unit: 'ml', price: 130, sale_price: 115, sku: 'DW-PRO-500ML', stock: 130 },
      { id: 'v-dw-5l', size: '5 L', unit: 'L', price: 720, sale_price: 620, sku: 'DW-PRO-5L-LMN', stock: 80 }
    ],
    images: [
      'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 80,
    featured: false,
    popular: true,
    new: false,
    offer: true,
    offer_tag_en: 'SAVE ৳100',
    offer_tag_bn: '৳১০০ সাশ্রয়',
    tags: ['Dishwash', '5L', 'Kitchen Cleaning', 'Restaurant Supplies', 'Lemon'],
    rating: 4.75,
    review_count: 42,
    keywords_en: ['dish wash', 'dish liquid', 'dish soap', 'kitchen cleaner', '5 liter dishwash', 'vim alternative'],
    keywords_bn: ['ডিশ ওয়াশ', 'বাসন মাজার লিকুইড', 'ডিশওয়াশ', 'থালা বাসন ধোয়ার লিকুইড', '৫ লিটার ডিশওয়াশ'],
    search_aliases: [
      'dish wash', 'dishwash', 'dish liquid', 'dish cleaner', 'dishsoap',
      '5 liter dish wash', '5l dishwash', 'ডিশ ওয়াশ', 'ডিশওয়াশ'
    ]
  },
  {
    id: 'cm-prod-007',
    sku: 'BS-DIS-5L-HSP',
    name_en: 'BioShield Hospital-Grade Surface Disinfectant 5L',
    name_bn: 'বায়োশিল্ড হসপিটাল গ্রেড সারফেস জীবাণুনাশক ৫ লিটার',
    slug_en: 'bioshield-hospital-surface-disinfectant-5l',
    slug_bn: 'bioshield-hospital-surface-disinfectant-5l',
    brand: 'BioShield',
    category_id: 'corporate-institutional',
    category_en: 'Corporate & Institutional',
    category_bn: 'কর্পোরেট ও প্রাতিষ্ঠানিক',
    subcategory_id: 'hospital-cleaning',
    subcategory_en: 'Hospital-Grade Disinfection',
    subcategory_bn: 'হাসপাতাল ক্লিনিং',
    description_en: 'Certified broad-spectrum antimicrobial disinfectant formulated for clinical, hospital, laboratory, diagnostic center, and food processing sanitation. Effective against bacteria, enveloped viruses, fungi, and spores.',
    description_bn: 'হাসপাতাল, ক্লিনিক, ডায়াগনস্টিক সেন্টার ও ল্যাবরেটরির জন্য সার্টিফায়েড শক্তিশালী জীবাণুনাশক কনসেন্ট্রেট। ক্ষতিকর ভাইরাস ও ব্যাকটেরিয়া ধ্বংস করে সর্বোচ্চ নিরাপত্তা নিশ্চিত করে।',
    features_en: [
      'Broad spectrum viral & bacterial destruction (EN 14476 certified)',
      'Non-corrosive to medical equipment and stainless steel',
      'Dilutable up to 1:50 for general surface wipe-down',
      'Trusted by top healthcare facilities in Bangladesh'
    ],
    features_bn: [
      'মেডিকেল গ্রেড জীবাণুনাশক কার্যকারিতা',
      'যন্ত্রপাতি ও স্টিলের ক্ষতি করে না',
      'পানি মিশিয়ে সাশ্রয়ীভাবে বিস্তৃত এলাকা জীবানুমুক্ত করা যায়',
      'বাংলাদেশের স্বনামধন্য ক্লিনিক ও হাসপাতালে ব্যবহৃত'
    ],
    specifications: {
      'Volume': '5 Liters',
      'Active Compound': 'Benzalkonium Chloride + QAC Complex',
      'Grade': 'Hospital & Institutional Level',
      'Certification': 'ISO 9001 / BSTI Compliant'
    },
    price: 1100,
    sale_price: 950,
    currency: 'BDT',
    size: '5 L',
    unit: 'L',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 60,
    featured: true,
    popular: false,
    new: true,
    offer: true,
    offer_tag_en: 'CORPORATE BESTSELLER',
    offer_tag_bn: 'কর্পোরেট সেরা',
    tags: ['Disinfectant', 'Hospital Grade', '5L', 'Antiseptic', 'Corporate Supplies'],
    rating: 5.0,
    review_count: 38,
    keywords_en: ['disinfectant', 'hospital cleaning', 'antiseptic liquid', '5 liter disinfectant', 'clinical sanitizer', 'bioshield'],
    keywords_bn: ['জীবাণুনাশক', 'হাসপাতাল ক্লিনিং', 'ডিসইনফেক্ট্যান্ট', 'অ্যান্টিসেপটিক', '৫ লিটার জীবাণুনাশক'],
    search_aliases: [
      'disinfectant', 'hospital cleaner', 'antiseptic', 'surface disinfectant',
      '5 liter disinfectant', '5l disinfectant', 'জীবাণুনাশক', 'ডিসইনফেক্টেন্ট'
    ]
  },
  {
    id: 'cm-prod-008',
    sku: 'CM-DET-10KG-POW',
    name_en: 'CleanMaster Heavy Duty Detergent Powder 10kg',
    name_bn: 'ক্লিনমাস্টার হেভি ডিউটি ডিটারজেন্ট পাউডার ১০ কেজি',
    slug_en: 'cleanmaster-heavy-duty-detergent-10kg',
    slug_bn: 'cleanmaster-heavy-duty-detergent-10kg',
    brand: 'CleanMaster',
    category_id: 'laundry-fabric-care',
    category_en: 'Laundry & Fabric Care',
    category_bn: 'লন্ড্রি ও ফ্যাব্রিক কেয়ার',
    subcategory_id: 'detergent',
    subcategory_en: 'Detergent Powder',
    subcategory_bn: 'ডিটারজেন্ট পাউডার',
    description_en: 'High-efficiency laundry detergent powder infused with active oxygen bleach and fabric brightening enzymes. Ideal for hotel linen, hospital bedsheets, garment factories, and household washing machines.',
    description_bn: 'হোটেল, হাসপাতাল, লন্ড্রি ও পরিবারের জন্য সক্রিয় অক্সিজেন ও ব্রাইটেনার সমৃদ্ধ শক্তিশালী ডিটারজেন্ট পাউডার। কাপড়ের উজ্জ্বলতা অক্ষুণ্ণ রেখে দাগ দূর করে।',
    features_en: [
      'Active stain-lift enzymes for collars, grease, and tea stains',
      'Suitable for both top-load and front-load washing machines',
      'Leaves clothes fresh with oceanic floral fragrance',
      'Bulk 10kg sack with weather-resistant moisture barrier'
    ],
    features_bn: [
      'ঘাম, চা, তেল ও কালচে দাগ সহজে দূর করে',
      'হাতে ধোয়া এবং ওয়াশিং মেশিন উভয়ের জন্য উপযুক্ত',
      'দীর্ঘস্থায়ী সতেজ সুবাস ও কাপড়ের উজ্জ্বলতা',
      '১০ কেজি সাশ্রয়ী বাল্ক প্যাক'
    ],
    specifications: {
      'Weight': '10 Kilograms (10kg)',
      'Format': 'Free-flowing Granular Powder',
      'Optical Brighteners': 'Enhanced Formula'
    },
    price: 1350,
    sale_price: 1180,
    currency: 'BDT',
    size: '10 kg',
    unit: 'kg',
    variants: [
      { id: 'v-det-2kg', size: '2 kg', unit: 'kg', price: 290, sale_price: 260, sku: 'CM-DET-2KG', stock: 100 },
      { id: 'v-det-10kg', size: '10 kg', unit: 'kg', price: 1350, sale_price: 1180, sku: 'CM-DET-10KG-POW', stock: 50 }
    ],
    images: [
      'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 50,
    featured: false,
    popular: true,
    new: false,
    offer: true,
    offer_tag_en: 'BULK VALUE',
    offer_tag_bn: 'বাল্ক সাশ্রয়',
    tags: ['Detergent', '10kg', 'Laundry', 'Washing Powder', 'Hotel Supplies'],
    rating: 4.8,
    review_count: 29,
    keywords_en: ['detergent powder', 'washing powder', 'laundry soap', '10kg detergent', 'hotel laundry', 'cleanmaster'],
    keywords_bn: ['ডিটারজেন্ট পাউডার', 'ওয়াশিং পাউডার', 'কাপড় কাচার পাউডার', '১০ কেজি ডিটারজেন্ট', 'লন্ড্রি পাউডার'],
    search_aliases: [
      'detergent', 'detergent powder', 'washing powder', 'washing podar', 'kapar kacha soap',
      '10kg detergent', '10 kg detergent', 'ডিটারজেন্ট', 'ওয়াশিং পাউডার'
    ]
  },
  {
    id: 'cm-prod-009',
    sku: 'PC-MOP-SET-360',
    name_en: 'ProClean 360 Spin Mop & Stainless Steel Bucket System',
    name_bn: 'প্রোক্লিন ৩৬০ স্পিন মপ ও স্টেইনলেস স্টিল বাকেট সেট',
    slug_en: 'proclean-360-spin-mop-stainless-bucket',
    slug_bn: 'proclean-360-spin-mop-stainless-bucket',
    brand: 'ProClean',
    category_id: 'household-accessories',
    category_en: 'Household Accessories',
    category_bn: 'গৃহস্থালী ও এক্সেসরিজ',
    subcategory_id: 'cleaning-accessories',
    subcategory_en: 'Cleaning Tools & Mops',
    subcategory_bn: 'ক্লিনিং টুলস ও মপ',
    description_en: 'Heavy-duty 360-degree rotating spin mop with an all-metal stainless steel dehydration wringer basket, extendable aluminum handle, and super-absorbent microfibre mop heads for easy, hands-free cleaning.',
    description_bn: 'টেকসই স্টেইনলেস স্টিল ড্রায়ার বাকেট এবং ৩৬০ ডিগ্রি ঘূর্ণনশীল মাইক্রোফাইবার মপ। হাত ভেজানো ছাড়াই সহজে দ্রুত মেঝে মোছা ও পানি নিংড়ানোর আধুনিক সমাধান।',
    features_en: [
      'Rust-proof 100% stainless steel spin wringer',
      'Telescopic handle with comfortable anti-slip grip',
      'Includes 2 premium microfiber replacement mop heads',
      'Built-in detergent dispenser bottle and drainage spout'
    ],
    features_bn: [
      'মরিচারোধী ১০০% স্টেইনলেস স্টিল বাস্কেট',
      'উচ্চতা কমানো-বাড়ানোর সুবিশাল হ্যান্ডেল',
      'সাথে ২টি উচ্চ শোষণক্ষমতাসম্পন্ন মাইক্রোফাইবার হেড ফ্রি',
      'পানি নিষ্কাশনের জন্য সহজ ড্রেন প্লাগ যুক্ত'
    ],
    specifications: {
      'Material': 'Virgin PP Plastic + Stainless Steel',
      'Handle Length': '125 cm adjustable',
      'Warranty': '6 Months Mechanical Warranty'
    },
    price: 1650,
    sale_price: 1390,
    currency: 'BDT',
    size: '1 Complete Set',
    unit: 'Set',
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 45,
    featured: true,
    popular: true,
    new: true,
    offer: true,
    offer_tag_en: 'SPECIAL OFFER',
    offer_tag_bn: 'বিশেষ অফার',
    tags: ['Spin Mop', 'Cleaning Tools', 'Stainless Bucket', 'Microfiber', 'Household'],
    rating: 4.9,
    review_count: 57,
    keywords_en: ['spin mop', 'floor mop', 'magic mop', 'cleaning bucket', 'microfiber mop', 'proclean'],
    keywords_bn: ['স্পিন মপ', 'ফ্লোর মপ', 'ম্যাজিক মপ', 'মোছা মপ', 'মপ বাকেট সেট'],
    search_aliases: [
      'spin mop', 'magic mop', 'floor mop', 'mop set', 'bucket mop', 'mop',
      'স্পিন মপ', 'মপ', 'মেঝে মোছার মপ', 'ম্যাজিক মপ'
    ]
  },
  {
    id: 'cm-prod-010',
    sku: 'CM-BUNDLE-5L-4PK',
    name_en: 'Carnival Mart Mega Hygiene Bundle (5L x 4 Essentials)',
    name_bn: 'কার্নিভাল মার্ট মেগা হাইজিন বান্ডেল (৫ লিটার x ৪টি পণ্য)',
    slug_en: 'carnival-mart-mega-hygiene-bundle-5l-4pk',
    slug_bn: 'carnival-mart-mega-hygiene-bundle-5l-4pk',
    brand: 'Carnival Mart',
    category_id: 'corporate-institutional',
    category_en: 'Corporate & Institutional',
    category_bn: 'কর্পোরেট ও প্রাতিষ্ঠানিক',
    subcategory_id: 'bulk-supplies',
    subcategory_en: 'Bulk Cleaning 5L/20L',
    subcategory_bn: 'বাল্ক সাপ্লাই ৫ লিটার',
    description_en: 'The ultimate commercial & household hygiene value pack. Includes: 1x AMANA 5L Floor Cleaner, 1x Power Max 5L Toilet Cleaner, 1x SoftTouch 5L Hand Wash, and 1x Crystal Clear 5L Glass Cleaner. Save ৳550 compared to individual purchases!',
    description_bn: 'বাণিজ্যিক প্রতিষ্ঠান ও পরিবারের জন্য সেরা মূল্যের অল-ইন-ওয়ান হাইজিন প্যাক। এতে রয়েছে: ১টি আমনা ৫ লিটার ফ্লোর ক্লিনার, ১টি পাওয়ার ম্যাক্স ৫ লিটার টয়লেট ক্লিনার, ১টি সফটটাচ ৫ লিটার হ্যান্ড ওয়াশ এবং ১টি ক্রিস্টাল ক্লিয়ার ৫ লিটার গ্লাস ক্লিনার। একসাথে কিনে সাশ্রয় করুন ৫৫০ টাকা!',
    features_en: [
      'Total 20 Liters of premium cleaning chemicals',
      'Covers floor, washroom, hand hygiene, and glass maintenance for 3-6 months',
      'Free nationwide delivery with secure crate packaging',
      'Massive discount for offices, clinics, restaurants, and residential buildings'
    ],
    features_bn: [
      'মোট ২০ লিটার প্রিমিয়াম ক্লিনিং দ্রব্যাদি',
      'মেঝে, ওয়াশরুম, হাত ও কাচ পরিষ্কারের সম্পূর্ণ সমাধান',
      'দেশব্যাপী ফ্রি ডেলিভারি ও সুরক্ষিত প্যাকেজিং',
      'একসাথে কেনায় সর্বোচ্চ ৫৫০ টাকা সাশ্রয়'
    ],
    specifications: {
      'Bundle Contents': 'Floor Cleaner 5L + Toilet Cleaner 5L + Hand Wash 5L + Glass Cleaner 5L',
      'Total Net Volume': '20 Liters',
      'Delivery': 'Priority Fast Dispatch'
    },
    price: 3080,
    sale_price: 2530,
    currency: 'BDT',
    size: '20 Liters (4x 5L)',
    unit: 'Combo Pack',
    images: [
      'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248597359-0021c32fa1d7?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 35,
    featured: true,
    popular: true,
    new: true,
    offer: true,
    offer_tag_en: 'MEGA COMBO • SAVE ৳550',
    offer_tag_bn: 'মেগা কম্বো • সাশ্রয় ৳৫৫০',
    tags: ['Combo', 'Bundle', '5L', 'Bulk', 'Corporate Pack', 'Mega Offer'],
    rating: 5.0,
    review_count: 94,
    keywords_en: ['cleaning combo', 'hygiene bundle', '5 liter pack', 'corporate cleaning pack', 'carnival mart bundle'],
    keywords_bn: ['ক্লিনিং কম্বো', 'হাইজিন বান্ডেল', '৫ লিটার কম্বো', 'অফিস সাপ্লাই প্যাক', 'মেগা অফার'],
    search_aliases: [
      'bundle', 'combo', 'cleaning bundle', '5 liter bundle', 'mega pack', '5l pack',
      'কম্বো', 'বান্ডেল', 'প্যাক', '৫ লিটার কম্বো'
    ]
  }
];

export const POPULAR_SEARCH_TERMS = [
  { en: 'Floor Cleaner 5L', bn: 'ফ্লোর ক্লিনার ৫ লিটার', query: 'floor cleaner' },
  { en: 'Hand Wash 5L', bn: 'হ্যান্ড ওয়াশ ৫ লিটার', query: 'hand wash' },
  { en: 'Toilet Cleaner', bn: 'টয়লেট ক্লিনার', query: 'toilet cleaner' },
  { en: 'Room Freshener', bn: 'রুম ফ্রেশনার', query: 'room freshener' },
  { en: 'Glass Cleaner', bn: 'গ্লাস ক্লিনার', query: 'glass cleaner' },
  { en: 'Hospital Disinfectant', bn: 'হাসপাতাল জীবাণুনাশক', query: 'disinfectant' },
  { en: 'Mega Combo Pack', bn: 'মেগা কম্বো প্যাক', query: 'bundle' },
];
