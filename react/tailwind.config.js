/** @type {import('tailwindcss').Config} */
// Design tokens are CSS variables (RGB triplets) defined in src/index.css,
// mapped here so Tailwind utilities are theme-aware (dark/light + accent).
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9ff', 100: '#d9f1ff', 200: '#bce6ff', 300: '#8ed7ff',
          400: '#59beff', 500: '#329dff', 600: '#1b7df5', 700: '#1465e1',
          800: '#1752b6', 900: '#19478f', 950: '#142c57',
        },
        app: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--c-surface-2) / <alpha-value>)',
        line: 'rgb(var(--c-border) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
      },
      textColor: {
        app: 'rgb(var(--c-text) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
      },
      backgroundColor: {
        app: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--c-surface-2) / <alpha-value>)',
      },
      borderColor: { line: 'rgb(var(--c-border) / <alpha-value>)' },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: { xl: '0.9rem', '2xl': '1.25rem', '3xl': '1.75rem' },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(10px)' }, '100%': { opacity: 1, transform: 'none' } },
      },
      animation: { 'fade-up': 'fade-up .45s cubic-bezier(.2,.7,.3,1) both' },
    },
  },
  plugins: [],
};
