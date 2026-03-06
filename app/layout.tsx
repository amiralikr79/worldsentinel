import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const BASE_URL = 'https://worldsentinel.io';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'WorldSentinel — Global Intelligence Dashboard',
    template: '%s | WorldSentinel',
  },
  description:
    'Real-time geopolitical intelligence, live threat tracking, seismic activity, climate events, and AI-powered market signals — free, for everyone.',
  keywords: [
    'global intelligence dashboard',
    'real-time threat monitoring',
    'geopolitical risk',
    'earthquake tracker',
    'climate events',
    'market intelligence',
    'AI briefing',
    'free bloomberg alternative',
    'OSINT dashboard',
    'world news live',
  ],
  authors: [{ name: 'WorldSentinel', url: BASE_URL }],
  creator: 'WorldSentinel',
  publisher: 'WorldSentinel',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'WorldSentinel',
    title: 'WorldSentinel — Global Intelligence Dashboard',
    description:
      'The world is moving. Stay ahead of it. Free real-time intelligence for investors, security professionals, and the globally curious.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'WorldSentinel — Global Intelligence Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WorldSentinel — Global Intelligence Dashboard',
    description:
      'Real-time geopolitical intelligence. Live threats. AI briefings. Zero cost.',
    images: ['/opengraph-image'],
    creator: '@worldsentinel',
    site: '@worldsentinel',
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: 'technology',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#020b18',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://earthquake.usgs.gov" />
        <link rel="preconnect" href="https://eonet.gsfc.nasa.gov" />
        <link rel="preconnect" href="https://api.coingecko.com" />
      </head>
      <body className="h-full overflow-hidden antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
