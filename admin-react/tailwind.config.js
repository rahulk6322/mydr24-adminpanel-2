/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef9ff', 100: '#d9f1ff', 200: '#bce6ff', 300: '#8ed7ff',
          400: '#59beff', 500: '#329dff', 600: '#1b7df5', 700: '#1465e1',
          800: '#1752b6', 900: '#19478f', 950: '#142c57',
        },
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        line: 'rgb(var(--border) / <alpha-value>)',
        ink: 'rgb(var(--text) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.05), 0 12px 28px -16px rgba(16,24,40,.25)',
      },
      borderRadius: { xl: '0.9rem', '2xl': '1.25rem' },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'none' } },
      },
      animation: { 'fade-up': 'fade-up .4s ease both' },
    },
  },
  plugins: [],
};
