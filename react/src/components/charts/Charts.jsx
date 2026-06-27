import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { useChartTheme } from '../../context/AppContext';

// Convert (categories, series) → recharts row objects keyed by series name.
function toRows(categories, series) {
  return categories.map((cat, i) => {
    const row = { name: cat };
    series.forEach((s) => { row[s.name] = s.data[i]; });
    return row;
  });
}

function tooltipStyle(t) {
  return {
    background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12,
    color: t.text, fontSize: 12, boxShadow: '0 10px 30px -12px rgba(0,0,0,.5)',
  };
}

/* ---------- Area / line trend ---------- */
export function AreaTrend({ categories, series, height = 280, legend = true }) {
  const t = useChartTheme();
  const rows = toRows(categories, series);
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={rows} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.name} id={`g-${s.name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke={t.grid} vertical={false} />
          <XAxis dataKey="name" stroke={t.muted} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis stroke={t.muted} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={42} />
          <Tooltip contentStyle={tooltipStyle(t)} />
          {legend && <Legend wrapperStyle={{ fontSize: 12, color: t.muted }} iconType="circle" />}
          {series.map((s) => (
            <Area key={s.name} type="monotone" dataKey={s.name} stroke={s.color} strokeWidth={2.5}
              fill={s.fill ? `url(#g-${s.name})` : 'transparent'} dot={false} activeDot={{ r: 4 }} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------- Bars (grouped / stacked) ---------- */
export function Bars({ categories, series, height = 280, stacked = false, legend = true }) {
  const t = useChartTheme();
  const rows = toRows(categories, series);
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={rows} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke={t.grid} vertical={false} />
          <XAxis dataKey="name" stroke={t.muted} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis stroke={t.muted} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={42} />
          <Tooltip contentStyle={tooltipStyle(t)} cursor={{ fill: t.grid }} />
          {legend && series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />}
          {series.map((s) => (
            <Bar key={s.name} dataKey={s.name} fill={s.color} radius={[6, 6, 0, 0]} maxBarSize={34}
              stackId={stacked ? 'a' : undefined} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------- Donut ---------- */
export function Donut({ data, height = 240, legend = 'right' }) {
  const t = useChartTheme();
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" innerRadius="62%" outerRadius="92%" paddingAngle={2} stroke="none">
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
          <Tooltip contentStyle={tooltipStyle(t)} />
          <Legend layout={legend === 'right' ? 'vertical' : 'horizontal'}
            align={legend === 'right' ? 'right' : 'center'}
            verticalAlign={legend === 'right' ? 'middle' : 'bottom'}
            wrapperStyle={{ fontSize: 12, color: t.muted }} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
