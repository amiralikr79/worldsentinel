// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/nasa
//  Proxies NASA EONET open event feed (wildfires, storms, floods…).
//  No API key required. Caches for 10 minutes.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from 'next/server';
import type { NasaEvent } from '@/lib/types';

// Only open events, limit to 50, past 30 days
const NASA_URL =
  'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=50&days=30';

// Category → human label map
const CAT_LABELS: Record<string, string> = {
  wildfires:    'Wildfire',
  severeStorms: 'Severe Storm',
  volcanoes:    'Volcano',
  seaLakeIce:   'Ice Event',
  floods:       'Flood',
  earthquakes:  'Earthquake',
  drought:      'Drought',
  snow:         'Snowstorm',
  waterColor:   'Water Anomaly',
};

export const runtime = 'edge';
export const revalidate = 600;

export async function GET() {
  try {
    const res = await fetch(NASA_URL, {
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `NASA EONET returned ${res.status}` },
        { status: 502 },
      );
    }

    const raw = await res.json() as { events: NasaEvent[] };

    const events = raw.events
      .filter((e) => e.geometry.length > 0)
      .map((e) => {
        // Last known geometry point
        const geo = e.geometry[e.geometry.length - 1];
        const coords =
          geo.type === 'Point'
            ? (geo.coordinates as [number, number])
            : (geo.coordinates as [number, number][][][])[0][0][0]; // polygon centroid fallback

        const catId  = e.categories[0]?.id ?? 'unknown';
        const catLbl = CAT_LABELS[catId] ?? e.categories[0]?.title ?? 'Event';

        return {
          id:       e.id,
          title:    e.title,
          category: catLbl,
          catId,
          lng:      coords[0],
          lat:      coords[1],
          date:     geo.date,
          link:     e.link,
        };
      });

    return NextResponse.json(
      { ok: true, data: events, cachedAt: Date.now() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=120',
        },
      },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
