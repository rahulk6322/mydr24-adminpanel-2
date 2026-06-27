import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { accents } from '../lib/nav';

const AppContext = createContext(null);

const PREF_DEFAULTS = { density: 'comfortable', accent: 'blue', sidebar: 'expanded', motion: 'full' };

function loadPrefs() {
  try { return { ...PREF_DEFAULTS, ...JSON.parse(localStorage.getItem('mydr24:prefs') || '{}') }; }
  catch { return { ...PREF_DEFAULTS }; }
}

function accentRgb(id) {
  return (accents.find((a) => a.id === id) || accents[0]).rgb;
}

/**
 * Single source of truth for cross-cutting app state:
 * theme, active role, active tenant, and appearance preferences.
 * Persists to localStorage and reflects changes onto <html> attributes.
 */
export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('mydr24:theme') || 'dark');
  const [role, setRole] = useState(() => localStorage.getItem('mydr24:role') || 'super_admin');
  const [tenant, setTenant] = useState(() => localStorage.getItem('mydr24:tenant') || 'mydr24-prod');
  const [prefs, setPrefs] = useState(loadPrefs);
  const [navOpen, setNavOpen] = useState(false); // mobile drawer

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mydr24:theme', theme);
  }, [theme]);

  // Apply appearance prefs
  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute('data-density', prefs.density);
    el.setAttribute('data-sidebar', prefs.sidebar);
    el.setAttribute('data-motion', prefs.motion);
    el.style.setProperty('--c-accent', accentRgb(prefs.accent));
    el.style.setProperty('--c-brand', accentRgb(prefs.accent));
    localStorage.setItem('mydr24:prefs', JSON.stringify(prefs));
  }, [prefs]);

  useEffect(() => { localStorage.setItem('mydr24:role', role); }, [role]);
  useEffect(() => { localStorage.setItem('mydr24:tenant', tenant); }, [tenant]);

  const setPref = useCallback((key, value) => setPrefs((p) => ({ ...p, [key]: value })), []);
  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, role, setRole, tenant, setTenant, prefs, setPref, navOpen, setNavOpen }),
    [theme, toggleTheme, role, tenant, prefs, setPref, navOpen]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within <AppProvider>');
  return ctx;
}

// Convenience hook for chart theming — recomputes when theme changes.
export function useChartTheme() {
  const { theme } = useApp();
  return useMemo(() => {
    const dark = theme === 'dark';
    return {
      dark,
      text: dark ? '#e2eaf7' : '#111b2b',
      muted: dark ? '#8a97ad' : '#64748b',
      grid: dark ? 'rgba(148,170,210,0.10)' : 'rgba(15,23,42,0.07)',
      surface: dark ? '#101624' : '#ffffff',
      border: dark ? '#242f44' : '#e0e6ee',
    };
  }, [theme]);
}
