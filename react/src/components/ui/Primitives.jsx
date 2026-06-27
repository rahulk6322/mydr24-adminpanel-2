import { initials, colorFor, statusVariant } from '../../lib/format';

/* ---------- Card ---------- */
export function Card({ className = '', hover = false, children, ...rest }) {
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${className}`} {...rest}>
      {children}
    </div>
  );
}

/* ---------- Badge / Status ---------- */
export function Badge({ variant = 'slate', children, className = '' }) {
  return <span className={`badge badge-${variant} ${className}`}>{children}</span>;
}
export function Status({ value }) {
  return <Badge variant={statusVariant(value)}>{value}</Badge>;
}

/* ---------- Button ---------- */
export function Button({ variant = 'ghost', size = '', icon, children, className = '', ...rest }) {
  return (
    <button className={`btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${className}`} {...rest}>
      {icon && <i className={`fa-solid ${icon}`} />}
      {children}
    </button>
  );
}

/* ---------- Avatar ---------- */
export function Avatar({ name, size = 36 }) {
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: Math.round(size * 0.36), background: colorFor(name) }}>
      {initials(name)}
    </span>
  );
}

/* ---------- Trend pill ---------- */
export function Trend({ value, positiveGood = true }) {
  const up = value >= 0;
  const good = up === positiveGood;
  return (
    <span className={`badge ${good ? 'badge-green' : 'badge-red'}`}>
      <i className={`fa-solid ${up ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`} />
      {Math.abs(value)}%
    </span>
  );
}

/* ---------- Stat Card ---------- */
export function StatCard({ icon, value, label, sub, trend, positiveGood = true, c1 = '#1b7df5', c2 = '#0a8b75' }) {
  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-base"
          style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
          <i className={`fa-solid ${icon}`} />
        </div>
        {trend !== undefined && <Trend value={trend} positiveGood={positiveGood} />}
      </div>
      <div className="mt-4 metric-value text-[27px] leading-none">{value}</div>
      <div className="text-muted text-[13px] mt-1.5 flex items-center gap-2">
        {label}
        {sub && <span className="text-[11px] opacity-70">· {sub}</span>}
      </div>
    </Card>
  );
}

/* ---------- KPI Ring ---------- */
export function Ring({ pct, label, value, color = '#1b7df5' }) {
  const r = 34, c = 2 * Math.PI * r, off = c - (pct / 100) * c;
  return (
    <div className="flex items-center gap-3.5">
      <div className="relative" style={{ width: 84, height: 84 }}>
        <svg width="84" height="84" style={{ transform: 'rotate(-90deg)' }}>
          <circle className="ring-bg" cx="42" cy="42" r={r} fill="none" strokeWidth="8" />
          <circle cx="42" cy="42" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={off} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display font-extrabold text-base">{pct}%</div>
      </div>
      <div>
        <div className="metric-value text-xl">{value}</div>
        <div className="text-muted text-xs mt-0.5">{label}</div>
      </div>
    </div>
  );
}

/* ---------- Progress ---------- */
export function Progress({ value, color, className = '' }) {
  return (
    <div className={`progress ${className}`}>
      <span style={{ width: `${value}%`, ...(color ? { background: color } : {}) }} />
    </div>
  );
}

/* ---------- Section title ---------- */
export function SectionTitle({ title, sub, right }) {
  return (
    <div className="flex items-center justify-between mb-3.5">
      <div>
        <h3 className="section-title text-lg">{title}</h3>
        {sub && <p className="text-muted text-xs mt-0.5">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

/* ---------- Page header ---------- */
export function PageHeader({ eyebrow, title, subtitle, actions = [] }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-5 anim-fade">
      <div className="min-w-0">
        {eyebrow && <div className="eyebrow mb-1.5">{eyebrow}</div>}
        <h1 className="section-title text-[26px] sm:text-[30px] leading-tight">{title}</h1>
        {subtitle && <p className="text-muted text-sm mt-1.5 max-w-2xl">{subtitle}</p>}
      </div>
      {actions.length > 0 && (
        <div className="flex items-center gap-2.5 flex-wrap">
          {actions.map((a, i) => (
            <Button key={i} variant={a.variant || 'ghost'} icon={a.icon} onClick={a.onClick}>{a.label}</Button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Tile ---------- */
export function Tile({ icon, title, text, right, color = '#1b7df5' }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl card-2 border border-line">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-none" style={{ background: color }}>
        <i className={`fa-solid ${icon}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold clamp-1">{title}</div>
        <div className="text-muted text-xs clamp-1">{text}</div>
      </div>
      {right && <div className="text-right flex-none">{right}</div>}
    </div>
  );
}

/* ---------- Activity feed ---------- */
export function Feed({ items }) {
  return (
    <div className="space-y-0">
      {items.map((f, i) => (
        <div key={i} className="feed-item pb-4 last:pb-0">
          {i < items.length - 1 && <span className="feed-line" />}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[13px] font-semibold flex items-center gap-2">
                <i className={`fa-solid ${f.icon} text-xs`} style={{ color: f.color }} />
                {f.type}
              </div>
              <div className="text-muted text-xs mt-0.5 clamp-1">{f.text}</div>
            </div>
            <div className="text-muted text-[11px] whitespace-nowrap font-mono">{f.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Key/value row ---------- */
export function KV({ k, v }) {
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgb(var(--c-border) / .5)' }}>
      <span className="text-muted text-[13px]">{k}</span>
      <span className="metric-value text-[15px]">{v}</span>
    </div>
  );
}

/* ---------- Skeleton ---------- */
export function Skeleton({ className = '' }) {
  return <div className={`relative overflow-hidden card-2 rounded-xl ${className}`} style={{ minHeight: 14 }} />;
}
