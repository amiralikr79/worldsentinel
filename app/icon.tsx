import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#020b18',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          border: '1px solid rgba(0,255,136,0.4)',
        }}
      >
        <div style={{ color: '#00ff88', fontSize: '18px', fontWeight: 'bold', lineHeight: 1, fontFamily: 'monospace' }}>
          ◈
        </div>
      </div>
    ),
    { width: 32, height: 32 }
  );
}
