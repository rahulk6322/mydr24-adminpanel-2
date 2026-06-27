import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { nav } from '../../lib/nav';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../ui/Primitives';

function Leaf({ item, onNavigate }) {
  return (
    <NavLink
      to={`/${item.id}`}
      onClick={onNavigate}
      data-tip={item.label}
      className={({ isActive }) =>
        `nav-item group ${isActive ? 'active' : ''}`}
    >
      <i className={`nav-ico fa-solid ${item.icon}`} aria-hidden="true" />
      <span className="label">{item.label}</span>
      {item.badge && <span className="nav-badge">{item.badge}</span>}
    </NavLink>
  );
}

function Parent({ item, onNavigate }) {
  const location = useLocation();
  const childActive = item.children.some((c) => location.pathname === `/${c.id}`);
  const [open, setOpen] = useState(childActive);

  return (
    <div className={`nav-parent ${open || childActive ? 'open' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open || childActive}
        data-tip={item.label}
        className="nav-item w-full"
      >
        <i className={`nav-ico fa-solid ${item.icon}`} aria-hidden="true" />
        <span className="label">{item.label}</span>
        <i className={`chev fa-solid fa-chevron-right label`} aria-hidden="true" />
      </button>
      <div className="nav-children" style={{ maxHeight: open || childActive ? 1200 : 0 }}>
        {item.children.map((c) => <Leaf key={c.id} item={c} onNavigate={onNavigate} />)}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { role, navOpen, setNavOpen, setPref, prefs } = useApp();
  const roleMeta = { label: 'Aryan Kapoor' };
  const close = () => setNavOpen(false);

  return (
    <>
      <div className={`scrim ${navOpen ? 'show' : ''}`} onClick={close} />
      <aside className={`sidebar ${navOpen ? 'open' : ''}`} role="navigation" aria-label="Primary navigation">
        <div className="sidebar-head">
          <div className="brand-mark"><i className="fa-solid fa-staff-snake" aria-hidden="true" /></div>
          <div className="min-w-0 label">
            <div className="brand-name">MyDR24</div>
            <div className="brand-sub">Healthcare OS</div>
          </div>
          <button
            className="collapse-btn ml-auto w-8 h-8 rounded-lg hidden lg:flex items-center justify-center text-muted hover:text-app hover:bg-surface-2"
            onClick={() => setPref('sidebar', prefs.sidebar === 'rail' ? 'expanded' : 'rail')}
            title="Collapse sidebar" aria-label="Collapse sidebar"
          >
            <i className="fa-solid fa-angles-left text-xs" />
          </button>
          <button className="lg:hidden ml-auto w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:bg-surface-2"
            onClick={close} aria-label="Close menu">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="sidebar-scroll">
          {nav.map((sec) => (
            <div className="nav-group" key={sec.section}>
              <div className="nav-group-label label">{sec.section}</div>
              {sec.items.map((item, i) =>
                item.children
                  ? <Parent key={item.label} item={item} onNavigate={close} />
                  : <Leaf key={item.id} item={item} onNavigate={close} />
              )}
            </div>
          ))}
        </div>

        <div className="sidebar-foot">
          <div className="flex items-center gap-3 p-2.5 rounded-xl card-2 border border-line">
            <Avatar name={roleMeta.label} size={36} />
            <div className="min-w-0 flex-1 label">
              <div className="text-sm font-semibold clamp-1">{roleMeta.label}</div>
              <div className="text-muted text-[11px] clamp-1">{role.replace('_', ' ')}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
