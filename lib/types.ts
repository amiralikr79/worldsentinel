// ─────────────────────────────────────────────────────────────────────────────
//  SENTINEL — Shared TypeScript types
//  Every API response and component prop is typed here.
// ─────────────────────────────────────────────────────────────────────────────

// ── Earthquake (USGS) ────────────────────────────────────────────────────────
export interface EarthquakeFeature {
  type: 'Feature';
  properties: {
    mag:    number;
    place:  string;
    time:   number;   // unix ms
    url:    string;
    title:  string;
    status: string;
    type:   string;
  };
  geometry: {
    type:        'Point';
    coordinates: [number, number, number]; // [lng, lat, depth_km]
  };
  id: string;
}

export interface EarthquakeResponse {
  type:     'FeatureCollection';
  features: EarthquakeFeature[];
  metadata: { generated: number; count: number };
}

// ── NASA EONET ───────────────────────────────────────────────────────────────
export interface NasaGeometry {
  magnitudeValue: number | null;
  magnitudeUnit:  string | null;
  date:           string;
  type:           'Point' | 'Polygon';
  coordinates:    [number, number] | [number, number][][];
}

export interface NasaEvent {
  id:          string;
  title:       string;
  description: string | null;
  link:        string;
  closed:      string | null;
  categories:  { id: string; title: string }[];
  sources:     { id: string; url: string }[];
  geometry:    NasaGeometry[];
}

export interface NasaResponse {
  title:       string;
  description: string;
  link:        string;
  events:      NasaEvent[];
}

// ── Crypto (CoinGecko) ───────────────────────────────────────────────────────
export type CoinId = 'bitcoin' | 'ethereum' | 'solana' | 'binancecoin' | 'xrp';

export interface CoinData {
  usd:              number;
  usd_24h_change:   number;
  usd_market_cap:   number;
  usd_24h_vol:      number;
}

export type CryptoResponse = Record<CoinId, CoinData>;

// ── News (RSS via rss2json) ──────────────────────────────────────────────────
export interface NewsItem {
  title:       string;
  link:        string;
  pubDate:     string;
  description: string;
  thumbnail:   string;
  author:      string;
  // Derived on client
  category?:   NewsCategory;
  ts?:         number;
}

export type NewsCategory =
  | 'CONFLICT'
  | 'ECONOMY'
  | 'CLIMATE'
  | 'HEALTH'
  | 'TECH'
  | 'POLITICS'
  | 'WORLD';

export interface NewsResponse {
  status:  'ok' | 'error';
  feed:    { title: string; link: string };
  items:   NewsItem[];
}

// ── Market Indices (simulated → Polygon.io in Phase 2) ───────────────────────
export interface IndexData {
  symbol:  string;
  name:    string;
  price:   number;
  change:  number;  // absolute
  changePct: number;
  open:    number;
}

// ── Globe Marker ─────────────────────────────────────────────────────────────
export type MarkerType = 'quake' | 'disaster' | 'conflict' | 'economy' | 'health';

export interface GlobeMarker {
  id:       string;
  lat:      number;
  lng:      number;
  type:     MarkerType;
  label:    string;
  magnitude?: number;   // for quakes: Richter; for others: severity 1-5
}

// ── Watchlist ────────────────────────────────────────────────────────────────
export interface Watchlist {
  regions: string[];
  assets:  string[];
}

// ── AI Briefing ──────────────────────────────────────────────────────────────
export interface BriefingSection {
  title:   string;
  icon:    string;
  content: string;
}

export interface DailyBriefing {
  generatedAt: string;
  summary:     string;
  sections:    BriefingSection[];
  riskLevel:   'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  riskScore:   number;  // 0-100
}

// ── API route response wrappers ──────────────────────────────────────────────
export interface ApiSuccess<T> {
  ok:        true;
  data:      T;
  cachedAt?: number;
}

export interface ApiError {
  ok:      false;
  error:   string;
  code?:   number;
}

export type ApiResult<T> = ApiSuccess<T> | ApiError;
