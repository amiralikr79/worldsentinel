'use client';
// ─────────────────────────────────────────────────────────────────────────────
//  MarketPanel — crypto prices with sparklines + REAL global indices via
//  /api/markets (Yahoo Finance proxy).
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import type { CoinRow } from '@/lib/hooks/useCrypto';
import { useMarkets } from '@/lib/hooks/useMarkets';

// ── Sparkline helper ─────────────────────────────────────────────────────────
function Sparkline({ values, positive }: { values: number[]; positive: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c || values.length < 2) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    const W = c.clientWidth;
    const H = c.clientHeight;
    c.width  = W;
    c.height = H;
    ctx.clearRect(0, 0, W, H);

    const min  = Math.min(...values);
    const max  = Math.max(...values);
    const rng  = max - min || 1;
    const xStep = W / (values.length - 1);

    ctx.beginPath();
    values.forEach((v, i) => {
      const x = i * xStep;
      const y = H - ((v - min) / rng) * H * 0.85 - H * 0.075;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = positive ? '#00ff88' : '#ff3355';
    ctx.lineWidth   = 1.5;
    ctx.stroke();
  }, [values, positive]);

  return <canvas ref={ref} className="w-16 h-6" />;
}

// ── Real index row ────────────────────────────────────────────────────────────
function IndexRow({
  shortName,
  price,
  changePct,
  marketState,
}: {
  shortName:   string;
  price:       number;
  changePct:   number;
  marketState: string;
}) {
  const up = changePct >= 0;
  const fmtPrice =
    price >= 10_000
      ? price.toLocaleString('en-US', { maximumFractionDigits: 0 })
      : price >= 1_000
      ? price.toLocaleString('en-US', { maximumFractionDigits: 1 })
      : price.toFixed(2);

  return (
    <div className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-1.5">
        <span className="text-sentinel-cyan text-xs font-mono truncate max-w-[90px]">{shortName}</span>
        {marketState === 'CLOSED' && (
          <span className="text-[8px] text-slate-600 font-mono">CLOSED</span>
        )}
      </div>
      <div className="text-right">
        <span className="text-sentinel-white text-xs font-mono">{fmtPrice}</span>
        <span className={`text-[10px] font-mono ml-1 ${up ? 'text-sentinel-green' : 'text-sentinel-red'}`}>
          {up ? '+' : ''}{changePct.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface MarketPanelProps {
  coins:       CoinRow[];
  sparklines:  Record<string, number[]>;
  isLoading:   boolean;
  rateLimited: boolean;
}

export default function MarketPanel({
  coins,
  sparklines,
  isLoading,
  rateLimited,
}: MarketPanelProps) {
  const { quotes, isLoading: mktLoading, isError: mktError } = useMarkets();

  const fmt = (n: number) =>
    n >= 1000
      ? n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
      : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="h-full flex flex-col overflow-hidden gap-3 p-3">

      {/* ── Crypto ──────────────────────────────────────────────────────── */}
      <div>
        <div className="text-[10px] font-mono text-sentinel-muted tracking-widest mb-1">
          CRYPTO {rateLimited && <span className="text-amber-400 ml-1">⚠ RATE LIMITED</span>}
        </div>
        <div className="space-y-1">
          {isLoading ? (
            <div className="text-sentinel-muted text-xs font-mono text-center py-4">LOADING…</div>
          ) : (
            coins.map((c) => {
              const up    = c.change24h >= 0;
              const spark = sparklines[c.id] ?? [];
              return (
                <div key={c.id} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sentinel-cyan text-xs font-mono w-8">{c.symbol}</span>
                    <Sparkline values={spark.length > 1 ? spark : [c.price * 0.99, c.price]} positive={up} />
                  </div>
                  <div className="text-right">
                    <div className="text-sentinel-white text-xs font-mono">${fmt(c.price)}</div>
                    <div className={`text-[10px] font-mono ${up ? 'text-sentinel-green' : 'text-sentinel-red'}`}>
                      {up ? '+' : ''}{c.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Global Indices (real data) ───────────────────────────────────── */}
      <div>
        <div className="text-[10px] font-mono text-sentinel-muted tracking-widest mb-1 flex items-center gap-2">
          INDICES
          {mktLoading && <span className="text-slate-500 text-[9px]">loading…</span>}
          {mktError   && <span className="text-amber-500 text-[9px]">⚠ unavailable</span>}
          {!mktLoading && !mktError && (
            <span className="text-emerald-500/60 text-[9px]">● live</span>
          )}
        </div>
        <div>
          {mktLoading ? (
            <div className="space-y-2">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="h-3 bg-white/10 rounded animate-pulse" style={{ width: `${55 + i * 8}%` }} />
              ))}
            </div>
          ) : quotes.length > 0 ? (
            quotes.map((q) => (
              <IndexRow
                key={q.symbol}
                shortName={q.shortName}
                price={q.price}
                changePct={q.changePct}
                marketState={q.marketState}
              />
            ))
          ) : (
            <div className="text-sentinel-muted text-[10px] font-mono py-2 text-center">
              Market data unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
