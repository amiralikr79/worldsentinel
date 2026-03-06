import Link from 'next/link';
import type { Metadata } from 'next';
import EmailCapture from '@/components/EmailCapture';

export const metadata: Metadata = {
  title: 'WorldSentinel for Security Professionals — One Terminal, Every Threat Vector',
  description:
    'Continuous monitoring of seismic, climate, geopolitical, and physical threat signals. AI-generated risk scores. Structured intelligence briefings. Zero cost.',
  alternates: { canonical: 'https://worldsentinel.io/for-security' },
};

const threatVectors = [
  { icon: '◎', label: 'SEISMIC', desc: 'M2.5+ earthquakes tracked globally, 30s refresh', status: 'LIVE' },
  { icon: '🔥', label: 'WILDFIRES', desc: 'NASA EONET classification — active fire perimeters', status: 'LIVE' },
  { icon: '🌊', label: 'FLOODS', desc: 'Severe flood events classified and mapped in real time', status: 'LIVE' },
  { icon: '🌀', label: 'STORMS', desc: 'Tropical cyclone and severe weather system tracking', status: 'LIVE' },
  { icon: '🌋', label: 'VOLCANIC', desc: 'Volcanic activity classification from NASA EONET', status: 'LIVE' },
  { icon: '📰', label: 'GEOPOLITICAL', desc: 'BBC World Service RSS — breaking news as it publishes', status: 'LIVE' },
];

export default function ForSecurity() {
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
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#4da6ff]/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-[#4da6ff]/30 rounded-full bg-[#4da6ff]/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4da6ff] animate-pulse" />
            <span className="text-[#4da6ff] text-xs tracking-[0.2em]">FOR SECURITY PROFESSIONALS</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            One terminal.<br />
            <span className="text-[#4da6ff]">Every threat vector.</span><br />
            Zero cost.
          </h1>

          <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed tracking-wide">
            WorldSentinel monitors seismic, climate, and geopolitical threat signals continuously — 
            generating AI-powered risk scores and structured briefings you can act on 
            and share up the chain, right now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="px-8 py-4 text-sm tracking-[0.15em] font-bold text-black bg-[#4da6ff] hover:bg-[#3a8de6] transition-colors rounded-sm w-full sm:w-auto text-center"
            >
              OPEN THREAT DASHBOARD →
            </Link>
            <a
              href="#vectors"
              className="px-8 py-4 text-sm tracking-[0.15em] font-bold text-white/60 border border-white/10 hover:border-white/30 hover:text-white transition-colors rounded-sm w-full sm:w-auto text-center"
            >
              VIEW THREAT VECTORS ↓
            </a>
          </div>
        </div>
      </section>

      {/* THREAT VECTORS */}
      <section id="vectors" className="px-6 py-24 bg-[#010d1e]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#4da6ff] text-xs tracking-[0.3em] mb-3">ACTIVE MONITORING</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Six threat categories. All live. All free.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {threatVectors.map((v) => (
              <div key={v.label} className="border border-white/5 rounded-sm p-6 bg-[#020b18] hover:border-[#4da6ff]/20 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl">{v.icon}</span>
                  <span className="text-[10px] tracking-[0.3em] text-[#00ff88] border border-[#00ff88]/30 px-2 py-0.5 rounded-full">
                    {v.status}
                  </span>
                </div>
                <p className="text-[#4da6ff] text-xs tracking-[0.2em] mb-2">{v.label}</p>
                <p className="text-white/40 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI RISK SCORE */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#4da6ff] text-xs tracking-[0.3em] mb-3">AI RISK ASSESSMENT</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            From raw signals to actionable briefings.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              step: '01',
              title: 'Multi-Source Signal Aggregation',
              desc: 'USGS seismic data, NASA EONET disaster classification, and BBC global news are pulled and normalised every 30 seconds. No manual curation required.',
            },
            {
              step: '02',
              title: 'AI Risk Scoring (0–100)',
              desc: 'Claude analyses signal density, event severity, geographic concentration, and news correlation to generate a live risk score. ELEVATED, HIGH, or CRITICAL — updated on demand.',
            },
            {
              step: '03',
              title: 'Structured Intelligence Briefing',
              desc: 'A machine-readable, human-friendly briefing generated on demand. Executive summary, threat breakdown by category, risk drivers, and recommended awareness level.',
            },
            {
              step: '04',
              title: 'Shareable Instantly',
              desc: 'Briefings are structured and clean — ready to copy, paste, and send up the chain in seconds. No proprietary format lock-in. No subscription required.',
            },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 p-6 border border-white/5 rounded-sm hover:border-[#4da6ff]/20 transition-colors">
              <div className="text-[#4da6ff] text-xs tracking-[0.3em] shrink-0 pt-0.5">{s.step}</div>
              <div>
                <h3 className="text-sm font-bold text-white mb-2 tracking-wide">{s.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EMAIL + CTA */}
      <section className="px-6 py-24 text-center bg-[#010d1e] border-t border-b border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Daily threat brief.<br />
            <span className="text-[#4da6ff]">In your inbox before shift.</span>
          </h2>
          <p className="text-white/40 text-sm mb-10 tracking-wide">
            AI-synthesised intelligence briefing every morning. Threat score, active events, risk level. Free.
          </p>
          <div className="flex justify-center mb-12">
            <EmailCapture source="for-security" ctaText="GET DAILY BRIEF →" className="w-full" />
          </div>
          <p className="text-white/20 text-xs tracking-widest mb-6">OR ACCESS THE DASHBOARD NOW</p>
          <Link
            href="/dashboard"
            className="inline-block px-10 py-5 text-sm tracking-[0.2em] font-bold text-black bg-[#4da6ff] hover:bg-[#3a8de6] transition-colors rounded-sm"
          >
            OPEN THREAT DASHBOARD →
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
        <Link href="/dashboard" className="text-[#4da6ff]/60 text-xs tracking-widest hover:text-[#4da6ff] transition-colors">
          LAUNCH APP →
        </Link>
      </footer>
    </main>
  );
}
