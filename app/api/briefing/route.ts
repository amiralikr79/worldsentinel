// POST /api/briefing — Claude-powered global intelligence briefing.
// Runs on Vercel Edge — never statically generated at build time.
import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface BriefingRequest {
  quakeCount:    number;
  nasaCount:     number;
  btcChange:     number;
  btcPrice:      number;
  topQuakes:     Array<{ mag: number; place: string }>;
  nasaEvents:    Array<{ title: string; category: string }>;
  newsHeadlines: string[];
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { ok: false, error: 'ANTHROPIC_API_KEY not configured on this deployment.' },
      { status: 500 },
    );
  }

  let body: BriefingRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
  }

  const { quakeCount, nasaCount, btcChange, btcPrice, topQuakes, nasaEvents, newsHeadlines } = body;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const prompt = `You are SENTINEL, an elite global intelligence analyst AI. Generate a concise, authoritative real-time intelligence briefing based on the live data below.

TODAY: ${today}

LIVE INTELLIGENCE DATA:
- Seismic activity: ${quakeCount} earthquakes currently tracked globally
- Significant events: ${topQuakes.slice(0, 5).map((q) => `M${q.mag.toFixed(1)} ${q.place}`).join(' | ') || 'None above threshold'}
- NASA EONET active natural hazards: ${nasaCount} events
- Active hazard highlights: ${nasaEvents.slice(0, 6).map((e) => e.title).join(' | ') || 'None reported'}
- BTC/USD: $${btcPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })} (${btcChange >= 0 ? '+' : ''}${btcChange.toFixed(2)}% in 24h)
- Top news signals: ${newsHeadlines.slice(0, 5).join(' | ') || 'No headlines available'}

Generate a JSON intelligence briefing with this EXACT structure:
{
  "summary": "2-sentence executive summary capturing the most critical global condition right now",
  "riskLevel": "LOW|MODERATE|ELEVATED|HIGH|CRITICAL",
  "riskScore": <integer 0-100, calibrated to data above>,
  "sections": [
    {
      "title": "🌍 GEOPOLITICAL OVERVIEW",
      "icon": "🌍",
      "content": "3-4 sentences. Analyze global stability based on seismic and disaster data as geopolitical stress proxies. Identify key pressure zones. Be specific about regions."
    },
    {
      "title": "📈 MARKET INTELLIGENCE",
      "icon": "📈",
      "content": "3-4 sentences. Interpret BTC price action as a risk-appetite signal. Connect macro environment to crypto movement. Identify what to watch in the next 24-48h."
    },
    {
      "title": "🌡 CLIMATE & DISASTERS",
      "icon": "🌡",
      "content": "3-4 sentences. Synthesize active NASA EONET events. Highlight highest-impact hazards. Flag any unusual clustering of events by type or region."
    },
    {
      "title": "⚡ PRIORITY ALERTS",
      "icon": "⚡",
      "content": "3-5 specific, actionable watchpoints. Start each with •. Be concrete — name regions, magnitudes, specific assets. No generic statements."
    }
  ]
}

Be precision-grade. Write like an analyst briefing a head of state. Use specific data points from above. No filler phrases. Respond ONLY with the JSON object — no markdown, no preamble.`;

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const msg = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      messages:   [{ role: 'user', content: prompt }],
    });

    const raw = msg.content[0].type === 'text' ? msg.content[0].text.trim() : '';
    // Strip markdown code fences if the model wraps in ```json
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const data  = JSON.parse(clean);

    return NextResponse.json(
      { ok: true, data: { ...data, generatedAt: new Date().toISOString() } },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Briefing generation error:', msg);
    return NextResponse.json(
      { ok: false, error: 'Failed to generate briefing. Check server logs.' },
      { status: 500 },
    );
  }
}
