import { NextResponse } from 'next/server'

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
      { next: { revalidate: 300 } }
    )

    if (!res.ok) {
      throw new Error(`NASA EONET API error: ${res.status}`)
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

    return NextResponse.json({ events })
  } catch (error) {
    console.error('NASA EONET fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch NASA events', events: [] },
      { status: 500 }
    )
  }
}
