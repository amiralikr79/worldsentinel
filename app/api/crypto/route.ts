// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/crypto
//  Proxies CoinGecko simple/price endpoint.
//  No API key needed on free tier (30 req/min). Caches 65 seconds
//  so we never hit rate limits on a busy deployment.
//
//  Phase 2 upgrade path: swap CoinGecko for Polygon.io forex/crypto
//  by reading POLYGON_API_KEY from env and hitting:
//  https://api.polygon.io/v2/aggs/ticker/{symbol}/prev?apiKey=...
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from 'next/server';

const COINS = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'xrp'];
const COINGECKO_URL =
  `https://api.coingecko.com/api/v3/simple/price` +
  `?ids=${COINS.join(',')}&vs_currencies=usd` +
  `&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;

export const runtime = 'edge';
export const revalidate = 65;

export async function GET() {
  try {
    // --- Phase 2: use Polygon.io if API key is present ---
    // const polygonKey = process.env.POLYGON_API_KEY;
    // if (polygonKey) { return fetchFromPolygon(polygonKey); }

    const res = await fetch(COINGECKO_URL, {
      next: { revalidate: 65 },
      signal: AbortSignal.timeout(10000),
      headers: {
        'Accept': 'application/json',
        // 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY ?? '',  // optional
      },
    });

    if (res.status === 429) {
      return NextResponse.json(
        { ok: false, error: 'Rate limited — retry in 65s', code: 429 },
        { status: 429, headers: { 'Retry-After': '65' } },
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `CoinGecko returned ${res.status}` },
        { status: 502 },
      );
    }

    const data = await res.json();

    // Shape the data for the frontend: flat array is easier to map over
    const coins = COINS.map((id) => ({
      id,
      symbol: id === 'binancecoin' ? 'BNB' : id.slice(0, 3).toUpperCase(),
      price:        data[id]?.usd             ?? 0,
      change24h:    data[id]?.usd_24h_change  ?? 0,
      marketCap:    data[id]?.usd_market_cap  ?? 0,
      volume24h:    data[id]?.usd_24h_vol     ?? 0,
    }));

    return NextResponse.json(
      { ok: true, data: coins, cachedAt: Date.now() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=65, stale-while-revalidate=30',
        },
      },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
