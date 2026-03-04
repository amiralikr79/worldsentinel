# SENTINEL — Global Intelligence Dashboard

> Real-time geopolitical, seismic, climate, and market intelligence for everyone.
> A direct rival to worldmonitor.app with a cleaner UI, institutional-grade data, and accessible to everyday people.

---

## What's in this scaffold

```
sentinel-nextjs/
├── app/
│   ├── api/
│   │   ├── earthquakes/route.ts  ← USGS seismic proxy (3-min cache)
│   │   ├── nasa/route.ts         ← NASA EONET disasters (10-min cache)
│   │   ├── crypto/route.ts       ← CoinGecko prices (65s cache)
│   │   └── news/route.ts         ← BBC RSS → JSON (5-min cache)
│   ├── globals.css               ← Design system (navy + cyan)
│   ├── layout.tsx                ← Root layout + SEO metadata
│   └── page.tsx                  ← Full dashboard (3-col grid)
├── components/
│   ├── Globe.tsx                 ← Three.js interactive 3D globe
│   ├── NewsPanel.tsx             ← Tabbed news feed (WORLD/SEISMIC/★LIST)
│   ├── MarketPanel.tsx           ← Crypto sparklines + global indices
│   ├── TopBar.tsx                ← Search, notifications, AI brief button
│   └── Ticker.tsx                ← Bottom scrolling live strip
├── lib/
│   ├── types.ts                  ← All TypeScript interfaces
│   └── hooks/
│       ├── useEarthquakes.ts     ← SWR hook, refreshes every 3 min
│       └── useCrypto.ts          ← SWR hook, maintains sparkline history
├── .env.example                  ← Copy → .env.local to configure
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## Quick start (5 minutes, zero cost)

### 1. Install dependencies

```bash
cd sentinel-nextjs
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# No changes needed for free tier — just run it
```

### 3. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

All four data sources (USGS, NASA, CoinGecko, BBC) work immediately with no API keys.

---

## Deploy to Vercel (free, 2 minutes)

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel deploy
# Follow prompts. Vercel auto-detects Next.js.
```

### Option B — GitHub → Vercel

1. Push this folder to a new GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo → Deploy
4. Done. Your dashboard is live at `https://your-project.vercel.app`

**Environment variables on Vercel:**
In Project Settings → Environment Variables, add whatever is in your `.env.local`.
For the free tier, no variables are needed.

---

## Phase 2: Upgrade to live market data ($29–49/month)

### Polygon.io (US stocks, forex, indices)

1. Sign up at [polygon.io](https://polygon.io) — $29/mo Starter
2. Add to `.env.local`:
   ```
   POLYGON_API_KEY=your_key_here
   ```
3. In `app/api/crypto/route.ts`, uncomment the `fetchFromPolygon` block
4. In `app/page.tsx`, the global indices section auto-switches to live data

### Finnhub (real-time quotes)

1. Sign up at [finnhub.io](https://finnhub.io) — $49/mo Premium
2. Add: `FINNHUB_API_KEY=your_key_here`
3. Create `app/api/stocks/route.ts` using the Finnhub `/quote` endpoint

---

## Phase 2: Real AI briefings via Claude

1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. Add: `ANTHROPIC_API_KEY=your_key_here`
3. Create `app/api/briefing/route.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(req: Request) {
  const { quakeCount, nasaCount, btcChange } = await req.json();

  const msg = await client.messages.create({
    model: 'claude-opus-4-5-20251101',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Generate a 4-section intelligence briefing.
        Data: ${quakeCount} seismic events, ${nasaCount} disasters, BTC ${btcChange}% today.
        Sections: Geopolitical, Markets, Climate, Priority Alerts.
        Format: JSON { summary, sections: [{title, icon, content}], riskLevel, riskScore }`
    }]
  });

  return Response.json({ ok: true, data: JSON.parse(msg.content[0].text) });
}
```

4. In `app/page.tsx`, replace the `briefing` useMemo with a `useSWR('/api/briefing', ...)` call

---

## Phase 2: User accounts + alerts (Clerk + Supabase)

```bash
npm install @clerk/nextjs @supabase/supabase-js
```

Wrap `app/layout.tsx` with `<ClerkProvider>`. Then:
- `/sign-in` and `/sign-up` pages handled automatically
- User watchlists stored in Supabase instead of localStorage
- Email alerts via Resend when M5.5+ quakes hit watched regions

---

## Phase 3: WebSocket live data (Railway + Socket.io)

For sub-second price updates and earthquake push, you need a persistent backend:

```bash
# In a separate repo: sentinel-api
npm init -y
npm install fastify socket.io @bull/bullmq ioredis
```

Architecture:
```
Vercel (Next.js frontend)
    ↕ WebSocket
Railway (Node.js + Fastify + Socket.io)
    ↕ BullMQ jobs
Upstash Redis (queue + pub/sub)
    ↕ polling
External APIs (USGS, Polygon, Finnhub, AISStream…)
```

---

## Data sources (all free at MVP)

| Source | What it provides | Rate limit |
|--------|-----------------|------------|
| USGS Earthquake Feed | M2.5+ quakes worldwide, real-time | No limit |
| NASA EONET | Wildfires, storms, floods, volcanoes | No limit |
| CoinGecko Free | BTC, ETH, SOL, BNB, XRP prices | 30 req/min |
| BBC World RSS | Top world news headlines | No limit |
| OpenSky Network | Live aircraft positions | 100 req/day |
| GDELT Project | Global events database | No limit |
| ACLED | Armed conflict event data | Free w/ account |
| FRED (St. Louis Fed) | Economic indicators | Free w/ key |

---

## Monetization roadmap

| Tier | Price | Features |
|------|-------|---------|
| Free | $0 | 3 watchlist items, 30min delay indices, 10 news items |
| SENTINEL Pro | $9/mo | Unlimited watchlist, real-time indices, AI briefings, email alerts |
| Teams | $29/mo | 5 seats, custom data layers, API access, SSO |
| Enterprise | Contact | White-label, dedicated infra, SLA |

---

## Tech stack summary

```
Frontend:  Next.js 14 (App Router) + TypeScript + Tailwind CSS
3D Globe:  Three.js (npm, no CDN dependency)
Data:      SWR for client caching, Next.js ISR for server caching
Auth:      Clerk (Phase 2)
Database:  Supabase PostgreSQL (Phase 2)
Cache:     Upstash Redis (Phase 3)
Deploy:    Vercel (frontend) + Railway (backend, Phase 3)
AI:        Claude API via @anthropic-ai/sdk (Phase 2)
```

---

*Built as a rival to worldmonitor.app. Goal: institutional tools, everyday accessibility.*
