import { PageHeader, StatCard, Avatar, Status, Progress } from '../components/ui/Primitives';
import DataTable from '../components/ui/DataTable';
import { doctors } from '../lib/data';
import { inr, num } from '../lib/format';

export default function Doctors() {
  const columns = [
    { label: 'Doctor', key: 'name', csv: (r) => r.name, render: (r) => (
      <div className="flex items-center gap-3">
        <Avatar name={r.name} size={34} />
        <div>
          <div className="font-semibold flex items-center gap-1.5">{r.name}{r.verified && <i className="fa-solid fa-circle-check text-xs text-accent" title="Verified" />}</div>
          <div className="text-muted text-xs font-mono">{r.id}</div>
        </div>
      </div>
    ) },
    { label: 'Specialty', key: 'specialty' },
    { label: 'City', key: 'city' },
    { label: 'Status', key: 'status', render: (r) => <Status value={r.status} /> },
    { label: 'Rating', key: 'rating', sortValue: (r) => +r.rating, render: (r) => <span className="badge badge-amber"><i className="fa-solid fa-star" />{r.rating}</span> },
    { label: 'Utilisation', key: 'utilisation', sortValue: (r) => r.utilisation, render: (r) => (
      <div className="flex items-center gap-2"><Progress value={r.utilisation} className="w-14" /><span className="text-[12px]">{r.utilisation}%</span></div>
    ) },
    { label: 'Revenue', key: 'revenue', sortValue: (r) => r.revenue, csv: (r) => r.revenue, render: (r) => <span className="metric-value text-[13px]">{inr(r.revenue)}</span> },
    { label: 'Tier', key: 'tier', render: (r) => <Status value={r.tier} /> },
  ];

  return (
    <>
      <PageHeader eyebrow="Clinical · Doctor Management" title="Doctor Directory"
        subtitle="3,420+ verified physicians · credentialing, scheduling, performance and commission." />
      <div className="grid-4 stagger mb-4">
        <StatCard icon="fa-user-doctor" value="3,420" label="Verified Doctors" trend={7} c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-circle-dot" value="312" label="Online Now" sub="64 on-call" c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-gauge" value="74%" label="Avg Utilisation" trend={3} c1="#8b5cf6" c2="#6d28d9" />
        <StatCard icon="fa-star" value="4.6/5" label="Avg Rating" sub="NPS 57" c1="#f59e0b" c2="#d97706" />
      </div>
      <DataTable columns={columns} rows={doctors} title="All Doctors" pageSize={9} />
    </>
  );
}
