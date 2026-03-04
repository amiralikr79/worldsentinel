import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title:       'SENTINEL — Global Intelligence Dashboard',
  description: 'Real-time geopolitical, seismic, climate, and market intelligence for everyone.',
  keywords:    ['global monitoring', 'real-time intelligence', 'earthquake tracker', 'market data'],
  authors:     [{ name: 'SENTINEL' }],
  openGraph: {
    title:       'SENTINEL',
    description: 'Real-time global intelligence dashboard',
    type:        'website',
  },
};

export const viewport: Viewport = {
  width:              'device-width',
  initialScale:       1,
  themeColor:         '#020b18',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Preconnect to data sources for faster first fetch */}
        <link rel="preconnect" href="https://earthquake.usgs.gov" />
        <link rel="preconnect" href="https://eonet.gsfc.nasa.gov" />
        <link rel="preconnect" href="https://api.coingecko.com" />
      </head>
      <body className="h-full overflow-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
