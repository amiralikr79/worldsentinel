'use client';
// ─────────────────────────────────────────────────────────────────────────────
//  SENTINEL — Main Dashboard Page
//
//  Layout (CSS Grid, 3-col × 3-row):
//  ┌──────────────────────────────────────────────────┐
//  │  TopBar (full width, sticky)                      │
//  ├──────────┬────────────────────────┬───────────────┤
//  │  News    │       Globe            │   Market      │
//  │  Panel   │       (Three.js)       │   Panel       │
//  │          │                        │               │
//  ├──────────┴────────────────────────┴───────────────┤
//  │  Ticker (full width, bottom)                      │
//  └──────────────────────────────────────────────────┘
//
//  Slide-in panels (on top):
//   • Watchlist (left side)
//   • AI Briefing (right side)
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import useSWR from 'swr';

import TopBar     from '@/components/TopBar';
import NewsPanel  from '@/components/NewsPanel';
import MarketPanel from '@/components/MarketPanel';
import Ticker     from '@/components/Ticker';

import { useEarthquakes }  from '@/lib/hooks/useEarthquakes';
import { useCrypto }       from '@/lib/hooks/useCrypto';
import type { GlobeMarker, Watchlist, DailyBriefing, NewsItem } from '@/lib/types';

// Globe is a heavy Three.js component — load client-only, no SSR
const Globe = dynamic(() => import('@/components/Globe'), {
  ssr:     false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center text-sentinel-muted text-xs font-mono">
      INITIALIZING GLOBE…
    </div>
  ),
});

// ── NASA hook (simple SWR, no custom hook needed) ────────────────────────────
const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface NasaEvent {
  id: string; title: string; category: string; catId: string;
  lng: number; lat: number; date: string; link: string;
}

// ── Notification type ────────────────────────────────────────────────────────
interface Notification {
  id: number; type: 'quake' | 'disaster' | 'alert'; text: string; ts: number;
}

// ── Persistent watchlist (localStorage) ──────────────────────────────────────
const DEFAULT_WL: Watchlist = {
  regions: ['Tokyo', 'Istanbul', 'California'],
  assets:  ['BTC', 'SPX', 'OIL'],
};

function loadWatchlist(): Watchlist {
  if (typeof window === 'undefined') return DEFAULT_WL;
  try {
    return JSON.parse(localStorage.getItem('sentinel-wl') ?? 'null') || DEFAULT_WL;
  } catch { return DEFAULT_WL; }
}
function saveWatchlist(wl: Watchlist) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sentinel-wl', JSON.stringify(wl));
}

