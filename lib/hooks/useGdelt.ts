import useSWR from 'swr';
import type { GdeltEvent } from '@/app/api/gdelt/route';

export type { GdeltEvent };

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useGdelt() {
  const { data, error, isLoading } = useSWR<{
    ok:       boolean;
    data:     GdeltEvent[];
    total:    number;
    cachedAt: string;
  }>('/api/gdelt', fetcher, {
    refreshInterval:    10 * 60 * 1000, // 10 minutes
    revalidateOnFocus:  false,
    dedupingInterval:   5 * 60 * 1000,
  });

  return {
    events:    data?.data     ?? [],
    total:     data?.total    ?? 0,
    cachedAt:  data?.cachedAt ?? null,
    isLoading,
    isError:   !!error || data?.ok === false,
  };
}
