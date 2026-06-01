/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        claw: {
          50: '#f8fafc',
          100: '#e5e7eb',
          200: '#cbd5e1',
          300: '#94a3b8',
          400: '#64748b',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
          800: '#111827',
          900: '#0b1120',
          950: '#050816',
        },
        ember: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        signal: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        display: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      spacing: {
        gutter: 'clamp(1rem, 3vw, 2rem)',
        section: 'clamp(4rem, 8vw, 7.5rem)',
        'section-sm': 'clamp(3rem, 6vw, 5rem)',
      },
      maxWidth: {
        content: '72rem',
        measure: '42rem',
      },
      borderRadius: {
        panel: '0.5rem',
      },
      boxShadow: {
        glow: '0 0 40px rgb(249 115 22 / 0.16)',
      },
    },
  },
  plugins: [],
};