// ────────────────────────────────────────────────────────────────────────────
export default function SentinelDashboard() {
  // ── State ─────────────────────────────────────────────────────────────────
  const [searchQuery,   setSearchQuery]   = useState('');
  const [spinning,      setSpinning]      = useState(true);
  const [watchlist,     setWatchlist]     = useState<Watchlist>(DEFAULT_WL);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [watchlistOpen,  setWatchlistOpen]  = useState(false);
  const [briefingOpen,   setBriefingOpen]   = useState(false);
  const [newWLInput,     setNewWLInput]     = useState({ region: '', asset: '' });
  const [briefingData,   setBriefingData]   = useState<DailyBriefing | null>(null);
  const [briefingLoading,setBriefingLoading]= useState(false);
  const [briefingError,  setBriefingError]  = useState<string | null>(null);

  // ── Data fetching ─────────────────────────────────────────────────────────
  const { quakes, isLoading: eqLoading } = useEarthquakes();
  const { coins, sparklines, isLoading: cryptoLoading, rateLimited } = useCrypto();
  const { data: nasaData } = useSWR<{ ok: boolean; data: NasaEvent[] }>('/api/nasa', fetcher, {
    refreshInterval: 10 * 60 * 1000, revalidateOnFocus: false,
  });
  const { data: newsData, isLoading: newsLoading } = useSWR<{ ok: boolean; data: NewsItem[] }>(
    '/api/news?limit=30', fetcher, { refreshInterval: 5 * 60 * 1000, revalidateOnFocus: false },
  );

  const nasaEvents = nasaData?.data ?? [];
  const newsItems  = newsData?.data ?? [];

  // ── Load watchlist from localStorage once ─────────────────────────────────
  useEffect(() => { setWatchlist(loadWatchlist()); }, []);

  // ── Build globe markers from live data ────────────────────────────────────
  const globeMarkers = useMemo<GlobeMarker[]>(() => {
    const markers: GlobeMarker[] = [];

    quakes.slice(0, 60).forEach((q) => {
      markers.push({
        id:        q.id,
        lat:       q.lat,
        lng:       q.lng,
        type:      'quake',
        label:     `M${q.mag.toFixed(1)} ${q.place}`,
        magnitude: q.mag,
      });
    });

    nasaEvents.slice(0, 30).forEach((e) => {
      markers.push({
        id:    e.id,
        lat:   e.lat,
        lng:   e.lng,
        type:  'disaster',
        label: e.title,
      });
    });

    return markers;
  }, [quakes, nasaEvents]);

  // ── Push notification for M5.5+ quakes ───────────────────────────────────
  const seenIdsRef = useMemo(() => new Set<string>(), []);
  useEffect(() => {
    quakes
      .filter((q) => q.mag >= 5.5 && !seenIdsRef.has(q.id))
      .forEach((q) => {
        seenIdsRef.add(q.id);
        setNotifications((prev) => [
          { id: Date.now(), type: 'quake', text: `M${q.mag.toFixed(1)} — ${q.place}`, ts: q.time },
          ...prev.slice(0, 19),
        ]);
      });
  }, [quakes, seenIdsRef]);

  // ── Watchlist helpers ─────────────────────────────────────────────────────
  const addToWatchlist = useCallback((type: 'region' | 'asset', val: string) => {
    if (!val.trim()) return;
    setWatchlist((prev) => {
      const next = type === 'region'
        ? { ...prev, regions: [...new Set([...prev.regions, val.trim()])] }
        : { ...prev, assets:  [...new Set([...prev.assets,  val.trim().toUpperCase()])] };
      saveWatchlist(next);
      return next;
    });
  }, []);

  const removeFromWatchlist = useCallback((type: 'region' | 'asset', val: string) => {
    setWatchlist((prev) => {
      const next = type === 'region'
        ? { ...prev, regions: prev.regions.filter((r) => r !== val) }
        : { ...prev, assets:  prev.assets.filter((a) => a !== val) };
      saveWatchlist(next);
      return next;
    });
  }, []);

  // ── AI Briefing — real Claude API call ────────────────────────────────────
  const generateBriefing = useCallback(async () => {
    setBriefingLoading(true);
    setBriefingError(null);
    try {
      const res = await fetch('/api/briefing', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quakeCount:    quakes.length,
          nasaCount:     nasaEvents.length,
          btcChange:     coins.find((c) => c.id === 'bitcoin')?.change24h ?? 0,
          btcPrice:      coins.find((c) => c.id === 'bitcoin')?.price ?? 0,
          topQuakes:     quakes.filter((q) => q.mag >= 4.5).slice(0, 5).map((q) => ({ mag: q.mag, place: q.place })),
          nasaEvents:    nasaEvents.slice(0, 8).map((e) => ({ title: e.title, category: e.category })),
          newsHeadlines: newsItems.slice(0, 5).map((n) => n.title),
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setBriefingData(json.data as DailyBriefing);
      } else {
        setBriefingError(json.error ?? 'Failed to generate briefing.');
      }
    } catch {
      setBriefingError('Network error. Please try again.');
    } finally {
      setBriefingLoading(false);
    }
  }, [quakes, nasaEvents, coins, newsItems]);

  // ── AI Briefing fallback (shown before first generation) ──────────────────
  const briefing: DailyBriefing = useMemo(() => ({
    generatedAt: new Date().toISOString(),
    summary:     `Global intelligence summary for ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`,
    riskLevel:   quakes.length > 30 || nasaEvents.length > 15 ? 'ELEVATED' : 'MODERATE',
    riskScore:   Math.min(100, quakes.length * 1.2 + nasaEvents.length * 1.5),
    sections: [
      {
        title:   '🌍 GEOPOLITICAL OVERVIEW',
        icon:    '🌍',
        content: `Systems tracking ${quakes.length} seismic events and ${nasaEvents.length} active natural hazards. ${
          quakes.filter(q => q.mag >= 5).length
        } significant earthquakes (M5.0+) recorded in the last 24 hours. Global risk index: ${
          quakes.length > 20 ? 'ELEVATED' : 'NORMAL'
        }.`,
      },
      {
        title:   '📈 MARKET INTELLIGENCE',
        icon:    '📈',
        content: `BTC ${coins.find(c => c.id === 'bitcoin')?.change24h?.toFixed(2) ?? '—'}% in 24h. ${
          (coins.find(c => c.id === 'bitcoin')?.change24h ?? 0) > 0
            ? 'Crypto sentiment positive — risk-on appetite dominant.'
            : 'Crypto sentiment negative — possible risk-off rotation.'
        } Monitor Fed communications for macro shifts.`,
      },
      {
        title:   '🌡 CLIMATE & DISASTERS',
        icon:    '🌡',
        content: `NASA EONET tracking ${nasaEvents.length} active natural events globally. ${
          nasaEvents.filter(e => e.catId === 'wildfires').length
        } active wildfires, ${
          nasaEvents.filter(e => e.catId === 'severeStorms').length
        } severe storm systems. Review regional advisories before travel.`,
      },
      {
        title:   '⚡ PRIORITY ALERTS',
        icon:    '⚡',
        content: quakes.filter(q => q.mag >= 5.5).slice(0, 3).map(q =>
          `• M${q.mag.toFixed(1)} — ${q.place}`
        ).join('\n') || '• No critical seismic alerts at this time.',
      },
    ],
  }), [quakes, nasaEvents, coins]);

  // ── Build ticker items ────────────────────────────────────────────────────
  const tickerItems = useMemo(() => {
    const items: { label: string; value?: string; up?: boolean; type: 'market' | 'news' | 'alert' }[] = [];

    coins.forEach((c) => items.push({
      label: c.symbol,
      value: `$${c.price.toLocaleString('en-US', { maximumFractionDigits: 0 })} (${c.change24h >= 0 ? '+' : ''}${c.change24h.toFixed(2)}%)`,
      up:    c.change24h >= 0,
      type:  'market',
    }));

    quakes.filter(q => q.mag >= 4.5).slice(0, 5).forEach((q) => items.push({
      label: `⚡ M${q.mag.toFixed(1)}`,
      value: q.place,
      type:  'alert',
    }));

    newsItems.slice(0, 8).forEach((n) => items.push({
      label: '◆',
      value: n.title,
      type:  'news',
    }));

    return items;
  }, [coins, quakes, newsItems]);

  // ── Connection status (polling since no WebSocket yet) ────────────────────
  const connectionStatus = eqLoading && newsLoading ? 'polling' : 'polling';

  // ── Panel backdrop click handler ──────────────────────────────────────────
  const closeAllPanels = useCallback(() => {
    setWatchlistOpen(false);
    setBriefingOpen(false);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-[#020b18] overflow-hidden">

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenWatchlist={() => { closeAllPanels(); setWatchlistOpen(true); }}
        onOpenBriefing={() => { closeAllPanels(); setBriefingOpen(true); }}
        connectionStatus={connectionStatus}
        notifications={notifications}
        onClearNotifs={() => setNotifications([])}
      />

      {/* ── Main grid ───────────────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-[300px_1fr_280px] overflow-hidden min-h-0">

        {/* ── Left: News panel ─────────────────────────────────────────── */}
        <div className="glass border-r border-sentinel-cyan/10 overflow-hidden flex flex-col">
          <div className="px-3 py-2 border-b border-sentinel-cyan/10 flex items-center justify-between shrink-0">
            <span className="text-[10px] font-mono text-sentinel-muted tracking-widest">INTEL FEED</span>
            <span className="text-[10px] font-mono text-sentinel-muted">{newsItems.length} items</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <NewsPanel
              items={newsItems}
              seismicItems={quakes}
              watchlist={watchlist.regions}
              searchQuery={searchQuery}
              isLoading={newsLoading}
            />
          </div>
        </div>

        {/* ── Center: Globe ─────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-[#020b18]">
          {/* Globe controls overlay */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            <button
              onClick={() => setSpinning((v) => !v)}
              className="glass px-2.5 py-1.5 text-[10px] font-mono text-sentinel-muted hover:text-sentinel-cyan transition-colors rounded"
            >
              {spinning ? '⏸ PAUSE' : '▶ SPIN'}
            </button>
          </div>

          {/* Live stats overlay */}
          <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1">
            <span className="text-[10px] font-mono text-sentinel-muted glass px-2 py-1 rounded">
              {quakes.length} seismic events
            </span>
            <span className="text-[10px] font-mono text-sentinel-muted glass px-2 py-1 rounded">
              {nasaEvents.length} active disasters
            </span>
          </div>

          <Globe markers={globeMarkers} spinning={spinning} />
        </div>

        {/* ── Right: Market panel ────────────────────────────────────────── */}
        <div className="glass border-l border-sentinel-cyan/10 overflow-hidden flex flex-col">
          <div className="px-3 py-2 border-b border-sentinel-cyan/10 shrink-0">
            <span className="text-[10px] font-mono text-sentinel-muted tracking-widest">MARKET PULSE</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <MarketPanel
              coins={coins}
              sparklines={sparklines}
              isLoading={cryptoLoading}
              rateLimited={rateLimited}
            />
          </div>

          {/* Fear & Greed gauge */}
          <FearGreedGauge quakeCount={quakes.length} btcChange={coins.find(c => c.id === 'bitcoin')?.change24h ?? 0} />
        </div>
      </div>

      {/* ── Bottom: Ticker ───────────────────────────────────────────────── */}
      <Ticker items={tickerItems} />

      {/* ── Slide-in: Watchlist (left) ───────────────────────────────────── */}
      {(watchlistOpen || briefingOpen) && (
        <div className="panel-overlay show" onClick={closeAllPanels} />
      )}

      {watchlistOpen && (
        <aside className="slide-panel slide-panel-left open glass shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-sentinel-cyan/20">
            <span className="text-xs font-mono text-sentinel-cyan tracking-widest">★ WATCHLIST</span>
            <button onClick={() => setWatchlistOpen(false)} className="text-sentinel-muted hover:text-sentinel-white text-lg">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Regions */}
            <div>
              <p className="text-[10px] font-mono text-sentinel-muted mb-2">REGIONS</p>
              <div className="flex gap-1.5 flex-wrap">
                {watchlist.regions.map((r) => (
                  <span key={r} className="flex items-center gap-1 text-xs font-mono text-sentinel-cyan border border-sentinel-cyan/30 rounded px-2 py-0.5">
                    {r}
                    <button onClick={() => removeFromWatchlist('region', r)} className="text-sentinel-muted hover:text-sentinel-red ml-0.5">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5 mt-2">
                <input
                  type="text"
                  placeholder="Add region…"
                  value={newWLInput.region}
                  onChange={(e) => setNewWLInput((p) => ({ ...p, region: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { addToWatchlist('region', newWLInput.region); setNewWLInput((p) => ({ ...p, region: '' })); }
                  }}
                  className="flex-1 bg-white/5 border border-sentinel-cyan/20 rounded px-2 py-1 text-xs font-mono text-sentinel-white placeholder-sentinel-muted focus:outline-none focus:border-sentinel-cyan/50"
                />
                <button
                  onClick={() => { addToWatchlist('region', newWLInput.region); setNewWLInput((p) => ({ ...p, region: '' })); }}
                  className="text-xs font-mono text-sentinel-cyan border border-sentinel-cyan/30 px-2 py-1 rounded hover:bg-sentinel-cyan/10"
                >
                  ADD
                </button>
              </div>
            </div>

            {/* Assets */}
            <div>
              <p className="text-[10px] font-mono text-sentinel-muted mb-2">ASSETS</p>
              <div className="flex gap-1.5 flex-wrap">
                {watchlist.assets.map((a) => (
                  <span key={a} className="flex items-center gap-1 text-xs font-mono text-sentinel-green border border-sentinel-green/30 rounded px-2 py-0.5">
                    {a}
                    <button onClick={() => removeFromWatchlist('asset', a)} className="text-sentinel-muted hover:text-sentinel-red ml-0.5">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5 mt-2">
                <input
                  type="text"
                  placeholder="Add asset (BTC, SPX…)"
                  value={newWLInput.asset}
                  onChange={(e) => setNewWLInput((p) => ({ ...p, asset: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { addToWatchlist('asset', newWLInput.asset); setNewWLInput((p) => ({ ...p, asset: '' })); }
                  }}
                  className="flex-1 bg-white/5 border border-sentinel-cyan/20 rounded px-2 py-1 text-xs font-mono text-sentinel-white placeholder-sentinel-muted focus:outline-none focus:border-sentinel-cyan/50"
                />
                <button
                  onClick={() => { addToWatchlist('asset', newWLInput.asset); setNewWLInput((p) => ({ ...p, asset: '' })); }}
                  className="text-xs font-mono text-sentinel-green border border-sentinel-green/30 px-2 py-1 rounded hover:bg-sentinel-green/10"
                >
                  ADD
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ── Slide-in: AI Briefing (right) ───────────────────────────────── */}
      {briefingOpen && (
        <aside className="slide-panel slide-panel-right open glass shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-sentinel-cyan/20">
            <div>
              <span className="text-xs font-mono text-sentinel-cyan tracking-widest">◈ AI BRIEFING</span>
              {briefingData && (
                <div className="text-[10px] text-sentinel-muted mt-0.5">
                  {new Date(briefingData.generatedAt).toLocaleTimeString()} ·{' '}
                  <span className={
                    briefingData.riskLevel === 'CRITICAL' || briefingData.riskLevel === 'HIGH' ? 'text-sentinel-red' :
                    briefingData.riskLevel === 'ELEVATED' ? 'text-amber-400' : 'text-sentinel-green'
                  }>
                    {briefingData.riskLevel}
                  </span>
                  {' '}· Score: {briefingData.riskScore}
                </div>
              )}
            </div>
            <button onClick={() => setBriefingOpen(false)} className="text-sentinel-muted hover:text-sentinel-white text-lg">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* No briefing yet — show generate CTA */}
            {!briefingData && !briefingLoading && (
              <div className="flex flex-col items-center justify-center h-48 gap-4">
                <div className="text-center">
                  <p className="text-xs font-mono text-sentinel-cyan mb-1">SENTINEL AI ANALYST</p>
                  <p className="text-[11px] text-sentinel-muted leading-relaxed">
                    Generate a live intelligence briefing synthesized from<br />
                    real-time earthquake, disaster, market, and news data.
                  </p>
                </div>
                <button
                  onClick={generateBriefing}
                  className="px-4 py-2 text-xs font-mono text-sentinel-cyan border border-sentinel-cyan/40 rounded hover:bg-sentinel-cyan/10 transition-colors tracking-widest"
                >
                  ◈ GENERATE BRIEFING
                </button>
              </div>
            )}

            {/* Loading state */}
            {briefingLoading && (
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <div className="text-xs font-mono text-sentinel-cyan animate-pulse">ANALYSING GLOBAL CONDITIONS…</div>
                <div className="text-[10px] text-sentinel-muted">Claude is reading live feeds</div>
              </div>
            )}

            {/* Error state */}
            {briefingError && !briefingLoading && (
              <div className="border border-sentinel-red/30 bg-sentinel-red/5 rounded p-3">
                <p className="text-[10px] font-mono text-sentinel-red mb-1">⚠ GENERATION FAILED</p>
                <p className="text-[11px] text-sentinel-muted">{briefingError}</p>
                <button
                  onClick={generateBriefing}
                  className="mt-2 text-[10px] font-mono text-sentinel-cyan hover:underline"
                >
                  Retry →
                </button>
              </div>
            )}

            {/* Live briefing content */}
            {briefingData && !briefingLoading && (
              <>
                <p className="text-xs text-sentinel-muted leading-relaxed">{briefingData.summary}</p>

                {briefingData.sections.map((section) => (
                  <div key={section.title} className="border border-sentinel-cyan/10 rounded p-3">
                    <p className="text-[10px] font-mono text-sentinel-cyan tracking-wider mb-1.5">{section.title}</p>
                    <p className="text-xs text-sentinel-white/80 leading-relaxed whitespace-pre-line">{section.content}</p>
                  </div>
                ))}

                {/* Regenerate button */}
                <button
                  onClick={generateBriefing}
                  className="w-full py-2 text-[10px] font-mono text-sentinel-muted border border-sentinel-cyan/10 rounded hover:border-sentinel-cyan/30 hover:text-sentinel-cyan transition-colors tracking-widest"
                >
                  ↻ REGENERATE
                </button>
              </>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}

// ── Inline Fear & Greed gauge ─────────────────────────────────────────────────
function FearGreedGauge({ quakeCount, btcChange }: { quakeCount: number; btcChange: number }) {
  let score = 50;
  score += Math.min(25, Math.max(-25, btcChange * 2));
  score -= Math.min(20, quakeCount * 0.5);
  score = Math.max(0, Math.min(100, Math.round(score)));

  const angle  = (score / 100) * 180 - 90;
  const label  = score >= 75 ? 'GREED' : score >= 55 ? 'BULLISH' : score >= 45 ? 'NEUTRAL' : score >= 25 ? 'FEAR' : 'EXTREME FEAR';
  const color  = score >= 55 ? '#00ff88' : score >= 45 ? '#ffaa00' : '#ff3355';

  const needleX = 65 + Math.cos((angle - 90) * Math.PI / 180) * 40;
  const needleY = 68 + Math.sin((angle - 90) * Math.PI / 180) * 40;

  return (
    <div className="px-3 py-2 border-t border-sentinel-cyan/10 shrink-0">
      <div className="text-[10px] font-mono text-sentinel-muted mb-1">FEAR & GREED</div>
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 130 80" width="90" height="55">
          {/* Arcs: extreme fear → greed */}
          {[
            ['#ff3355', 0,   36,  0.2],
            ['#ff6633', 36,  72,  0.2],
            ['#ffaa00', 72, 108,  0.2],
            ['#88cc00', 108, 144, 0.2],
            ['#00ff88', 144, 180, 0.2],
          ].map(([col, a1, a2], i) => {
            const r = 50;
            const cx = 65, cy = 68;
            const toRad = (d: number) => ((d as number) - 90) * Math.PI / 180;
            const x1 = cx + r * Math.cos(toRad(a1 as number));
            const y1 = cy + r * Math.sin(toRad(a1 as number));
            const x2 = cx + r * Math.cos(toRad(a2 as number));
            const y2 = cy + r * Math.sin(toRad(a2 as number));
            return (
              <path
                key={i}
                d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
                stroke={col as string}
                strokeWidth="8"
                fill="none"
                opacity="0.4"
              />
            );
          })}
          {/* Needle */}
          <line x1="65" y1="68" x2={needleX} y2={needleY} stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="65" cy="68" r="4" fill={color} />
          {/* Score */}
          <text x="65" y="60" textAnchor="middle" fill={color} fontSize="11" fontFamily="monospace" fontWeight="bold">{score}</text>
        </svg>
        <div>
          <div className="text-xs font-mono font-bold" style={{ color }}>{label}</div>
          <div className="text-[10px] text-sentinel-muted">BTC {btcChange >= 0 ? '+' : ''}{btcChange.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}
