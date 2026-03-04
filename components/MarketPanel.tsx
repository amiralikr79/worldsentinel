'use client';
// ─────────────────────────────────────────────────────────────────────────────
//  MarketPanel — crypto prices with sparklines + simulated global indices.
//  Sparklines are rendered on <canvas> elements (no extra chart library needed).
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import type { CoinRow } from '@/lib/hooks/useCrypto';

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

// ── Simulated global indices (replace with Polygon.io in Phase 2) ────────────
const INITIAL_IDX = [
  { symbol: 'SPX',   name: 'S&P 500',  base: 5782,  range: 18 },
  { symbol: 'COMP',  name: 'NASDAQ',   base: 18540, range: 75 },
  { symbol: 'FTSE',  name: 'FTSE 100', base: 8420,  range: 12 },
  { symbol: 'NKY',   name: 'Nikkei',   base: 39200, range: 120 },
  { symbol: 'DAX',   name: 'DAX',      base: 18950, range: 60 },
];

function useSimulatedIndex(base: number, range: number) {
  const priceRef = useRef(base);
  // Slight random drift on render — good enough for "feel alive" prototype
  priceRef.current += (Math.random() - 0.5) * range * 0.06;
  const change = ((priceRef.current - base) / base) * 100;
  return { price: priceRef.current, change };
}

function IndexRow({ symbol, name, base, range }: typeof INITIAL_IDX[0]) {
  const { price, change } = useSimulatedIndex(base, range);
  const up = change >= 0;
  return (
    <div className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
      <div>
        <span className="text-sentinel-cyan text-xs font-mono">{symbol}</span>
        <span className="text-sentinel-muted text-[10px] ml-1">{name}</span>
      </div>
      <div className="text-right">
        <span className="text-sentinel-white text-xs font-mono">
          {price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </span>
        <span className={`text-[10px] font-mono ml-1 ${up ? 'text-sentinel-green' : 'text-sentinel-red'}`}>
          {up ? '+' : ''}{change.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
interface MarketPanelProps {
  coins:      CoinRow[];
  sparklines: Record<string, number[]>;
  isLoading:  boolean;
  rateLimited:boolean;
}

export default function MarketPanel({
  coins,
  sparklines,
  isLoading,
  rateLimited,
}: MarketPanelProps) {
  const fmt = (n: number) =>
    n >= 1000
      ? n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
      : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="h-full flex flex-col overflow-hidden gap-3 p-3">

      {/* ── Crypto ────────────────────────────────────────────────────────── */}
      <div>
        <div className="text-[10px] font-mono text-sentinel-muted tracking-widest mb-1">
          CRYPTO  {rateLimited && <span className="text-amber-400 ml-1">⚠ RATE LIMITED</span>}
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

      {/* ── Global Indices ─────────────────────────────────────────────────── */}
      <div>
        <div className="text-[10px] font-mono text-sentinel-muted tracking-widest mb-1">
          INDICES  <span className="text-amber-500/60 text-[9px]">SIMULATED — connect Polygon.io for live</span>
        </div>
        <div>
          {INITIAL_IDX.map((idx) => (
            <IndexRow key={idx.symbol} {...idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
