import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { useTheme } from '../theme';

function useAxis() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return {
    muted: dark ? '#94a3b8' : '#64748b',
    grid: dark ? 'rgba(148,163,184,.12)' : 'rgba(15,23,42,.07)',
    surface: dark ? '#111827' : '#ffffff',
    border: dark ? '#263247' : '#e2e8f0',
    text: dark ? '#e2e8f0' : '#0f172a',
  };
}
const tip = (t) => ({ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, color: t.text, fontSize: 12 });

export function RevenueArea({ data, height = 280 }) {
  const t = useAxis();
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1b7df5" stopOpacity={.35} /><stop offset="100%" stopColor="#1b7df5" stopOpacity={0} /></linearGradient>
            <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fb7185" stopOpacity={.3} /><stop offset="100%" stopColor="#fb7185" stopOpacity={0} /></linearGradient>
          </defs>
          <CartesianGrid stroke={t.grid} vertical={false} />
          <XAxis dataKey="month" stroke={t.muted} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis stroke={t.muted} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tip(t)} />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
          <Area type="monotone" dataKey="revenue" name="Revenue (₹Cr)" stroke="#1b7df5" strokeWidth={2.5} fill="url(#rev)" dot={false} />
          <Area type="monotone" dataKey="expense" name="Expense (₹Cr)" stroke="#fb7185" strokeWidth={2.5} fill="url(#exp)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function VisitsBar({ data, height = 280 }) {
  const t = useAxis();
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
          <CartesianGrid stroke={t.grid} vertical={false} />
          <XAxis dataKey="day" stroke={t.muted} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis stroke={t.muted} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tip(t)} cursor={{ fill: t.grid }} />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
          <Bar dataKey="online" name="Online" stackId="a" fill="#1b7df5" radius={[0, 0, 0, 0]} maxBarSize={32} />
          <Bar dataKey="walkIn" name="Walk-in" stackId="a" fill="#16ad8f" radius={[6, 6, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DeptDonut({ data, height = 260 }) {
  const t = useAxis();
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={2} stroke="none">
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
          <Tooltip contentStyle={tip(t)} />
          <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 12, color: t.muted }} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
