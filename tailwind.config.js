/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        brand: 'rgb(var(--brand) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', '"Cascadia Code"', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgb(0 0 0 / 0.25)',
        glow: '0 0 0 1px rgb(var(--brand) / 0.35), 0 12px 40px -10px rgb(var(--brand) / 0.45)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        drift: { '0%': { transform: 'translate(0,0) scale(1)' }, '100%': { transform: 'translate(40px,-30px) scale(1.15)' } },
      },
      animation: { float: 'float 6s ease-in-out infinite', drift: 'drift 14s ease-in-out infinite alternate' },
    },
  },
  plugins: [],
};
