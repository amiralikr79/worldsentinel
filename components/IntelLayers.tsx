'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Activity, TrendingUp, ExternalLink } from 'lucide-react';
import { useGdelt }  from '@/lib/hooks/useGdelt';
import { useHealth } from '@/lib/hooks/useHealth';
import { useMarkets } from '@/lib/hooks/useMarkets';

// ─── helpers ────────────────────────────────────────────────────────────────

function relTime(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60_000);
    if (m < 1)  return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch {
    return '';
  }
}

function fmtPrice(price: number, symbol: string): string {
  if (symbol === '^VIX' || symbol === 'DX-Y.NYB') {
    return price.toFixed(2);
  }
  if (price >= 10_000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (price >= 1_000)  return price.toLocaleString('en-US', { maximumFractionDigits: 1 });
  if (price >= 100)    return price.toFixed(2);
  return price.toFixed(2);
}

// ─── sub-panels ─────────────────────────────────────────────────────────────

function ConflictPanel() {
  const { events, isLoading, isError } = useGdelt();

  if (isLoading) return <PanelSkeleton rows={3} />;
  if (isError)   return <PanelError label="GDELT unavailable" />;
  if (events.length === 0) return <PanelEmpty label="No conflict events" />;

  return (
    <div className="flex flex-col gap-[3px] overflow-y-auto max-h-[148px] pr-1 scrollbar-thin">
      {events.slice(0, 12).map((ev, i) => (
        <a
          key={i}
          href={ev.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-2 group hover:bg-white/5 rounded px-1 py-[2px] transition-colors"
        >
          <span className="mt-[3px] w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
          <span className="flex-1 text-[11px] text-slate-300 group-hover:text-white leading-tight line-clamp-2">
            {ev.title}
          </span>
          <span className="text-[10px] text-slate-500 flex-shrink-0 mt-[2px]">
            {ev.locationName ?? ev.country}
          </span>
        </a>
      ))}
    </div>
  );
}

function HealthPanel() {
  const { alerts, isLoading, isError } = useHealth();

  if (isLoading) return <PanelSkeleton rows={3} />;
  if (isError)   return <PanelError label="WHO feed unavailable" />;
  if (alerts.length === 0) return <PanelEmpty label="No active alerts" />;

  return (
    <div className="flex flex-col gap-[3px] overflow-y-auto max-h-[148px] pr-1 scrollbar-thin">
      {alerts.slice(0, 10).map((al, i) => (
        <a
          key={i}
          href={al.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-2 group hover:bg-white/5 rounded px-1 py-[2px] transition-colors"
        >
          <span className="mt-[3px] w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
          <span className="flex-1 text-[11px] text-slate-300 group-hover:text-white leading-tight line-clamp-2">
            {al.title}
          </span>
          <span className="text-[10px] text-slate-500 flex-shrink-0 mt-[2px]">
            {relTime(al.pubDate)}
          </span>
        </a>
      ))}
    </div>
  );
}

function MarketsPanel() {
  const { quotes, isLoading, isError, cachedAt } = useMarkets();

  if (isLoading) return <PanelSkeleton rows={3} />;
  if (isError)   return <PanelError label="Market data unavailable" />;
  if (quotes.length === 0) return <PanelEmpty label="No market data" />;

  // Sort: indices first, then commodities / other
  const order = ['^GSPC', '^IXIC', '^FTSE', '^N225', '^GDAXI', 'GC=F', 'CL=F', '^VIX', 'DX-Y.NYB'];
  const sorted = [...quotes].sort(
    (a, b) => order.indexOf(a.symbol) - order.indexOf(b.symbol)
  );

  return (
    <div className="flex flex-col gap-[2px] overflow-y-auto max-h-[148px] pr-1 scrollbar-thin">
      {sorted.map((q) => {
        const up = q.changePct >= 0;
        return (
          <div key={q.symbol} className="flex items-center gap-2 px-1 py-[2px] hover:bg-white/5 rounded transition-colors">
            <span className="w-[72px] text-[11px] font-medium text-slate-200 truncate flex-shrink-0">
              {q.shortName}
            </span>
            <span className="flex-1 text-right text-[11px] font-mono text-slate-100">
              {fmtPrice(q.price, q.symbol)}
            </span>
            <span className={`w-[52px] text-right text-[11px] font-mono flex-shrink-0 ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
              {up ? '+' : ''}{q.changePct.toFixed(2)}%
            </span>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${up ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          </div>
        );
      })}
      {cachedAt && (
        <span className="text-[9px] text-slate-600 px-1 pt-1">
          Updated {relTime(cachedAt)}
        </span>
      )}
    </div>
  );
}

// ─── skeleton / error / empty ────────────────────────────────────────────────

function PanelSkeleton({ rows }: { rows: number }) {
  return (
    <div className="flex flex-col gap-2 pt-1">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-3 bg-white/10 rounded animate-pulse" style={{ width: `${70 + (i % 3) * 10}%` }} />
      ))}
    </div>
  );
}

function PanelError({ label }: { label: string }) {
  return <p className="text-[11px] text-slate-500 italic pt-1">{label}</p>;
}

function PanelEmpty({ label }: { label: string }) {
  return <p className="text-[11px] text-slate-500 pt-1">{label}</p>;
}

// ─── main component ──────────────────────────────────────────────────────────

interface Props {
  open:    boolean;
  onToggle: () => void;
}

export default function IntelLayers({ open, onToggle }: Props) {
  return (
    <div
      className="w-full border-t border-white/10 bg-[#0a0f1a] transition-all duration-300 overflow-hidden flex-shrink-0"
      style={{ height: open ? 212 : 32 }}
    >
      {/* ── Toggle bar ── */}
      <button
        onClick={onToggle}
        className="w-full h-8 flex items-center justify-between px-4 text-[11px] text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
      >
        <span className="flex items-center gap-2 font-medium tracking-wide uppercase">
          <Zap className="w-3 h-3 text-cyan-400" />
          Intel Layers
        </span>
        {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {/* ── Panel grid ── */}
      {open && (
        <div className="grid grid-cols-3 divide-x divide-white/10 h-[180px] px-0">

          {/* GDELT Conflict */}
          <div className="flex flex-col px-3 py-2 overflow-hidden">
            <div className="flex items-center gap-1.5 mb-2 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Conflict Events
              </span>
            </div>
            <ConflictPanel />
          </div>

          {/* WHO Health */}
          <div className="flex flex-col px-3 py-2 overflow-hidden">
            <div className="flex items-center gap-1.5 mb-2 flex-shrink-0">
              <Activity className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Health Watch
              </span>
              <span className="ml-auto text-[9px] text-slate-600">WHO DON</span>
            </div>
            <HealthPanel />
          </div>

          {/* Global Indices */}
          <div className="flex flex-col px-3 py-2 overflow-hidden">
            <div className="flex items-center gap-1.5 mb-2 flex-shrink-0">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Global Markets
              </span>
              <span className="ml-auto text-[9px] text-slate-600">live</span>
            </div>
            <MarketsPanel />
          </div>

        </div>
      )}
    </div>
  );
}
