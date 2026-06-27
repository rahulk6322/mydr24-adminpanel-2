import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { roles, tenants, accents } from '../../lib/nav';
import { notifications } from '../../lib/data';
import { Avatar } from '../ui/Primitives';
import Dropdown from '../ui/Dropdown';

export default function Topbar({ onOpenSearch }) {
  const { theme, toggleTheme, role, setRole, tenant, setTenant, prefs, setPref, setNavOpen } = useApp();
  const toast = useToast();
  const roleMeta = roles[role];
  const tenantMeta = tenants.find((t) => t.id === tenant) || tenants[0];

  return (
    <header className="topbar" role="banner">
      <button className="icon-btn lg:hidden" onClick={() => setNavOpen(true)} aria-label="Open menu">
        <i className="fa-solid fa-bars" />
      </button>

      <div className="topbar-search hidden sm:block">
        <button onClick={onOpenSearch} aria-label="Search">
          <i className="fa-solid fa-magnifying-glass text-xs" />
          <span>Search patients, doctors, modules…</span>
          <kbd>⌘K</kbd>
        </button>
      </div>
      <button className="icon-btn sm:hidden" onClick={onOpenSearch} aria-label="Search">
        <i className="fa-solid fa-magnifying-glass" />
      </button>

      <div className="flex items-center gap-2 ml-auto">
        {/* Tenant switcher */}
        <Dropdown align="right" width={300} trigger={
          <button className="role-chip hidden sm:flex" title="Switch tenant" aria-label="Switch tenant">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg,#1b7df5,#0a8b75)' }}>
              <i className={`fa-solid ${tenantMeta.icon} text-xs`} />
            </span>
            <span className="text-left leading-tight">
              <span className="block text-[12.5px] font-semibold">{tenantMeta.name.split(' · ')[0].split(' (')[0]}</span>
              <span className="block text-[10.5px] text-muted">{tenantMeta.type}</span>
            </span>
            <i className="fa-solid fa-chevron-down text-[10px] text-muted ml-1" />
          </button>
        }>
          {(close) => (
            <>
              <div className="px-3 py-2 font-semibold text-sm">Multi-Tenant Workspace</div>
              <div className="menu-sep" />
              {tenants.map((t) => (
                <button key={t.id} className="menu-item" onClick={() => { setTenant(t.id); close(); toast({ title: 'Workspace switched', text: t.name, type: 'success' }); }}>
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-none" style={{ background: 'linear-gradient(135deg,#1b7df5,#0a8b75)' }}>
                    <i className={`fa-solid ${t.icon} text-xs`} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold clamp-1">{t.name}</span>
                    <span className="block text-muted text-[11px]">{t.type}</span>
                  </span>
                  {t.id === tenant && <i className="fa-solid fa-check ml-auto text-accent" />}
                </button>
              ))}
            </>
          )}
        </Dropdown>

        {/* Appearance */}
        <Dropdown align="right" width={290} trigger={
          <button className="icon-btn" title="Appearance" aria-label="Appearance settings"><i className="fa-solid fa-sliders" /></button>
        }>
          {() => (
            <>
              <div className="px-3 py-2 font-semibold text-sm">Appearance</div>
              <div className="menu-sep" />
              <div className="px-3 py-2 space-y-3">
                <Segment label="Density" value={prefs.density} onChange={(v) => setPref('density', v)}
                  options={[{ v: 'comfortable', l: 'Comfortable' }, { v: 'compact', l: 'Compact' }]} />
                <Segment label="Sidebar" value={prefs.sidebar} onChange={(v) => setPref('sidebar', v)}
                  options={[{ v: 'expanded', l: 'Expanded' }, { v: 'rail', l: 'Rail' }]} />
                <Segment label="Motion" value={prefs.motion} onChange={(v) => setPref('motion', v)}
                  options={[{ v: 'full', l: 'Full' }, { v: 'reduced', l: 'Reduced' }]} />
                <div>
                  <div className="text-muted text-[11.5px] font-semibold mb-1.5">Accent color</div>
                  <div className="flex gap-2.5 px-0.5">
                    {accents.map((a) => (
                      <span key={a.id} className={`swatch ${prefs.accent === a.id ? 'active' : ''}`}
                        style={{ background: a.hex }} title={a.id} onClick={() => setPref('accent', a.id)} />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </Dropdown>

        {/* Theme */}
        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
          <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
        </button>

        {/* Notifications */}
        <Dropdown align="right" width={320} trigger={
          <button className="icon-btn" title="Notifications" aria-label="Notifications">
            <i className="fa-solid fa-bell" /><span className="dot" />
          </button>
        }>
          {() => (
            <>
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="font-semibold text-sm">Notifications</span>
                <span className="badge badge-red">5 new</span>
              </div>
              <div className="menu-sep" />
              {notifications.map((n, i) => (
                <div key={i} className="menu-item items-start">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-none" style={{ background: n.color + '22', color: n.color }}>
                    <i className={`fa-solid ${n.icon} text-xs`} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold">{n.title}</span>
                    <span className="block text-muted text-[11.5px] clamp-2">{n.text}</span>
                  </span>
                  <span className="text-muted text-[10px] ml-auto whitespace-nowrap">{n.time}</span>
                </div>
              ))}
            </>
          )}
        </Dropdown>

        {/* Role */}
        <Dropdown align="right" width={260} trigger={
          <button className="role-chip" title="Switch role" aria-label="Switch role">
            <Avatar name={roleMeta.label} size={30} />
            <span className="text-left leading-tight hidden sm:block">
              <span className="block text-[12.5px] font-semibold">{roleMeta.label}</span>
              <span className="block text-[10.5px] text-muted">{roleMeta.desc}</span>
            </span>
            <i className="fa-solid fa-chevron-down text-[10px] text-muted ml-1 hidden sm:block" />
          </button>
        }>
          {(close) => (
            <>
              <div className="px-3 py-2 font-semibold text-sm">Switch role · RBAC</div>
              <div className="menu-sep" />
              {Object.entries(roles).map(([key, r]) => (
                <button key={key} className="menu-item" onClick={() => { setRole(key); close(); toast({ title: 'Role switched', text: `Now viewing as ${r.label}`, type: 'success' }); }}>
                  <Avatar name={r.label} size={28} />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold">{r.label}</span>
                    <span className="block text-muted text-[11px]">{r.desc}</span>
                  </span>
                  {key === role && <i className="fa-solid fa-check ml-auto text-accent" />}
                </button>
              ))}
            </>
          )}
        </Dropdown>
      </div>
    </header>
  );
}

function Segment({ label, value, onChange, options }) {
  return (
    <div>
      <div className="text-muted text-[11.5px] font-semibold mb-1.5">{label}</div>
      <div className="flex gap-1.5 p-1 rounded-xl card-2 border border-line">
        {options.map((o) => (
          <button key={o.v} onClick={() => onChange(o.v)}
            className={`btn btn-sm flex-1 ${value === o.v ? 'btn-primary' : 'btn-ghost'}`}>{o.l}</button>
        ))}
      </div>
    </div>
  );
}
