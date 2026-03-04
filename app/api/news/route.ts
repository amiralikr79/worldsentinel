// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/news?limit=20
//  Converts BBC World RSS → JSON via rss2json public API.
//  Falls back to Reuters if BBC times out.
//  Adds news category classification server-side to reduce client work.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server';
import type { NewsCategory } from '@/lib/types';

const RSS_FEEDS = [
  'https://feeds.bbci.co.uk/news/world/rss.xml',
  'https://feeds.reuters.com/reuters/topNews',
];

function toRss2Json(feedUrl: string, limit: number) {
  const base = 'https://api.rss2json.com/v1/api.json';
  return `${base}?rss_url=${encodeURIComponent(feedUrl)}&api_key=public&count=${limit}`;
}

function categorize(title: string): NewsCategory {
  const t = title.toLowerCase();
  if (/war|attack|military|troops|weapon|missile|bomb|conflict|terror|shoot|kill|assault/.test(t))
    return 'CONFLICT';
  if (/economy|trade|gdp|inflation|market|stock|debt|tariff|recession|fed|bank|financial/.test(t))
    return 'ECONOMY';
  if (/climate|wildfire|flood|hurricane|earthquake|tsunami|storm|drought|disaster|volcano/.test(t))
    return 'CLIMATE';
  if (/virus|covid|disease|health|hospital|vaccine|outbreak|pandemic|WHO|cancer/.test(t))
    return 'HEALTH';
  if (/tech|ai|cyber|hack|silicon|robot|space|nasa|spacex|openai|chip|semiconductor/.test(t))
    return 'TECH';
  if (/election|president|minister|senate|congress|vote|government|parliament|political|policy/.test(t))
    return 'POLITICS';
  return 'WORLD';
}

export const runtime = 'edge';
export const revalidate = 300;  // 5 min

export async function GET(req: NextRequest) {
  const limit = Math.min(
    parseInt(req.nextUrl.searchParams.get('limit') ?? '20', 10),
    50,
  );

  let lastError: string = 'All feeds failed';

  for (const feed of RSS_FEEDS) {
    try {
      const res = await fetch(toRss2Json(feed, limit), {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) continue;

      const json = await res.json();
      if (json.status !== 'ok' || !Array.isArray(json.items)) continue;

      const items = json.items.map((item: Record<string, string>) => ({
        title:       item.title       ?? '',
        link:        item.link        ?? '',
        pubDate:     item.pubDate     ?? '',
        description: item.description ?? '',
        thumbnail:   item.thumbnail   ?? item.enclosure ?? '',
        author:      item.author      ?? '',
        category:    categorize(item.title ?? ''),
        ts:          new Date(item.pubDate ?? '').getTime() || Date.now(),
      }));

      return NextResponse.json(
        { ok: true, data: items, source: feed, cachedAt: Date.now() },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
          },
        },
      );
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Fetch error';
    }
  }

  return NextResponse.json({ ok: false, error: lastError }, { status: 502 });
}
