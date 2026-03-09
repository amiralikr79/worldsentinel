import { NextResponse } from 'next/server';

export const runtime   = 'edge';
export const dynamic   = 'force-dynamic'

export interface GdeltEvent {
  title:        string;
  url:          string;
  domain:       string;
  country:      string;
  seenDate:     string;
  lat:          number | null;
  lng:          number | null;
  locationName: string | null;
}

function parseGdeltDate(raw: string): string {
  // GDELT format: "20250104T120000Z" or "20250104120000"
  try {
    const s = raw.replace('T', '').replace('Z', '');
    const yr = s.slice(0, 4);
    const mo = s.slice(4, 6);
    const dy = s.slice(6, 8);
    const hr = s.slice(8, 10);
    const mn = s.slice(10, 12);
    return `${yr}-${mo}-${dy}T${hr}:${mn}:00Z`;
  } catch {
    return new Date().toISOString();
  }
}

export async function GET() {
  try {
    const query = encodeURIComponent(
      '(war OR conflict OR attack OR airstrike OR protest OR sanctions OR coup OR missile OR invasion OR ceasefire) sourcelang:english'
    );
    const url =
      `https://api.gdeltproject.org/api/v2/doc/doc` +
      `?query=${query}` +
      `&mode=artgeo` +
      `&maxrecords=30` +
      `&format=json` +
      `&timespan=12h` +
      `&sort=DateDesc`;

    const res = await fetch(url, {
      signal: AbortSignal.timeout(12_000),
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, data: [], total: 0, error: `GDELT ${res.status}` });
    }

    const raw = await res.json();
    const articles: unknown[] = Array.isArray(raw?.articles) ? raw.articles : [];

    const data: GdeltEvent[] = articles
      .map((a: unknown) => {
        const art = a as Record<string, unknown>;
        const geo = art.geolocation as Record<string, unknown> | null | undefined;
        return {
          title:        String(art.title        ?? ''),
          url:          String(art.url          ?? ''),
          domain:       String(art.domain       ?? ''),
          country:      String(art.sourcecountry ?? geo?.countryname ?? ''),
          seenDate:     parseGdeltDate(String(art.seendate ?? '')),
          lat:          geo?.lat  != null ? Number(geo.lat)  : null,
          lng:          geo?.lon  != null ? Number(geo.lon)  : null,
          locationName: geo?.fullname ? String(geo.fullname).split(',')[0] : null,
        } satisfies GdeltEvent;
      })
      .filter((e) => e.title.length > 0);

    return NextResponse.json(
      { ok: true, data, total: data.length, cachedAt: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=120',
        },
      }
    );
  } catch (err) {
    console.error('[gdelt] fetch error', err);
    return NextResponse.json({ ok: false, data: [], total: 0, error: 'fetch_failed' });
  }
}
