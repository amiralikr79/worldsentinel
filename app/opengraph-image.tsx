import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'WorldSentinel — Global Intelligence Dashboard';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#020b18',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #00ff88, transparent)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 12px #00ff88' }} />
          <span style={{ color: '#00ff88', fontSize: '14px', letterSpacing: '4px' }}>LIVE INTELLIGENCE</span>
        </div>
        <div style={{ fontSize: '72px', fontWeight: 'bold', color: '#ffffff', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
          WORLD<span style={{ color: '#00ff88' }}>SENTINEL</span>
        </div>
        <div style={{ fontSize: '24px', color: '#7a9bb5', letterSpacing: '2px', marginBottom: '48px' }}>
          THE WORLD IS MOVING. STAY AHEAD OF IT.
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {['AI BRIEFINGS', 'LIVE THREATS', 'MARKET SIGNALS', 'ZERO COST'].map((feat) => (
            <div
              key={feat}
              style={{
                border: '1px solid rgba(0,255,136,0.3)',
                borderRadius: '4px',
                padding: '8px 20px',
                color: '#00ff88',
                fontSize: '13px',
                letterSpacing: '3px',
                background: 'rgba(0,255,136,0.05)',
              }}
            >
              {feat}
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: '40px', right: '80px', color: '#7a9bb5', fontSize: '16px', letterSpacing: '2px' }}>
          worldsentinel.io
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
