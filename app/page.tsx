import Link from 'next/link';
import type { Metadata } from 'next';
import EmailCapture from '@/components/EmailCapture';

export const metadata: Metadata = {
  title: 'WorldSentinel — Global Intelligence Dashboard',
  description:
    'Real-time seismic, climate, geopolitical, and market intelligence — synthesised by AI. Built for investors, security professionals, and the globally informed.',
  alternates: { canonical: 'https://worldsentinel.io' },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#020b18] text-white font-mono overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#020b18]/90 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-[#00ff88] text-xs tracking-[0.3em] font-bold">◈</span>
          <span className="text-white text-sm tracking-[0.2em] font-bold">WORLDSENTINEL</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/morning-brief" className="hidden sm:block text-xs tracking-[0.15em] text-white/40 hover:text-[#00ff88] transition-colors">
            MORNING BRIEF
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-xs tracking-[0.15em] font-bold text-black bg-[#00ff88] hover:bg-[#00e07a] transition-colors rounded-sm"
          >
            LAUNCH DASHBOARD →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-16 text-center">

        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,255,136,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00ff88]/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-[#00ff88]/30 rounded-full bg-[#00ff88]/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-[#00ff88] text-xs tracking-[0.2em]">LIVE GLOBAL INTELLIGENCE</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 text-white">
            The world is moving.<br />
            <span className="text-[#00ff88]">Stay ahead of it.</span>
          </h1>

          <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed tracking-wide">
            WorldSentinel aggregates live seismic activity, NASA disaster feeds, global news,
            and market signals — then lets Claude AI synthesise it all into a daily intelligence
            briefing. One dashboard. Every threat. Right now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="px-8 py-4 text-sm tracking-[0.15em] font-bold text-black bg-[#00ff88] hover:bg-[#00e07a] transition-colors rounded-sm w-full sm:w-auto text-center"
            >
              ENTER DASHBOARD →
            </Link>
            <a
              href="#features"
              className="px-8 py-4 text-sm tracking-[0.15em] font-bold text-white/60 border border-white/10 hover:border-white/30 hover:text-white transition-colors rounded-sm w-full sm:w-auto text-center"
            >
              SEE HOW IT WORKS ↓
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/30 tracking-widest">
            <span>🌍 GLOBAL SEISMIC MONITORING</span>
            <span className="hidden sm:inline text-white/10">·</span>
            <span>🤖 AI-POWERED BRIEFINGS</span>
            <span className="hidden sm:inline text-white/10">·</span>
            <span>📡 NASA DISASTER FEEDS</span>
            <span className="hidden sm:inline text-white/10">·</span>
            <span>📈 LIVE CRYPTO MARKETS</span>
            <span className="hidden sm:inline text-white/10">·</span>
            <span>📰 GLOBAL NEWS WIRE</span>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#00ff88] text-xs tracking-[0.3em] mb-3">CAPABILITIES</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Every signal. One screen.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-sm overflow-hidden">
          {[
            {
              icon: '◎',
              title: 'Live Seismic Intelligence',
              desc: 'USGS earthquake data refreshed every 30 seconds. Every event magnitude 2.5+ plotted on a live 3D globe with real-time magnitude and depth analysis.',
            },
            {
              icon: '🤖',
              title: 'AI Intelligence Briefings',
              desc: 'Hit one button and Claude synthesises all live feeds into a structured daily briefing — risk score, threat assessment, market correlation, and priority alerts.',
            },
            {
              icon: '📡',
              title: 'NASA Disaster Monitoring',
              desc: "Direct feed from NASA EONET — wildfires, floods, severe storms, and volcanic activity tracked as they're classified, mapped and time-stamped.",
            },
            {
              icon: '📈',
              title: 'Market Signal Correlation',
              desc: 'Live crypto prices alongside geopolitical events. Watch how BTC, ETH, and other assets move when real-world risk spikes — the correlation is real.',
            },
            {
              icon: '📰',
              title: 'Global News Wire',
              desc: 'BBC World Service RSS aggregated in real time. Breaking news displayed as it publishes, alongside the environmental and seismic events driving the headlines.',
            },
            {
              icon: '🌐',
              title: '3D Live Globe',
              desc: 'Three.js powered rotating globe with earthquake markers and disaster overlays. Click any marker for depth, magnitude, and location data.',
            },
          ].map((f) => (
            <div key={f.title} className="bg-[#020b18] p-8 hover:bg-[#041428] transition-colors group">
              <div className="text-2xl mb-4">{f.icon}</div>
              <h3 className="text-sm font-bold tracking-[0.1em] text-white mb-3 group-hover:text-[#00ff88] transition-colors">
                {f.title}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── AUDIENCES ── */}
      <section className="px-6 py-24 bg-[#010d1e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#00ff88] text-xs tracking-[0.3em] mb-3">WHO IT&apos;S FOR</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Built for people who need to know first.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                tag: 'INVESTORS & TRADERS',
                icon: '📈',
                headline: 'Geopolitical risk moves markets before analysts do.',
                points: [
                  'Correlate seismic and disaster events with crypto price action in real time',
                  'AI briefing flags macro risk factors before they hit Bloomberg terminals',
                  'Track disaster events that historically precede commodity and energy spikes',
                ],
                href: '/for-investors',
              },
              {
                tag: 'SECURITY PROFESSIONALS',
                icon: '🛡',
                headline: 'One source for every threat vector that matters.',
                points: [
                  'Continuous monitoring of seismic, climate, and geopolitical threat signals',
                  'AI-generated risk scores updated on demand — not on a weekly report cycle',
                  'Structured intelligence briefings you can share up the chain in minutes',
                ],
                href: '/for-security',
              },
              {
                tag: 'THE GLOBALLY INFORMED',
                icon: '🌍',
                headline: 'The world is complex. Your intelligence tool should match it.',
                points: [
                  'Replace five separate news, weather, and market tabs with a single dashboard',
                  'Understand how events connect — climate to conflict, seismic to supply chain',
                  'Daily AI briefing that makes you the most informed person in any room',
                ],
                href: '/for-curious',
              },
            ].map((a) => (
              <Link
                key={a.tag}
                href={a.href}
                className="border border-white/5 rounded-sm p-8 bg-[#020b18] hover:border-[#00ff88]/20 transition-colors block group"
              >
                <div className="text-2xl mb-4">{a.icon}</div>
                <p className="text-[#00ff88] text-xs tracking-[0.2em] mb-3">{a.tag}</p>
                <h3 className="text-base font-bold text-white mb-4 leading-snug group-hover:text-[#00ff88] transition-colors">
                  {a.headline}
                </h3>
                <ul className="space-y-3">
                  {a.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-xs text-white/40 leading-relaxed">
                      <span className="text-[#00ff88] mt-0.5 shrink-0">›</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-24 max-w-4xl mx-auto text-center">
        <p className="text-[#00ff88] text-xs tracking-[0.3em] mb-3">INTELLIGENCE PIPELINE</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">
          Raw data → AI insight in seconds.
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
          {[
            { step: '01', label: 'LIVE DATA INGESTION', desc: 'USGS · NASA EONET · CoinGecko · BBC RSS' },
            { step: '→', label: '', desc: '', arrow: true },
            { step: '02', label: 'REAL-TIME PROCESSING', desc: '30-second refresh · Globe rendering · Ticker updates' },
            { step: '→', label: '', desc: '', arrow: true },
            { step: '03', label: 'AI SYNTHESIS', desc: 'Claude analyses all feeds → risk score + briefing' },
          ].map((s, i) =>
            s.arrow ? (
              <div key={i} className="text-white/20 text-2xl md:mx-4 rotate-90 md:rotate-0">→</div>
            ) : (
              <div key={i} className="flex-1 border border-white/5 rounded-sm p-6 bg-[#010d1e] hover:border-[#00ff88]/20 transition-colors">
                <div className="text-[#00ff88] text-xs tracking-[0.3em] mb-2">{s.step}</div>
                <div className="text-white text-sm font-bold tracking-wide mb-2">{s.label}</div>
                <div className="text-white/30 text-xs leading-relaxed">{s.desc}</div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ── EMAIL CAPTURE ── */}
      <section className="px-6 py-24 bg-[#010d1e] border-t border-b border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-[#00ff88]/30 rounded-full bg-[#00ff88]/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-[#00ff88] text-xs tracking-[0.2em]">MORNING BRIEF</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            The world, synthesised.<br />
            <span className="text-[#00ff88]">In your inbox every morning.</span>
          </h2>
          <p className="text-white/40 text-sm mb-10 tracking-wide leading-relaxed">
            Get a daily AI-powered intelligence briefing — geopolitical risk, live threats, market signals — 
            delivered before the markets open. Free forever.
          </p>
          <div className="flex justify-center">
            <EmailCapture source="landing-email-section" className="w-full" />
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-[#00ff88]/30 rounded-full bg-[#00ff88]/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-[#00ff88] text-xs tracking-[0.2em]">FREE · NO ACCOUNT REQUIRED · LIVE NOW</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Start monitoring the world.<br />
            <span className="text-[#00ff88]">Right now.</span>
          </h2>
          <p className="text-white/40 text-sm mb-10 tracking-wide">
            No signup. No credit card. Just open the dashboard and your global intelligence feed goes live instantly.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-10 py-5 text-sm tracking-[0.2em] font-bold text-black bg-[#00ff88] hover:bg-[#00e07a] transition-colors rounded-sm"
          >
            ENTER DASHBOARD →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[#00ff88] text-xs">◈</span>
          <span className="text-white/40 text-xs tracking-[0.2em]">WORLDSENTINEL</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-white/20 tracking-widest">
          <Link href="/for-investors" className="hover:text-white/50 transition-colors">INVESTORS</Link>
          <Link href="/for-security" className="hover:text-white/50 transition-colors">SECURITY</Link>
          <Link href="/for-curious" className="hover:text-white/50 transition-colors">CURIOUS</Link>
          <Link href="/morning-brief" className="hover:text-white/50 transition-colors">MORNING BRIEF</Link>
        </div>
        <Link href="/dashboard" className="text-[#00ff88]/60 text-xs tracking-widest hover:text-[#00ff88] transition-colors">
          LAUNCH APP →
        </Link>
      </footer>

    </main>
  );
}
