import { NextResponse } from 'next/server';

export const runtime   = 'edge';
export const revalidate = 60; // 1 minute

export interface MarketQuote {
  symbol:       string;
  shortName:    string;
  price:        number;
  change:       number;
  changePct:    number;
  open:         number;
  prevClose:    number;
  dayHigh:      number;
  dayLow:       number;
  currency:     string;
  marketState:  string;
}

// Human-readable labels for each symbol
const LABEL_MAP: Record<string, string> = {
  '^GSPC':    'S&P 500',
  '^IXIC':    'NASDAQ',
  '^FTSE':    'FTSE 100',
  '^N225':    'Nikkei 225',
  '^GDAXI':   'DAX',
  'GC=F':     'Gold',
  'CL=F':     'WTI Oil',
  '^VIX':     'VIX',
  'DX-Y.NYB': 'DXY',
};

const SYMBOLS = Object.keys(LABEL_MAP).join(',');

export async function GET() {
  try {
    const url =
      `https://query1.finance.yahoo.com/v7/finance/quote` +
      `?symbols=${encodeURIComponent(SYMBOLS)}` +
      `&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,` +
      `regularMarketOpen,regularMarketPreviousClose,regularMarketDayHigh,` +
      `regularMarketDayLow,currency,marketState,shortName`;

    const res = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      headers: {
        'Accept':     'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; WorldSentinel/1.0)',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, data: [], error: `YF ${res.status}` });
    }

    const raw   = await res.json();
    const items: unknown[] = raw?.quoteResponse?.result ?? [];

    const data: MarketQuote[] = items.map((q: unknown) => {
      const qt = q as Record<string, unknown>;
      const sym = String(qt.symbol ?? '');
      return {
        symbol:      sym,
        shortName:   LABEL_MAP[sym] ?? String(qt.shortName ?? sym),
        price:       Number(qt.regularMarketPrice         ?? 0),
        change:      Number(qt.regularMarketChange        ?? 0),
        changePct:   Number(qt.regularMarketChangePercent ?? 0),
        open:        Number(qt.regularMarketOpen          ?? 0),
        prevClose:   Number(qt.regularMarketPreviousClose ?? 0),
        dayHigh:     Number(qt.regularMarketDayHigh       ?? 0),
        dayLow:      Number(qt.regularMarketDayLow        ?? 0),
        currency:    String(qt.currency    ?? 'USD'),
        marketState: String(qt.marketState ?? 'CLOSED'),
      } satisfies MarketQuote;
    });

    return NextResponse.json(
      { ok: true, data, cachedAt: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (err) {
    console.error('[markets] fetch error', err);
    return NextResponse.json({ ok: false, data: [], error: 'fetch_failed' });
  }
}
