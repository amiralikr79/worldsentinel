'use client';

import { useState } from 'react';

type State = 'idle' | 'loading' | 'success' | 'error';

interface EmailCaptureProps {
  source?: string;
  placeholder?: string;
  ctaText?: string;
  className?: string;
}

export default function EmailCapture({
  source = 'landing',
  placeholder = 'Enter your email address',
  ctaText = 'GET MORNING BRIEF →',
  className = '',
}: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      setState('error');
      return;
    }

    setState('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setState('success');
        setEmail('');
      } else {
        setErrorMsg(data.error || 'Something went wrong. Try again.');
        setState('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <div className="flex items-center gap-3 border border-[#00ff88]/40 bg-[#00ff88]/5 rounded px-6 py-4">
          <span className="text-[#00ff88] text-lg">✓</span>
          <div>
            <p className="text-[#00ff88] text-sm font-mono tracking-widest">YOU&apos;RE IN</p>
            <p className="text-[#7a9bb5] text-xs mt-1">First brief lands tomorrow morning.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-3 w-full max-w-lg ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === 'error') setState('idle');
          }}
          placeholder={placeholder}
          disabled={state === 'loading'}
          className="
            flex-1 bg-[#0a1628] border border-[#1a2f4a] rounded px-4 py-3
            text-white font-mono text-sm placeholder-[#3a5a7a]
            focus:outline-none focus:border-[#00ff88]/50 focus:ring-1 focus:ring-[#00ff88]/20
            disabled:opacity-50 transition-colors
          "
          required
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="
            bg-[#00ff88] text-[#020b18] font-mono font-bold text-xs tracking-widest
            px-6 py-3 rounded hover:bg-[#00cc70] transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap
          "
        >
          {state === 'loading' ? 'SUBSCRIBING...' : ctaText}
        </button>
      </div>

      {state === 'error' && errorMsg && (
        <p className="text-red-400 text-xs font-mono tracking-wide">{errorMsg}</p>
      )}

      <p className="text-[#3a5a7a] text-xs font-mono">
        No spam. Unsubscribe any time. Free forever.
      </p>
    </form>
  );
}
