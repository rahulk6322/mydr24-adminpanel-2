import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../theme';
import { Avatar } from './ui';

export const NAV = [
  { to: '/', label: 'Dashboard', icon: 'fa-gauge-high', end: true },
  { to: '/patients', label: 'Patients', icon: 'fa-hospital-user' },
  { to: '/doctors', label: 'Doctors', icon: 'fa-user-doctor' },
  { to: '/appointments', label: 'Appointments', icon: 'fa-calendar-check' },
  { to: '/departments', label: 'Departments', icon: 'fa-sitemap' },
  { to: '/pharmacy', label: 'Pharmacy', icon: 'fa-prescription-bottle-medical' },
  { to: '/reports', label: 'Reports', icon: 'fa-chart-column' },
  { to: '/settings', label: 'Settings', icon: 'fa-gear' },
];

function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:sticky top-0 z-50 h-screen w-[260px] flex-none flex flex-col border-r border-line bg-surface/80 backdrop-blur-xl transition-transform ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center gap-3 px-5 border-b border-line">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg" style={{ background: 'linear-gradient(135deg,#1b7df5,#0a8b75)' }}>
            <i className="fa-solid fa-staff-snake" />
          </div>
          <div>
            <div className="font-display font-extrabold text-lg leading-none">MyDR24</div>
            <div className="text-[10.5px] uppercase tracking-[0.12em] text-muted mt-1">Admin Panel</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <i className={`fa-solid ${n.icon} w-5 text-center text-muted`} />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-line">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-2 border border-line">
            <Avatar name="Aryan Kapoor" size={36} />
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">Aryan Kapoor</div>
              <div className="text-muted text-[11px]">Super Admin</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({ onMenu }) {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const current = NAV.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to) && n.to !== '/')) || NAV[0];
  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-6 border-b border-line bg-surface/80 backdrop-blur-xl">
      <button className="lg:hidden w-9 h-9 rounded-lg text-muted hover:bg-surface-2" onClick={onMenu} aria-label="Menu">
        <i className="fa-solid fa-bars" />
      </button>
      <div className="hidden sm:flex items-center gap-2 text-sm text-muted">
        <i className="fa-solid fa-house text-xs" />
        <i className="fa-solid fa-chevron-right text-[9px] opacity-50" />
        <span className="text-ink font-semibold">{current.label}</span>
      </div>
      <div className="relative ml-auto hidden md:block w-72">
        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted" />
        <input className="input !pl-9 !py-2" placeholder="Search patients, doctors…" aria-label="Search" />
      </div>
      <button onClick={toggle} className="w-10 h-10 rounded-xl text-muted hover:bg-surface-2 hover:text-primary-600 border border-transparent hover:border-line" title="Toggle theme" aria-label="Toggle theme">
        <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
      </button>
      <button className="w-10 h-10 rounded-xl text-muted hover:bg-surface-2 relative border border-transparent hover:border-line" title="Notifications" aria-label="Notifications">
        <i className="fa-solid fa-bell" />
        <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-400" />
      </button>
      <Avatar name="Aryan Kapoor" size={36} />
    </header>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 max-w-[1500px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
