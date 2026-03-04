'use client';
// ─────────────────────────────────────────────────────────────────────────────
//  Ticker — continuous horizontal scrolling news/market strip at the bottom.
//  Duplicates the array so the loop is seamless.
// ─────────────────────────────────────────────────────────────────────────────

interface TickerItem {
  label: string;
  value?: string;
  up?:   boolean;
  type:  'market' | 'news' | 'alert';
}

interface TickerProps {
  items: TickerItem[];
}

const TYPE_COLOR: Record<TickerItem['type'], string> = {
  market: 'text-sentinel-cyan',
  news:   'text-sentinel-white',
  alert:  'text-sentinel-red',
};

export default function Ticker({ items }: TickerProps) {
  if (!items.length) return null;

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="h-8 bg-navy-900/90 border-t border-sentinel-cyan/20 flex items-center overflow-hidden shrink-0">
      {/* Fixed "LIVE" badge */}
      <div className="shrink-0 px-3 border-r border-sentinel-cyan/20 h-full flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-sentinel-red animate-pulse" />
        <span className="text-[10px] font-mono text-sentinel-muted tracking-widest">LIVE</span>
      </div>

      {/* Scrolling strip */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className="flex items-center gap-6 whitespace-nowrap"
          style={{
            animation: 'ticker_scroll 50s linear infinite',
            width: 'max-content',
          }}
        >
          {doubled.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 text-[11px] font-mono">
              <span className={TYPE_COLOR[item.type]}>
                {item.label}
              </span>
              {item.value && (
                <>
                  <span className="text-sentinel-muted">·</span>
                  <span className={item.up === true ? 'text-sentinel-green' : item.up === false ? 'text-sentinel-red' : 'text-sentinel-muted'}>
                    {item.value}
                  </span>
                </>
              )}
              <span className="text-sentinel-cyan/20 ml-2">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
