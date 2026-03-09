import useSWR from 'swr';
import type { MarketQuote } from '@/app/api/markets/route';

export type { MarketQuote };

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useMarkets() {
  const { data, error, isLoading } = useSWR<{
    ok:       boolean;
    data:     MarketQuote[];
    cachedAt: string;
  }>('/api/markets', fetcher, {
    refreshInterval:   60 * 1000, // 1 minute
    revalidateOnFocus: false,
    dedupingInterval:  30 * 1000,
  });

  return {
    quotes:   data?.data     ?? [],
    cachedAt: data?.cachedAt ?? null,
    isLoading,
    isError:  !!error || data?.ok === false,
  };
}
