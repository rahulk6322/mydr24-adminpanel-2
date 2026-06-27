import { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import { routes } from '../../lib/nav';
import { patients, doctors, leads } from '../../lib/data';

const GROUP_ORDER = ['Help', 'Modules', 'Patients', 'Doctors', 'Leads'];

export default function CommandPalette({ onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const listRef = useRef(null);

  const index = useMemo(() => {
    const items = [];
    items.push({ kind: 'Help', icon: 'fa-book', label: 'Help & Documentation', sub: 'Open the README', href: 'https://github.com/rahulk6322/mydr24-adminpanel-2#readme' });
    Object.entries(routes).forEach(([id, r]) =>
      items.push({ kind: 'Modules', icon: r.icon || 'fa-circle', label: r.label, sub: `${r.parent ? r.parent + ' · ' : ''}${r.section}`, to: `/${id}` }));
    patients.slice(0, 40).forEach((p) =>
      items.push({ kind: 'Patients', icon: 'fa-hospital-user', label: p.name, sub: `${p.id} · ${p.condition} · ${p.city}`, to: `/patients/${p.id}` }));
    doctors.slice(0, 30).forEach((d) =>
      items.push({ kind: 'Doctors', icon: 'fa-user-doctor', label: d.name, sub: `${d.id} · ${d.specialty}`, to: '/doctors' }));
    leads.slice(0, 20).forEach((l) =>
      items.push({ kind: 'Leads', icon: 'fa-filter', label: l.name, sub: `${l.id} · ${l.source} · ${l.stage}`, to: '/leads' }));
    return items;
  }, []);

  const flat = useMemo(() => {
    const q = query.toLowerCase().trim();
    const matched = index.filter((it) => !q || `${it.label} ${it.sub}`.toLowerCase().includes(q));
    const out = [];
    GROUP_ORDER.forEach((g) => {
      const rows = matched.filter((m) => m.kind === g).slice(0, q ? 8 : 6);
      if (rows.length) out.push({ group: g, rows });
    });
    return out;
  }, [index, query]);

  const linear = useMemo(() => flat.flatMap((g) => g.rows), [flat]);

  useEffect(() => { setSel(0); }, [query]);

  const activate = (it) => {
    if (!it) return;
    onClose();
    if (it.to) navigate(it.to);
    else if (it.href) window.open(it.href, '_blank');
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, linear.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); activate(linear[sel]); }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  let idx = -1;
  return (
    <Modal title="Command Palette" subtitle={`${index.length} modules & records · ↑↓ to navigate · ↵ to open`} icon="fa-magnifying-glass" onClose={onClose}>
      <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown}
        className="input mb-3" placeholder="Type a module, patient, doctor or lead…" aria-label="Command palette search" />
      <div ref={listRef} className="max-h-[46vh] overflow-y-auto -mx-1" role="listbox">
        {flat.length === 0 && <div className="p-6 text-center text-muted text-sm">No results for “{query}”.</div>}
        {flat.map((g) => (
          <div key={g.group}>
            <div className="text-[10.5px] tracking-wider uppercase font-bold text-muted px-3 pt-2.5 pb-1">{g.group}</div>
            {g.rows.map((it) => {
              idx += 1; const active = idx === sel; const myIdx = idx;
              return (
                <button key={it.label + myIdx} data-active={active}
                  onMouseMove={() => setSel(myIdx)} onClick={() => activate(it)}
                  className="menu-item w-full"
                  style={active ? { background: 'rgb(var(--c-accent) / .14)', boxShadow: 'inset 2px 0 0 rgb(var(--c-accent))' } : undefined}>
                  <i className={`fa-solid ${it.icon}`} />
                  <span className="flex-1 min-w-0 text-left">
                    <span className="block text-[13px] font-medium clamp-1">{it.label}</span>
                    <span className="block text-muted text-[11px] clamp-1">{it.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </Modal>
  );
}
