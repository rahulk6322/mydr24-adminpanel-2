import { useState } from 'react';
import { initials, color } from '../data';

export function PageTitle({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6 animate-fade-up">
      <div>
        {eyebrow && <div className="text-[11px] tracking-[0.14em] uppercase font-bold text-muted mb-1.5">{eyebrow}</div>}
        <h1 className="font-display text-2xl sm:text-[28px] font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted text-sm mt-1.5 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>}
    </div>
  );
}

export function Card({ className = '', children }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function SectionHeader({ title, sub, right }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-display font-bold text-lg">{title}</h3>
        {sub && <p className="text-muted text-xs mt-0.5">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function Badge({ tone = 'slate', children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

const STATUS_TONE = {
  Available: 'green', 'In Stock': 'green', Confirmed: 'green', Completed: 'green', Discharged: 'green', Premium: 'violet',
  Pending: 'amber', Low: 'amber', 'Out-patient': 'blue', 'In Surgery': 'blue', Standard: 'blue', Insurance: 'blue',
  Critical: 'red', 'Out of Stock': 'red', Cancelled: 'red', Admitted: 'amber', 'On Leave': 'slate', Basic: 'slate',
};
export function StatusBadge({ value }) {
  return <Badge tone={STATUS_TONE[value] || 'slate'}>{value}</Badge>;
}

export function Avatar({ name, size = 36 }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full text-white font-bold flex-none"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36), background: color(name) }}>
      {initials(name)}
    </span>
  );
}

export function Progress({ value, tone = '#1b7df5' }) {
  return (
    <div className="h-2 rounded-full bg-line overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: tone }} />
    </div>
  );
}

export function StatCard({ icon, label, value, sub, trend, c1 = '#1b7df5', c2 = '#0a8b75' }) {
  const up = trend >= 0;
  return (
    <Card className="p-5 hover:-translate-y-0.5 transition-transform">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg"
          style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
          <i className={`fa-solid ${icon}`} />
        </div>
        {trend !== undefined && (
          <span className={`badge ${up ? 'badge-green' : 'badge-red'}`}>
            <i className={`fa-solid ${up ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`} />{Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="metric text-[26px] mt-4 leading-none">{value}</div>
      <div className="text-muted text-[13px] mt-1.5">{label}{sub && <span className="opacity-70"> · {sub}</span>}</div>
    </Card>
  );
}

/**
 * DataTable — searchable, lightweight table.
 * columns: [{ key, label, render?(row), align? }]
 */
export function DataTable({ columns, rows, title, sub, searchable = true }) {
  const [q, setQ] = useState('');
  const filtered = q
    ? rows.filter((r) => columns.map((c) => (c.key ? r[c.key] : '')).join(' ').toLowerCase().includes(q.toLowerCase()))
    : rows;

  return (
    <Card className="overflow-hidden">
      {(title || searchable) && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-4">
          <div>
            {title && <h3 className="font-display font-bold text-lg">{title}</h3>}
            {sub && <p className="text-muted text-xs mt-0.5">{sub}</p>}
          </div>
          {searchable && (
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…"
                className="input !py-2 !pl-9 !w-48 sm:!w-60" aria-label="Search table" />
            </div>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line">
              {columns.map((c, i) => (
                <th key={i} className={`px-4 py-3 text-[11px] uppercase tracking-wide font-bold text-muted text-left ${c.align === 'right' ? 'text-right' : ''}`}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, ri) => (
              <tr key={ri} className="border-b border-line/60 hover:bg-surface-2 transition-colors">
                {columns.map((c, ci) => (
                  <td key={ci} className={`px-4 py-3 ${c.align === 'right' ? 'text-right' : ''}`}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-muted">No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
