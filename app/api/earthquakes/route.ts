// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/earthquakes
//  Proxies USGS real-time earthquake feed (M2.5+ past day).
//  No API key required. Caches for 3 minutes on Vercel Edge.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from 'next/server';
import type { EarthquakeResponse } from '@/lib/types';

const USGS_URL =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson';

export const runtime = 'edge';                        // deploy to Vercel Edge
export const revalidate = 180;                        // ISR: re-fetch every 3 min

export async function GET() {
  try {
    const res = await fetch(USGS_URL, {
      next: { revalidate: 180 },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `USGS returned ${res.status}` },
        { status: 502 },
      );
    }

    const raw: EarthquakeResponse = await res.json();

    // Slim the payload — clients only need these fields
    const features = raw.features.map((f) => ({
      id:    f.id,
      mag:   f.properties.mag,
      place: f.properties.place,
      time:  f.properties.time,
      url:   f.properties.url,
      title: f.properties.title,
      lng:   f.geometry.coordinates[0],
      lat:   f.geometry.coordinates[1],
      depth: f.geometry.coordinates[2],
    }));

    return NextResponse.json(
      { ok: true, data: features, cachedAt: Date.now() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=60',
        },
      },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
