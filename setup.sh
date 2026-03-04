#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
#  WORLD SENTINEL — One-command setup script
#  Run this ONCE after you copy the sentinel-nextjs folder to your computer.
#
#  Usage: bash setup.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e  # Exit on any error

echo ""
echo "███████╗███████╗███╗   ██╗████████╗██╗███╗   ██╗███████╗██╗     "
echo "██╔════╝██╔════╝████╗  ██║╚══██╔══╝██║████╗  ██║██╔════╝██║     "
echo "███████╗█████╗  ██╔██╗ ██║   ██║   ██║██╔██╗ ██║█████╗  ██║     "
echo "╚════██║██╔══╝  ██║╚██╗██║   ██║   ██║██║╚██╗██║██╔══╝  ██║     "
echo "███████║███████╗██║ ╚████║   ██║   ██║██║ ╚████║███████╗███████╗ "
echo "╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝"
echo ""
echo "  Global Intelligence Dashboard — Setup"
echo "  Domain: worldsentinel.io"
echo ""

# ── Step 1: Check Node.js ────────────────────────────────────────────────────
echo "→ Checking Node.js..."
if ! command -v node &> /dev/null; then
  echo "  ✗ Node.js not found. Install from https://nodejs.org (v18+)"
  exit 1
fi
NODE_VER=$(node --version)
echo "  ✓ Node.js $NODE_VER found"

# ── Step 2: Install dependencies ────────────────────────────────────────────
echo "→ Installing dependencies..."
npm install
echo "  ✓ Dependencies installed"

# ── Step 3: Set up environment file ─────────────────────────────────────────
if [ ! -f ".env.local" ]; then
  cp .env.example .env.local
  echo "  ✓ Created .env.local from template"
  echo "    (No keys needed for free tier — everything works out of the box)"
else
  echo "  ✓ .env.local already exists, skipping"
fi

# ── Step 4: Initialize git repo (if not already) ────────────────────────────
echo "→ Initializing git repository..."
if [ ! -d ".git" ]; then
  git init
  git add .
  git commit -m "Initial commit: WORLD SENTINEL dashboard"
  echo "  ✓ Git repository initialized"
else
  echo "  ✓ Git repository already initialized"
fi

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅  SETUP COMPLETE"
echo ""
echo "  Run locally:    npm run dev"
echo "                  → Open http://localhost:3000"
echo ""
echo "  Deploy to web:  Follow DEPLOY.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
