import useSWR from 'swr';
import type { HealthAlert } from '@/app/api/health/route';

export type { HealthAlert };

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useHealth() {
  const { data, error, isLoading } = useSWR<{
    ok:       boolean;
    data:     HealthAlert[];
    total:    number;
    cachedAt: string;
  }>('/api/health', fetcher, {
    refreshInterval:   30 * 60 * 1000, // 30 minutes
    revalidateOnFocus: false,
    dedupingInterval:  15 * 60 * 1000,
  });

  return {
    alerts:   data?.data     ?? [],
    total:    data?.total    ?? 0,
    cachedAt: data?.cachedAt ?? null,
    isLoading,
    isError:  !!error || data?.ok === false,
  };
}
