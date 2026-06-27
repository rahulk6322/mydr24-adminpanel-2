// Tailwind Play CDN runtime configuration for MyDR24 HOS
// Maps design tokens (CSS variables) to Tailwind utilities so the
// enterprise theme + dark/light mode work seamlessly with utility classes.
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9ff', 100: '#d9f1ff', 200: '#bce6ff', 300: '#8ed7ff',
          400: '#59beff', 500: '#329dff', 600: '#1b7df5', 700: '#1465e1',
          800: '#1752b6', 900: '#19478f', 950: '#142c57',
        },
        teal: {
          50: '#edfcf7', 100: '#d3f8ec', 200: '#aaefda', 300: '#72e0c4',
          400: '#39c8a8', 500: '#16ad8f', 600: '#0a8b75', 700: '#0a6f5f',
          800: '#0c584d', 900: '#0c4940', 950: '#042a26',
        },
        // Semantic surfaces resolve to CSS variables (theme aware)
        app: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--c-surface-2) / <alpha-value>)',
        line: 'rgb(var(--c-border) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
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
      borderColor: {
        line: 'rgb(var(--c-border) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--c-border) / 0.6), 0 8px 30px -12px rgb(var(--c-shadow) / 0.45)',
        card: '0 1px 2px rgb(var(--c-shadow) / 0.06), 0 12px 32px -16px rgb(var(--c-shadow) / 0.35)',
      },
      borderRadius: { xl: '0.9rem', '2xl': '1.25rem', '3xl': '1.75rem' },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'pulse-ring': { '0%': { transform: 'scale(.8)', opacity: .7 }, '100%': { transform: 'scale(2.2)', opacity: 0 } },
      },
      animation: {
        'fade-up': 'fade-up .4s ease both',
        'pulse-ring': 'pulse-ring 1.6s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    },
  },
};
