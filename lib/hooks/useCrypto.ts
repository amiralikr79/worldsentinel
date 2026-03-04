// ─────────────────────────────────────────────────────────────────────────────
//  useCrypto — fetches /api/crypto every 65 seconds.
//  Maintains a sparkline history buffer (last 20 ticks per coin).
// ─────────────────────────────────────────────────────────────────────────────
import useSWR from 'swr';
import { useRef } from 'react';

export interface CoinRow {
  id:        string;
  symbol:    string;
  price:     number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

const MAX_SPARKLINE = 20;

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (r.status === 429) throw new Error('rate-limited');
    if (!r.ok)            throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

export function useCrypto() {
  // sparklineHistory[coinId] = [...prices]
  const sparkRef = useRef<Record<string, number[]>>({});

  const { data, error, isLoading, mutate } = useSWR<{
    ok: boolean;
    data: CoinRow[];
    cachedAt: number;
  }>('/api/crypto', fetcher, {
    refreshInterval: 65 * 1000,
    dedupingInterval: 30 * 1000,
    revalidateOnFocus: false,
    onSuccess(res) {
      if (!res?.data) return;
      res.data.forEach((c) => {
        if (!sparkRef.current[c.id]) sparkRef.current[c.id] = [];
        sparkRef.current[c.id].push(c.price);
        if (sparkRef.current[c.id].length > MAX_SPARKLINE) {
          sparkRef.current[c.id].shift();
        }
      });
    },
  });

  const rateLimited = error?.message === 'rate-limited';

  return {
    coins:       data?.data            ?? [],
    sparklines:  sparkRef.current,
    cachedAt:    data?.cachedAt        ?? null,
    isLoading,
    rateLimited,
    error:       rateLimited ? null : (error?.message ?? null),
    refresh:     mutate,
  };
}
