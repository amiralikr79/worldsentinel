import Link from 'next/link';
import type { Metadata } from 'next';
import EmailCapture from '@/components/EmailCapture';

export const metadata: Metadata = {
  title: 'WorldSentinel Morning Brief — The World, Synthesised Every Morning',
  description:
    "AI-powered daily intelligence briefing. Geopolitical risk, live threats, market signals, and climate events — synthesised by Claude before your day begins. Free.",
  alternates: { canonical: 'https://worldsentinel.io/morning-brief' },
};

const sampleBrief = [
  {
    section: 'RISK LEVEL',
    content: 'ELEVATED — Score 68/100',
    highlight: true,
  },
  {
    section: 'SEISMIC ACTIVITY',
    content: '14 significant events in past 24h. M6.1 near Fiji — deep focus, low tsunami risk. Cluster activity continues in Turkey–Greece boundary zone.',
    highlight: false,
  },
  {
    section: 'CLIMATE & DISASTER',
    content: 'NASA EONET: 3 active wildfire classifications in western Canada. Tropical cyclone watch active in Bay of Bengal — 2 active systems.',
    highlight: false,
  },
  {
    section: 'MARKET CONTEXT',
    content: 'BTC -2.3% overnight coinciding with geopolitical risk spike. Energy commodities elevated on storm system classification near Gulf infrastructure.',
    highlight: false,
  },
  {
    section: 'LEAD STORY',
    content: 'Seismic cluster activity in the Mediterranean basin persists for 72h — historically correlated with elevated regional instability. Monitor insurance and shipping exposure.',
    highlight: false,
  },
];

export default function MorningBrief() {
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
          LIVE DASHBOARD →
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
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#00ff88]/5 blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-[#00ff88]/30 rounded-full bg-[#00ff88]/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-[#00ff88] text-xs tracking-[0.2em]">DAILY AI INTELLIGENCE BRIEFING</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            The world, synthesised.<br />
            <span className="text-[#00ff88]">In your inbox.</span><br />
            Every morning.
          </h1>

          <p className="text-base md:text-lg text-white/50 max-w-xl mx-auto mb-10 leading-relaxed tracking-wide">
            Overnight seismic activity, NASA disaster classifications, geopolitical risk score, 
            and market correlations — synthesised by Claude into one clean briefing. 
            Lands before you open your laptop.
          </p>

          <div className="flex justify-center mb-4">
            <EmailCapture
              source="morning-brief-hero"
              ctaText="START FREE →"
              placeholder="your@email.com"
              className="w-full max-w-md"
            />
          </div>

          <p className="text-white/20 text-xs tracking-widest">FREE · NO CREDIT CARD · UNSUBSCRIBE ANY TIME</p>
        </div>
      </section>

      {/* SAMPLE BRIEF */}
      <section className="px-6 py-24 bg-[#010d1e]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#00ff88] text-xs tracking-[0.3em] mb-3">SAMPLE BRIEF</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              What lands in your inbox.
            </h2>
          </div>

          {/* Email mockup */}
          <div className="border border-[#00ff88]/20 rounded-sm overflow-hidden">
            {/* Email header */}
            <div className="bg-[#041428] border-b border-white/5 px-6 py-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#00ff88] text-xs">◈</span>
                <span className="text-white/60 text-xs tracking-widest">WORLDSENTINEL MORNING BRIEF</span>
              </div>
              <p className="text-white/30 text-xs">From: briefing@worldsentinel.io</p>
              <p className="text-white/60 text-xs font-bold mt-1">◈ WorldSentinel Brief — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Brief content */}
            <div className="p-6 space-y-4">
              {sampleBrief.map((item) => (
                <div
                  key={item.section}
                  className={`p-4 rounded-sm ${item.highlight ? 'border border-[#00ff88]/30 bg-[#00ff88]/5' : 'border border-white/5 bg-[#020b18]'}`}
                >
                  <p className={`text-xs tracking-[0.2em] mb-1 ${item.highlight ? 'text-[#00ff88]' : 'text-white/30'}`}>
                    {item.section}
                  </p>
                  <p className={`text-sm leading-relaxed ${item.highlight ? 'text-white font-bold' : 'text-white/60'}`}>
                    {item.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-[#041428] border-t border-white/5 px-6 py-4 text-center">
              <p className="text-white/20 text-xs tracking-widest">WORLDSENTINEL.IO · FREE GLOBAL INTELLIGENCE</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#00ff88] text-xs tracking-[0.3em] mb-3">WHY THE MORNING BRIEF</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Start every day 10 minutes ahead.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '⏰',
              title: 'Before the Market Opens',
              desc: 'Overnight events — earthquakes, storm systems, disaster classifications — are the signals retail traders never see before the bell. The morning brief changes that.',
            },
            {
              icon: '🤖',
              title: 'AI Synthesis, Not Aggregation',
              desc: "It's not a list of links. Claude reads every data source and writes a structured briefing: what happened, the risk level, and what it might mean — in plain language.",
            },
            {
              icon: '🌍',
              title: 'Global, Not Regional',
              desc: "Most news is local. WorldSentinel is global by design — seismic clusters in Asia, storms in the Gulf, wildfires in the Americas, all in the same brief.",
            },
          ].map((f) => (
            <div key={f.title} className="border border-white/5 rounded-sm p-8 bg-[#010d1e] hover:border-[#00ff88]/20 transition-colors text-center">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-sm font-bold text-white mb-3 tracking-wide">{f.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECOND CAPTURE */}
      <section className="px-6 py-24 text-center bg-[#010d1e] border-t border-white/5">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the brief.
          </h2>
          <p className="text-white/40 text-sm mb-10">
            Free. Daily. Cancel any time. Zero noise.
          </p>
          <EmailCapture source="morning-brief-bottom" ctaText="SUBSCRIBE FREE →" className="w-full" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#00ff88] text-xs">◈</span>
          <span className="text-white/40 text-xs tracking-[0.2em]">WORLDSENTINEL</span>
        </Link>
        <p className="text-white/20 text-xs tracking-widest">FREE GLOBAL INTELLIGENCE</p>
        <Link href="/dashboard" className="text-[#00ff88]/60 text-xs tracking-widest hover:text-[#00ff88] transition-colors">
          LIVE DASHBOARD →
        </Link>
      </footer>
    </main>
  );
}
