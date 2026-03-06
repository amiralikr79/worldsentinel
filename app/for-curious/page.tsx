import Link from 'next/link';
import type { Metadata } from 'next';
import EmailCapture from '@/components/EmailCapture';

export const metadata: Metadata = {
  title: 'WorldSentinel — Close 5 Tabs. Open One Dashboard.',
  description:
    'Replace your earthquake tracker, news site, weather app, market ticker, and disaster feed with one live AI-powered global intelligence dashboard. Free.',
  alternates: { canonical: 'https://worldsentinel.io/for-curious' },
};

const tabs = [
  { old: 'USGS earthquake map', icon: '◎', replacing: '✓ Live seismic 3D globe' },
  { old: 'BBC World News', icon: '📰', replacing: '✓ Real-time global news wire' },
  { old: 'NASA disaster tracker', icon: '📡', replacing: '✓ NASA EONET disaster feed' },
  { old: 'CoinMarketCap', icon: '📈', replacing: '✓ Live crypto price ticker' },
  { old: 'Your AI summariser', icon: '🤖', replacing: '✓ Claude AI briefing, built in' },
];

export default function ForCurious() {
  return (
    <main className="min-h-screen bg-[#020b18] text-white font-mono overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#020b18]/90 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#00ff88] text-xs tracking-[0.3em] font-bold">◈</span>
          <span className="text-white text-sm tracking-[0.2em] font-bold">WORLDSENTINEL</span>
        </Link>
        <Link
          href="/dashboard"
          className="px-4 py-2 text-xs tracking-[0.15em] font-bold text-black bg-[#00ff88] hover:bg-[#00e07a] transition-colors rounded-sm"
        >
          LAUNCH DASHBOARD →
        </Link>
      </nav>

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-16 text-center">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,255,136,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c084fc]/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-[#c084fc]/30 rounded-full bg-[#c084fc]/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-pulse" />
            <span className="text-[#c084fc] text-xs tracking-[0.2em]">FOR THE GLOBALLY CURIOUS</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Five tabs.<br />
            <span className="text-[#c084fc]">One dashboard.</span><br />
            The whole world.
          </h1>

          <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed tracking-wide">
            You care about what&apos;s happening in the world — really happening, not just the
            algorithm&apos;s version of it. WorldSentinel gives you the raw, live, AI-synthesised
            picture. The earthquake. The disaster. The market reaction. The news. All at once.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="px-8 py-4 text-sm tracking-[0.15em] font-bold text-black bg-[#c084fc] hover:bg-[#a855f7] transition-colors rounded-sm w-full sm:w-auto text-center"
            >
              SEE THE WORLD LIVE →
            </Link>
            <a
              href="#tabs"
              className="px-8 py-4 text-sm tracking-[0.15em] font-bold text-white/60 border border-white/10 hover:border-white/30 hover:text-white transition-colors rounded-sm w-full sm:w-auto text-center"
            >
              WHAT IT REPLACES ↓
            </a>
          </div>
        </div>
      </section>

      {/* TAB REPLACEMENT */}
      <section id="tabs" className="px-6 py-24 bg-[#010d1e]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#c084fc] text-xs tracking-[0.3em] mb-3">CONSOLIDATION</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Close these tabs.<br />Open one.
            </h2>
          </div>

          <div className="space-y-3">
            {tabs.map((t) => (
              <div key={t.old} className="flex items-center gap-4 p-5 border border-white/5 rounded-sm bg-[#020b18] hover:border-[#c084fc]/20 transition-colors group">
                <span className="text-xl shrink-0">{t.icon}</span>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-white/30 text-xs line-through tracking-wide">{t.old}</span>
                  <span className="text-white/10 hidden sm:inline">→</span>
                  <span className="text-[#00ff88] text-xs tracking-wide group-hover:text-[#c084fc] transition-colors">{t.replacing}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 border border-[#c084fc]/20 rounded-sm bg-[#c084fc]/5 text-center">
            <p className="text-[#c084fc] text-sm font-bold tracking-wide mb-2">PLUS: THE AI LAYER</p>
            <p className="text-white/50 text-xs leading-relaxed">
              Hit one button. Claude synthesises everything — seismic events, disaster classification, 
              market moves, and breaking news — into a single structured briefing. 
              The most informed you&apos;ll feel in 30 seconds.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT MAKES IT REAL */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#c084fc] text-xs tracking-[0.3em] mb-3">WHY IT MATTERS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            The connections nobody else shows you.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '🌍',
              title: 'The World Connected',
              desc: "A drought in the Horn of Africa. A quake near a shipping lane. A storm over a delta. These aren't separate stories — WorldSentinel shows you how they link.",
            },
            {
              icon: '⏱',
              title: 'Real Time, Not Recap',
              desc: "Events update every 30 seconds. You're not reading yesterday's summary — you're watching the globe as it actually is, right now, with everything plotted live.",
            },
            {
              icon: '🧠',
              title: 'AI Makes Sense of It',
              desc: "Data is noise without context. Claude reads everything and gives you: here's what happened, here's the risk level, here's what matters and why. Clear. Honest. Instant.",
            },
          ].map((f) => (
            <div key={f.title} className="border border-white/5 rounded-sm p-8 bg-[#010d1e] hover:border-[#c084fc]/20 transition-colors text-center">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-sm font-bold text-white mb-3 tracking-wide">{f.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EMAIL + CTA */}
      <section className="px-6 py-24 text-center bg-[#010d1e] border-t border-b border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Start your morning<br />
            <span className="text-[#c084fc]">knowing what everyone else doesn&apos;t.</span>
          </h2>
          <p className="text-white/40 text-sm mb-10 tracking-wide">
            Daily AI briefing. The whole world synthesised. Free. Always.
          </p>
          <div className="flex justify-center mb-12">
            <EmailCapture source="for-curious" ctaText="GET DAILY BRIEFING →" className="w-full" />
          </div>
          <p className="text-white/20 text-xs tracking-widest mb-6">OR EXPLORE NOW, NO SIGNUP NEEDED</p>
          <Link
            href="/dashboard"
            className="inline-block px-10 py-5 text-sm tracking-[0.2em] font-bold text-black bg-[#c084fc] hover:bg-[#a855f7] transition-colors rounded-sm"
          >
            OPEN THE DASHBOARD →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#00ff88] text-xs">◈</span>
          <span className="text-white/40 text-xs tracking-[0.2em]">WORLDSENTINEL</span>
        </Link>
        <p className="text-white/20 text-xs tracking-widest">FREE GLOBAL INTELLIGENCE</p>
        <Link href="/dashboard" className="text-[#c084fc]/60 text-xs tracking-widest hover:text-[#c084fc] transition-colors">
          LAUNCH APP →
        </Link>
      </footer>
    </main>
  );
}
