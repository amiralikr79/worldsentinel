'use client';
// ─────────────────────────────────────────────────────────────────────────────
//  TopBar — sticky header with logo, global search, notifications, AI brief
//  button, and connection status indicator.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import Link from 'next/link';

interface Notification {
  id:    number;
  type:  'quake' | 'disaster' | 'alert';
  text:  string;
  ts:    number;
}

interface TopBarProps {
  searchQuery:       string;
  onSearchChange:    (q: string) => void;
  onOpenWatchlist:   () => void;
  onOpenBriefing:    () => void;
  connectionStatus:  'live' | 'polling' | 'error';
  notifications:     Notification[];
  onClearNotifs:     () => void;
}

export default function TopBar({
  searchQuery,
  onSearchChange,
  onOpenWatchlist,
  onOpenBriefing,
  connectionStatus,
  notifications,
  onClearNotifs,
}: TopBarProps) {
  const [showNotifs, setShowNotifs] = useState(false);

  const statusColor =
    connectionStatus === 'live'    ? 'bg-sentinel-green' :
    connectionStatus === 'polling' ? 'bg-amber-400'      : 'bg-sentinel-red';

  const statusLabel =
    connectionStatus === 'live'    ? 'LIVE' :
    connectionStatus === 'polling' ? 'POLLING' : 'ERROR';

  return (
    <header className="h-14 flex items-center gap-3 px-4 border-b border-sentinel-cyan/20 bg-navy-900/80 backdrop-blur-sm shrink-0 relative z-50">

      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded border border-sentinel-cyan/40 flex items-center justify-center">
          <span className="text-sentinel-cyan text-[10px] font-mono font-bold">SEN</span>
        </div>
        <span className="text-sentinel-white font-mono text-sm font-bold tracking-[0.2em]">SENTINEL</span>
      </div>

      {/* Home link */}
      <Link
        href="/"
        className="text-[10px] font-mono text-sentinel-muted hover:text-sentinel-cyan transition-colors tracking-widest shrink-0"
        title="Back to home"
      >
        ← HOME
      </Link>

      {/* Separator */}
      <div className="h-6 w-px bg-sentinel-cyan/20" />

      {/* Search */}
      <div className="flex-1 max-w-xs relative">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-sentinel-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search intel…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white/5 border border-sentinel-cyan/20 rounded pl-8 pr-3 py-1.5 text-xs font-mono text-sentinel-white placeholder-sentinel-muted focus:outline-none focus:border-sentinel-cyan/60 transition-colors"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Connection status pill */}
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-sentinel-muted">
        <span className={`w-1.5 h-1.5 rounded-full ${statusColor} ${connectionStatus !== 'error' ? 'animate-pulse' : ''}`} />
        {statusLabel}
      </div>

      {/* Watchlist button */}
      <button
        onClick={onOpenWatchlist}
        className="text-xs font-mono text-sentinel-muted hover:text-sentinel-cyan border border-sentinel-cyan/20 hover:border-sentinel-cyan/50 px-2.5 py-1.5 rounded transition-colors"
        title="Watchlist"
      >
        ★ LIST
      </button>

      {/* AI Briefing button */}
      <button
        onClick={onOpenBriefing}
        className="text-xs font-mono text-sentinel-cyan border border-sentinel-cyan/40 hover:bg-sentinel-cyan/10 px-2.5 py-1.5 rounded transition-colors"
        title="AI Daily Briefing"
      >
        ◈ BRIEF
      </button>

      {/* Notifications bell */}
      <div className="relative">
        <button
          onClick={() => setShowNotifs((v) => !v)}
          className="relative w-8 h-8 flex items-center justify-center text-sentinel-muted hover:text-sentinel-white transition-colors"
          title="Notifications"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {notifications.length > 0 && (
            <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-sentinel-red text-white text-[9px] flex items-center justify-center font-mono">
              {notifications.length > 9 ? '9+' : notifications.length}
            </span>
          )}
        </button>

        {/* Notification dropdown */}
        {showNotifs && (
          <div className="absolute right-0 top-full mt-1 w-72 bg-navy-800 border border-sentinel-cyan/20 rounded shadow-xl z-50">
            <div className="flex items-center justify-between px-3 py-2 border-b border-sentinel-cyan/20">
              <span className="text-[10px] font-mono text-sentinel-muted tracking-widest">ALERTS</span>
              <button onClick={onClearNotifs} className="text-[10px] text-sentinel-cyan hover:underline font-mono">
                CLEAR ALL
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sentinel-muted text-xs text-center py-6 font-mono">NO ALERTS</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="px-3 py-2 border-b border-white/5 last:border-0">
                    <p className="text-xs text-sentinel-white">{n.text}</p>
                    <p className="text-[10px] text-sentinel-muted mt-0.5">
                      {new Date(n.ts).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
