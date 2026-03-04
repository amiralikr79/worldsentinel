import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // SENTINEL design system — mirror CSS vars from the HTML prototype
        navy: {
          950: '#020b18',
          900: '#040f20',
          800: '#071428',
          700: '#0a1d38',
        },
        sentinel: {
          cyan:    '#00d4ff',
          blue:    '#0088ff',
          green:   '#00ff88',
          red:     '#ff3355',
          amber:   '#ffaa00',
          purple:  '#aa44ff',
          white:   '#e8f4fd',
          muted:   '#7090b0',
        },
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
        sans: ['system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        pulse_ring: {
          '0%':   { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        ticker_scroll: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        slide_in_right: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        slide_in_left: {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(0)' },
        },
      },
      animation: {
        pulse_ring:     'pulse_ring 1.8s ease-out infinite',
        ticker:         'ticker_scroll 40s linear infinite',
        slide_in_right: 'slide_in_right 0.3s ease-out',
        slide_in_left:  'slide_in_left 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
