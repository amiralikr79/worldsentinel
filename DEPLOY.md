# 🌍 WORLD SENTINEL — Deploy to Production
### Domain: worldsentinel.io | Stack: Next.js → GitHub → Vercel

This guide gets you from code on your computer to a live website at `worldsentinel.io` in about 20 minutes. Total cost: ~$39/year for the domain. Hosting is free.

---

## STEP 1 — Run setup on your computer (5 min)

You need Node.js installed. If you don't have it:
→ Download from **https://nodejs.org** (click "LTS" version, install it)

Then open Terminal (Mac) or Command Prompt (Windows) inside the `sentinel-nextjs` folder:

```bash
bash setup.sh
```

This installs all dependencies and sets up git. When it says ✅ SETUP COMPLETE, continue.

**Test it works locally:**
```bash
npm run dev
```
Open **http://localhost:3000** — you should see the live dashboard with the 3D globe.

---

## STEP 2 — Push code to GitHub (3 min)

You have a GitHub account. Now create a repo for this project:

1. Go to **https://github.com/new**
2. Repository name: `worldsentinel`
3. Set to **Private** (you can make it public later)
4. Click **Create repository**
5. GitHub will show you commands. Run these in your terminal:

```bash
# Still inside the sentinel-nextjs folder:
git remote add origin https://github.com/YOUR_USERNAME/worldsentinel.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

✅ Your code is now on GitHub.

---

## STEP 3 — Deploy to Vercel (3 min)

Vercel is where your website lives. It's free for this scale.

1. Go to **https://vercel.com**
2. Click **Sign Up** → **Continue with GitHub** → Authorize Vercel
3. Click **Add New Project**
4. Find `worldsentinel` in the list → Click **Import**
5. Under **Framework Preset**, it will auto-detect **Next.js** ✅
6. Leave everything else as default
7. Click **Deploy**

Vercel will build and deploy your site. Takes about 60 seconds.

✅ You'll get a free URL like: `https://worldsentinel-xyz.vercel.app`
Your site is live — but we want `worldsentinel.io`.

---

## STEP 4 — Buy worldsentinel.io domain (~$39/year)

1. Go to **https://www.namecheap.com**
2. Search for: `worldsentinel.io`
3. Add to cart and buy it (~$39/year, pay by card)
4. After purchase, go to **Dashboard → Manage** on the domain

---

## STEP 5 — Connect your domain to Vercel (5 min)

**In Vercel:**
1. Open your `worldsentinel` project
2. Go to **Settings → Domains**
3. Type `worldsentinel.io` → Click **Add**
4. Also add `www.worldsentinel.io`
5. Vercel will show you DNS records to configure — they look like:

```
Type: A      Name: @      Value: 76.76.21.21
Type: CNAME  Name: www    Value: cname.vercel-dns.com
```

**In Namecheap:**
1. Go to your domain → **Manage → Advanced DNS**
2. Delete any existing A records
3. Add the records Vercel gave you (they show the exact values)
4. Click **Save Changes**

DNS propagation takes 5–30 minutes.

✅ After propagation: **https://worldsentinel.io** is your live dashboard.

---

## STEP 6 — Environment variables on Vercel

Right now everything works on free APIs with no keys. But to unlock the full roadmap, you'll add keys here later.

**Where to add them:**
Vercel Project → Settings → Environment Variables

For now, add these two (they make the branding correct):
```
NEXT_PUBLIC_APP_NAME = WORLD SENTINEL
NEXT_PUBLIC_APP_URL  = https://worldsentinel.io
```

When you're ready for Phase 2 upgrades, add keys to this same page:
```
ANTHROPIC_API_KEY    = (from console.anthropic.com)
POLYGON_API_KEY      = (from polygon.io — $29/mo)
```

---

## Future deploys — automatic after this

Every time you update code, just run:
```bash
git add .
git commit -m "describe what you changed"
git push
```
Vercel auto-detects the push and redeploys in ~60 seconds. Zero manual work.

---

## Cost summary

| Service | Cost | Notes |
|---------|------|-------|
| GitHub  | Free | Code hosting |
| Vercel  | Free | Web hosting (up to 100GB bandwidth/mo) |
| worldsentinel.io | ~$39/year | Domain on Namecheap |
| CoinGecko | Free | Crypto data |
| USGS + NASA | Free | Earthquake + disaster data |
| BBC RSS | Free | News feed |
| **Total MVP** | **~$39/year** | |
| Phase 2 (Polygon.io + Claude) | +$78/mo | Live stocks + AI briefings |

---

## Something broke?

Common fixes:

**"Module not found" errors:**
```bash
rm -rf node_modules
npm install
```

**Globe is blank / white screen:**
Make sure you're on Node.js v18+: `node --version`

**Domain not loading after 30 min:**
Check DNS at https://dnschecker.org — search for `worldsentinel.io`

**Still stuck?** Take a screenshot and share it — I'll debug it with you.
