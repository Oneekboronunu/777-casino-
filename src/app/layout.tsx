import type { Metadata, Viewport } from 'next';
import './globals.css';
import RootLayoutClient from '@/components/layout/RootLayoutClient';
import { getOrganizationSchema } from '@/lib/formatters';

export const viewport: Viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://mycarnivalbd.com'),
  title: {
    default: 'Carnival Mart | Corporate & Household Cleaning Solutions Bangladesh',
    template: '%s | Carnival Mart',
  },
  description:
    'Carnival Mart offers premium commercial & household cleaning products, 5L floor cleaners, hospital-grade disinfectants, antibacterial hand wash, and institutional supplies with nationwide delivery across Bangladesh.',
  keywords: [
    'cleaning products Bangladesh',
    'cleaning supplies Bangladesh',
    'floor cleaner Bangladesh',
    'toilet cleaner Bangladesh',
    'glass cleaner Bangladesh',
    'hand wash Bangladesh',
    '5 liter floor cleaner',
    '5 liter hand wash',
    'commercial cleaning products',
    'corporate cleaning supplies',
    'hospital cleaning products',
    'office cleaning supplies',
    'restaurant cleaning supplies',
    'room freshener Bangladesh',
    'air freshener Bangladesh',
    'ক্লিনিং প্রোডাক্ট',
    'ক্লিনিং পণ্য',
    'ফ্লোর ক্লিনার',
    'টয়লেট ক্লিনার',
    'গ্লাস ক্লিনার',
    'হ্যান্ডওয়াশ',
    'রুম ফ্রেশনার',
    'সাভার ক্লিনিং পণ্য',
    'চাঁদপুর ক্লিনিং',
    'Carnival Mart',
    'mycarnivalbd',
  ],
  authors: [{ name: 'Carnival Mart' }],
  creator: 'Carnival Mart',
  publisher: 'Carnival Mart',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    alternateLocale: 'en_US',
    url: 'https://mycarnivalbd.com',
    siteName: 'Carnival Mart',
    title: 'Carnival Mart — Corporate & Household Cleaning Solutions Bangladesh',
    description:
      'High-potency 5L floor cleaners, antibacterial hand wash, disinfectants, and institutional hygiene supplies in Bangladesh.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Carnival Mart Cleaning & Hygiene Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carnival Mart — Corporate & Household Cleaning Solutions Bangladesh',
    description:
      'Premium cleaning supplies, 5L bulk packs, and hospital-grade hygiene essentials delivered nationwide in Bangladesh.',
    images: ['https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=1200&auto=format&fit=crop&q=80'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  alternates: {
    canonical: 'https://mycarnivalbd.com',
    languages: {
      'bn-BD': 'https://mycarnivalbd.com/bn',
      'en-US': 'https://mycarnivalbd.com/en',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = getOrganizationSchema();
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Carnival Mart',
    url: 'https://mycarnivalbd.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://mycarnivalbd.com/shop?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="antialiased bg-white text-slate-900 selection:bg-brand-100 selection:text-brand-900">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
