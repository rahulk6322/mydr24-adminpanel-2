import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader, StatCard, Card, SectionTitle, Feed } from '../components/ui/Primitives';
import { AreaTrend } from '../components/charts/Charts';
import { routes } from '../lib/nav';
import { months, makeFeed } from '../lib/data';
import { inr, num } from '../lib/format';

// Deterministic pseudo-random so a module's figures are stable per visit.
function seeded(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  return (min, max) => { s = (s * 1103515245 + 12345) & 0x7fffffff; return min + (s % (max - min + 1)); };
}

/**
 * GenericModule — consistent, data-driven template so every navigation item
 * resolves to a styled, populated page even before a bespoke screen exists.
 */
export default function GenericModule() {
  const { pathname } = useLocation();
  const id = pathname.replace(/^\//, '').split('/')[0];
  const route = routes[id] || { label: 'Module', section: 'Platform', icon: 'fa-cube' };

  const model = useMemo(() => {
    const r = seeded(id);
    return {
      stats: [
        { icon: route.icon || 'fa-cube', value: num(r(1200, 98000)), label: 'Records', trend: r(2, 18), c1: '#1b7df5', c2: '#1465e1' },
        { icon: 'fa-bolt', value: `${r(70, 99)}%`, label: 'Efficiency', trend: r(1, 9), c1: '#16ad8f', c2: '#0a8b75' },
        { icon: 'fa-clock', value: `${r(2, 12)} min`, label: 'Avg Response', c1: '#8b5cf6', c2: '#6d28d9' },
        { icon: 'fa-chart-line', value: inr(r(20, 800) * 10000), label: 'Value', trend: r(3, 22), c1: '#f59e0b', c2: '#d97706' },
      ],
      series: months.map(() => r(40, 100)),
      feed: makeFeed(6),
    };
  }, [id, route.icon]);

  return (
    <>
      <PageHeader
        eyebrow={route.parent ? `${route.section} · ${route.parent}` : route.section}
        title={route.label}
        subtitle={`This MyDR24 HOS module is part of the ${route.parent || route.section} suite — fully themed and ready for production data wiring.`}
      />
      <div className="grid-4 stagger mb-4">
        {model.stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>
      <div className="grid-3">
        <Card className="p-5 col-span-2">
          <SectionTitle title="Trend" sub="Last 12 months" />
          <AreaTrend categories={months} series={[{ name: 'Volume', data: model.series, color: '#1b7df5', fill: true }]} legend={false} height={260} />
        </Card>
        <Card className="p-5">
          <SectionTitle title="Activity" right={<span className="live-dot" />} />
          <Feed items={model.feed} />
        </Card>
      </div>
    </>
  );
}
