import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import CommandPalette from './CommandPalette';
import { routes } from '../../lib/nav';

function Breadcrumb() {
  const { pathname } = useLocation();
  const id = pathname.replace(/^\//, '').split('/')[0];
  const r = routes[id];
  if (!r) return <div className="breadcrumb"><i className="fa-solid fa-house text-[11px]" /> Home</div>;
  return (
    <div className="breadcrumb">
      <i className="fa-solid fa-house text-[11px]" />
      <span>{r.section}</span>
      {r.parent && (<><i className="fa-solid fa-chevron-right text-[9px] opacity-50" /><span>{r.parent}</span></>)}
      <i className="fa-solid fa-chevron-right text-[9px] opacity-50" />
      <span className="text-app font-semibold">{r.label}</span>
    </div>
  );
}

export default function Shell() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaletteOpen(true); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">Skip to main content</a>
      <Sidebar />
      <div className="main-col">
        <Topbar onOpenSearch={() => setPaletteOpen(true)} />
        <main id="main" className="content" tabIndex={-1}>
          <div className="page-wrap">
            <Breadcrumb />
            <Outlet />
          </div>
        </main>
      </div>
      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
    </div>
  );
}
