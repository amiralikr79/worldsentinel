import { NextResponse } from 'next/server';

export const runtime   = 'edge';
export const dynamic   = 'force-dynamic'

export interface HealthAlert {
  title:       string;
  link:        string;
  pubDate:     string;
  description: string;
  country:     string;
}

// Country name extractor — looks for bracketed country in title e.g. "Mpox – [Country]"
function extractCountry(title: string): string {
  const match = title.match(/–\s*(.+)$/);
  return match ? match[1].trim() : 'Global';
}

// Strip HTML tags from RSS description
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
}

export async function GET() {
  try {
    const feedUrl = encodeURIComponent(
      'https://www.who.int/feeds/entity/csr/don/en/rss.xml'
    );
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}&count=20`;

    const res = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, data: [], error: `rss2json ${res.status}` });
    }

    const raw   = await res.json();
    const items: unknown[] = Array.isArray(raw?.items) ? raw.items : [];

    const data: HealthAlert[] = items.map((item: unknown) => {
      const it = item as Record<string, unknown>;
      const title = String(it.title ?? '');
      return {
        title,
        link:        String(it.link        ?? ''),
        pubDate:     String(it.pubDate     ?? ''),
        description: stripHtml(String(it.description ?? it.content ?? '')),
        country:     extractCountry(title),
      } satisfies HealthAlert;
    });

    return NextResponse.json(
      { ok: true, data, total: data.length, cachedAt: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=300',
        },
      }
    );
  } catch (err) {
    console.error('[health] fetch error', err);
    return NextResponse.json({ ok: false, data: [], error: 'fetch_failed' });
  }
}
