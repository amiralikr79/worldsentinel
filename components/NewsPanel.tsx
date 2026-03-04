'use client';
// ─────────────────────────────────────────────────────────────────────────────
//  NewsPanel — tabbed news feed with categorization and watchlist filtering.
//  Receives data from the parent page component via props (no internal fetching).
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { NewsItem, NewsCategory } from '@/lib/types';

dayjs.extend(relativeTime);

const CAT_COLOR: Record<NewsCategory, string> = {
  CONFLICT: 'bg-red-500',
  ECONOMY:  'bg-sentinel-cyan',
  CLIMATE:  'bg-amber-400',
  HEALTH:   'bg-green-400',
  TECH:     'bg-purple-400',
  POLITICS: 'bg-blue-400',
  WORLD:    'bg-gray-400',
};

type Tab = 'WORLD' | 'SEISMIC' | 'WATCHLIST';

interface NewsPanelProps {
  items:        NewsItem[];
  seismicItems: { id: string; title: string; mag: number; place: string; time: number; url: string }[];
  watchlist:    string[];
  searchQuery:  string;
  isLoading:    boolean;
}

export default function NewsPanel({
  items,
  seismicItems,
  watchlist,
  searchQuery,
  isLoading,
}: NewsPanelProps) {
  const [tab, setTab] = useState<Tab>('WORLD');

  const filtered = useMemo(() => {
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((n) => n.title.toLowerCase().includes(q));
  }, [items, searchQuery]);

  const watchlistItems = useMemo(
    () =>
      items.filter((n) =>
        watchlist.some((term) => n.title.toLowerCase().includes(term.toLowerCase())),
      ),
    [items, watchlist],
  );

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'WORLD',     label: 'WORLD',    count: filtered.length },
    { id: 'SEISMIC',   label: 'SEISMIC',  count: seismicItems.length },
    { id: 'WATCHLIST', label: '★ LIST',   count: watchlistItems.length },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-sentinel-cyan/20 shrink-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              'flex-1 py-2 text-xs font-mono tracking-widest transition-colors',
              tab === t.id
                ? 'text-sentinel-cyan border-b-2 border-sentinel-cyan'
                : 'text-sentinel-muted hover:text-sentinel-white',
            ].join(' ')}
          >
            {t.label}
            {t.count > 0 && (
              <span className="ml-1 text-[10px] opacity-60">({t.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-1 p-2 scrollbar-thin">
        {isLoading && (
          <div className="text-sentinel-muted text-xs text-center py-8 font-mono">
            FETCHING INTEL…
          </div>
        )}

        {/* ── WORLD tab ─────────────────────────────────────────────────── */}
        {tab === 'WORLD' && !isLoading &&
          filtered.map((item, i) => (
            <NewsCard key={`w-${i}`} item={item} />
          ))}

        {/* ── SEISMIC tab ───────────────────────────────────────────────── */}
        {tab === 'SEISMIC' && seismicItems.map((q) => (
          <a
            key={q.id}
            href={q.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 p-2 rounded hover:bg-white/5 transition-colors group"
          >
            <span
              className={[
                'shrink-0 text-xs font-mono font-bold px-1.5 py-0.5 rounded',
                q.mag >= 6 ? 'bg-red-500/20 text-red-400'
                : q.mag >= 4 ? 'bg-amber-500/20 text-amber-400'
                : 'bg-sentinel-cyan/20 text-sentinel-cyan',
              ].join(' ')}
            >
              M{q.mag.toFixed(1)}
            </span>
            <div className="min-w-0">
              <p className="text-xs text-sentinel-white leading-snug line-clamp-2 group-hover:text-sentinel-cyan transition-colors">
                {q.place}
              </p>
              <p className="text-[10px] text-sentinel-muted mt-0.5">
                {dayjs(q.time).fromNow()}
              </p>
            </div>
          </a>
        ))}
        {tab === 'SEISMIC' && seismicItems.length === 0 && !isLoading && (
          <p className="text-sentinel-muted text-xs text-center py-8 font-mono">NO SEISMIC EVENTS</p>
        )}

        {/* ── WATCHLIST tab ─────────────────────────────────────────────── */}
        {tab === 'WATCHLIST' && watchlistItems.map((item, i) => (
          <NewsCard key={`wl-${i}`} item={item} />
        ))}
        {tab === 'WATCHLIST' && watchlistItems.length === 0 && (
          <p className="text-sentinel-muted text-xs text-center py-8 font-mono">ADD REGIONS TO WATCHLIST</p>
        )}
      </div>
    </div>
  );
}

// ── Sub-component: individual news card ──────────────────────────────────────
function NewsCard({ item }: { item: NewsItem }) {
  const cat = item.category ?? 'WORLD';
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-2 p-2 rounded hover:bg-white/5 transition-colors group cursor-pointer"
    >
      {/* Category stripe */}
      <div className={`w-0.5 shrink-0 rounded-full self-stretch ${CAT_COLOR[cat as NewsCategory] ?? 'bg-gray-400'}`} />

      <div className="min-w-0 flex-1">
        <p className="text-xs text-sentinel-white leading-snug line-clamp-2 group-hover:text-sentinel-cyan transition-colors">
          {item.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-mono text-sentinel-muted">{cat}</span>
          <span className="text-[10px] text-sentinel-muted">
            {dayjs(item.pubDate).fromNow()}
          </span>
        </div>
      </div>
    </a>
  );
}
