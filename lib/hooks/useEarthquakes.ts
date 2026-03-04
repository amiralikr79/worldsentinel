// ─────────────────────────────────────────────────────────────────────────────
//  useEarthquakes — fetches /api/earthquakes via SWR every 3 minutes.
//  Returns a flat list of slimmed quake objects ready for the globe and panel.
// ─────────────────────────────────────────────────────────────────────────────
import useSWR from 'swr';

export interface Quake {
  id:    string;
  mag:   number;
  place: string;
  time:  number;
  url:   string;
  title: string;
  lng:   number;
  lat:   number;
  depth: number;
}

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

export function useEarthquakes() {
  const { data, error, isLoading, mutate } = useSWR<{
    ok: boolean;
    data: Quake[];
    cachedAt: number;
  }>('/api/earthquakes', fetcher, {
    refreshInterval: 3 * 60 * 1000,   // re-fetch every 3 minutes
    dedupingInterval: 60 * 1000,
    revalidateOnFocus: false,
  });

  return {
    quakes:    data?.data     ?? [],
    cachedAt:  data?.cachedAt ?? null,
    isLoading,
    error:     error?.message ?? (data?.ok === false ? 'Error loading data' : null),
    refresh:   mutate,
  };
}
