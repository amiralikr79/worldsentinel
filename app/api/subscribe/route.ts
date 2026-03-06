import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { email, source = 'unknown' } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ ok: false, error: 'Invalid email address.' }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

    if (!RESEND_API_KEY) {
      // Graceful degradation: log and return success if Resend not configured yet
      console.warn('[subscribe] RESEND_API_KEY not set — skipping email capture');
      return NextResponse.json({ ok: true, message: 'Subscribed (email service pending setup).' });
    }

    // Add contact to Resend Audience
    const audienceRes = await fetch(
      `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID || 'default'}/contacts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
          metadata: { source },
        }),
      }
    );

    if (!audienceRes.ok && audienceRes.status !== 409) {
      const err = await audienceRes.text();
      console.error('[subscribe] Resend audience error:', err);
      return NextResponse.json({ ok: false, error: 'Failed to subscribe. Please try again.' }, { status: 500 });
    }

    // Send welcome email
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'WorldSentinel <briefing@worldsentinel.io>',
        to: [email],
        subject: '◈ You\'re on the WorldSentinel Morning Brief',
        html: `
          <div style="background:#020b18;color:#ffffff;font-family:monospace;padding:40px;max-width:600px;margin:0 auto;">
            <div style="color:#00ff88;font-size:12px;letter-spacing:4px;margin-bottom:24px;">WORLDSENTINEL</div>
            <h1 style="font-size:24px;font-weight:bold;margin-bottom:16px;letter-spacing:-0.5px;">
              You're in. The world won't wait for you.
            </h1>
            <p style="color:#7a9bb5;line-height:1.7;margin-bottom:24px;">
              Starting tomorrow, your daily intelligence briefing arrives each morning — 
              geopolitical risk, live threat scores, market signals, and climate events,
              synthesised by AI so you don't have to wade through 40 tabs.
            </p>
            <a href="https://worldsentinel.io/dashboard" 
               style="display:inline-block;background:#00ff88;color:#020b18;font-weight:bold;font-size:12px;letter-spacing:3px;padding:14px 28px;text-decoration:none;border-radius:4px;">
              ENTER THE DASHBOARD →
            </a>
            <p style="color:#3a5a7a;font-size:11px;margin-top:32px;letter-spacing:2px;">
              WORLDSENTINEL.IO · FREE GLOBAL INTELLIGENCE
            </p>
          </div>
        `,
      }),
    });

    return NextResponse.json({ ok: true, message: 'Subscribed successfully.' });
  } catch (err) {
    console.error('[subscribe] Error:', err);
    return NextResponse.json({ ok: false, error: 'Internal server error.' }, { status: 500 });
  }
}
