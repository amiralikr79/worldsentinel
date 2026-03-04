// ─────────────────────────────────────────────────────────────────────────────
// GET /api/nasa
// Proxies NASA EONET natural events feed (open events, max 50).
// Runs on Vercel Edge — never statically generated at build time.
// Caches 5 minutes between real user requests.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

interface EONETGeometry {
  type: string
  coordinates: unknown
  date: string
}

interface EONETSource {
  id: string
  url: string
}

interface EONETCategory {
  id: string
  title: string
}

interface EONETEvent {
  id: string
  title: string
  description: string | null
  link: string
  closed: string | null
  categories: EONETCategory[]
  sources: EONETSource[]
  geometry: EONETGeometry[]
}

interface EONETResponse {
  events: EONETEvent[]
}

export async function GET() {
  try {
    const res = await fetch(
      'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=50',
      {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(10000),
      }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: `NASA EONET API error: ${res.status}`, events: [] },
        { status: 502 }
      )
    }

    const data: EONETResponse = await res.json()

    const events = data.events
      .filter((event) => event.geometry && event.geometry.length > 0)
      .map((event) => {
        const geo = event.geometry[0]
        let lat = 0
        let lng = 0

        if (geo.type === 'Point') {
          const coords = geo.coordinates as unknown as [number, number]
          lng = coords[0]
          lat = coords[1]
        } else if (geo.type === 'Polygon') {
          const coords = geo.coordinates as unknown as [number, number][][]
          if (coords[0] && coords[0][0]) {
            lng = coords[0][0][0]
            lat = coords[0][0][1]
          }
        }

        return {
          id: event.id,
          title: event.title,
          category: event.categories[0]?.title ?? 'Unknown',
          categoryId: event.categories[0]?.id ?? 'unknown',
          date: geo.date,
          lat,
          lng,
          link: event.link,
          closed: event.closed,
        }
      })
      .filter((e) => e.lat !== 0 || e.lng !== 0)

    return NextResponse.json(
      { events },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        },
      }
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('NASA EONET fetch error:', msg)
    return NextResponse.json(
      { error: 'Failed to fetch NASA events', events: [] },
      { status: 500 }
    )
  }
}
