import Link from 'next/link';
import type { Metadata } from 'next';
import EmailCapture from '@/components/EmailCapture';

export const metadata: Metadata = {
  title: 'WorldSentinel for Investors — Know Before Bloomberg',
  description:
    'Real-time geopolitical risk, seismic events, and disaster monitoring correlated with live crypto and commodity markets. AI briefings before the market opens.',
  alternates: { canonical: 'https://worldsentinel.io/for-investors' },
};

const signals = [
  {
    event: 'M6.8 earthquake hits Taiwan Strait',
    outcome: 'BTC drops 4.2% in 6 hours — supply chain concern',
    delta: '-4.2%',
    negative: true,
  },
  {
    event: 'NASA flags wildfire event near Texas refineries',
    outcome: 'WTI crude spikes 2.8% — energy supply disruption priced in',
    delta: '+2.8%',
    negative: false,
  },
  {
    event: 'Geopolitical risk score crosses 75/100',
    outcome: 'Gold +1.4% safe-haven rotation — 4h after threshold breach',
    delta: '+1.4%',
    negative: false,
  },
  {
    event: 'Storm system classified — Southeast Asia ports',
    outcome: 'Shipping-linked tokens react 18h before mainstream news',
    delta: 'Early signal',
    negative: false,
  },
];

export default function ForInvestors() {
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
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#ffd700]/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-[#ffd700]/30 rounded-full bg-[#ffd700]/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] animate-pulse" />
            <span className="text-[#ffd700] text-xs tracking-[0.2em]">FOR INVESTORS & TRADERS</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Know before<br />
            <span className="text-[#ffd700]">Bloomberg does.</span>
          </h1>

          <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed tracking-wide">
            The signals that move markets — seismic events, disaster classification, geopolitical 
            risk spikes — appear on WorldSentinel before they hit your terminal. 
            Free, live, and AI-synthesised.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="px-8 py-4 text-sm tracking-[0.15em] font-bold text-black bg-[#ffd700] hover:bg-[#e6c200] transition-colors rounded-sm w-full sm:w-auto text-center"
            >
              OPEN LIVE DASHBOARD →
            </Link>
            <a
              href="#signals"
              className="px-8 py-4 text-sm tracking-[0.15em] font-bold text-white/60 border border-white/10 hover:border-white/30 hover:text-white transition-colors rounded-sm w-full sm:w-auto text-center"
            >
              SEE MARKET SIGNALS ↓
            </a>
          </div>
        </div>
      </section>

      {/* SIGNAL EXAMPLES */}
      <section id="signals" className="px-6 py-24 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#ffd700] text-xs tracking-[0.3em] mb-3">REAL-WORLD CORRELATIONS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            The signals your terminal misses.
          </h2>
          <p className="text-white/40 text-sm mt-4 max-w-xl mx-auto">
            Real-world events create market reactions. WorldSentinel tracks the events — live — 
            so you see the signal before the crowd does.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {signals.map((s) => (
            <div key={s.event} className="border border-white/5 rounded-sm p-6 bg-[#010d1e] hover:border-[#ffd700]/20 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <p className="text-white/80 text-sm font-bold leading-snug">{s.event}</p>
                <span className={`shrink-0 text-sm font-bold font-mono ${s.negative ? 'text-red-400' : 'text-[#00ff88]'}`}>
                  {s.delta}
                </span>
              </div>
              <p className="text-white/40 text-xs leading-relaxed">→ {s.outcome}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-white/20 text-xs mt-8 tracking-widest">
          * Historical correlations shown for illustration. Not financial advice.
        </p>
      </section>

      {/* WHAT YOU GET */}
      <section className="px-6 py-24 bg-[#010d1e]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#ffd700] text-xs tracking-[0.3em] mb-3">YOUR EDGE</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              A Bloomberg alternative that costs nothing.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: '◎',
                title: 'Live Seismic Feed → Supply Chain',
                desc: "Every M2.5+ earthquake plotted live on a 3D globe. Instantly see if it's near a port, refinery, semiconductor fab, or shipping lane that could move your position.",
              },
              {
                icon: '🤖',
                title: 'Pre-Market AI Briefing',
                desc: 'Claude synthesises overnight seismic activity, disaster events, and news into a structured risk briefing — ready before US markets open. Risk score, threat level, key events.',
              },
              {
                icon: '📡',
                title: 'NASA Disaster Classification',
                desc: 'Wildfires, floods, and severe storms classified by NASA before they make mainstream news. The first 6 hours of a natural disaster are often invisible to retail traders.',
              },
              {
                icon: '📈',
                title: 'Crypto Price Context',
                desc: 'BTC, ETH, SOL, BNB, XRP live alongside geopolitical events. Watch correlations emerge in real time — not in a post-mortem analysis 48 hours later.',
              },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 p-6 border border-white/5 rounded-sm hover:border-[#ffd700]/20 transition-colors">
                <span className="text-2xl shrink-0">{f.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-white mb-2 tracking-wide">{f.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMAIL + CTA */}
      <section className="px-6 py-24 text-center border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Get the morning brief.<br />
            <span className="text-[#ffd700]">Before the market opens.</span>
          </h2>
          <p className="text-white/40 text-sm mb-10 tracking-wide">
            Daily AI-synthesised intelligence briefing. Free. Lands before 7 AM.
          </p>
          <div className="flex justify-center mb-12">
            <EmailCapture source="for-investors" ctaText="GET MORNING BRIEF →" className="w-full" />
          </div>
          <p className="text-white/20 text-xs tracking-widest mb-6">OR JUMP STRAIGHT IN</p>
          <Link
            href="/dashboard"
            className="inline-block px-10 py-5 text-sm tracking-[0.2em] font-bold text-black bg-[#ffd700] hover:bg-[#e6c200] transition-colors rounded-sm"
          >
            OPEN LIVE DASHBOARD →
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
        <Link href="/dashboard" className="text-[#ffd700]/60 text-xs tracking-widest hover:text-[#ffd700] transition-colors">
          LAUNCH APP →
        </Link>
      </footer>
    </main>
  );
}
