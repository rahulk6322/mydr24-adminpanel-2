import { PageHeader, StatCard, Card, Avatar, Status, Badge } from '../components/ui/Primitives';
import { Donut, Bars } from '../components/charts/Charts';
import DataTable from '../components/ui/DataTable';
import { leads } from '../lib/data';
import { inr } from '../lib/format';

/* ---------- Unified CRM ---------- */
export function CRM() {
  const cards = [
    ['Patient CRM', 'fa-hospital-user'], ['Doctor CRM', 'fa-user-doctor'], ['Hospital CRM', 'fa-hospital'], ['Corporate CRM', 'fa-building'],
    ['Insurance CRM', 'fa-building-shield'], ['Diagnostic CRM', 'fa-vial'], ['Franchise CRM', 'fa-code-branch'], ['Government CRM', 'fa-landmark'],
  ];
  const columns = [
    { label: 'Contact', key: 'name', render: (r) => <div className="flex items-center gap-2"><Avatar name={r.name} size={30} /><span className="font-semibold">{r.name}</span></div> },
    { label: 'Source', key: 'source', render: (r) => <Badge variant="blue">{r.source}</Badge> },
    { label: 'City', key: 'city' },
    { label: 'Stage', key: 'stage', render: (r) => <Status value={r.stage} /> },
    { label: 'Score', key: 'score', sortValue: (r) => r.score, render: (r) => <span className="metric-value text-[13px]">{r.score}</span> },
    { label: 'Value', key: 'value', sortValue: (r) => r.value, csv: (r) => r.value, render: (r) => inr(r.value) },
    { label: 'Owner', key: 'owner' },
  ];
  return (
    <>
      <PageHeader eyebrow="Growth · CRM" title="Unified CRM" subtitle="360° relationship management across patients, doctors, hospitals, corporates, insurance and partners." />
      <div className="grid-4 stagger mb-4">
        <StatCard icon="fa-address-book" value="1.42 M" label="Total Contacts" trend={11} c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-funnel-dollar" value="24%" label="Lead Conversion" trend={3} c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-headset" value="70%" label="Bot Resolution" sub="no handoff" c1="#8b5cf6" c2="#6d28d9" />
        <StatCard icon="fa-thumbs-up" value="57" label="NPS Score" trend={4} c1="#f59e0b" c2="#d97706" />
      </div>
      <div className="grid-4 stagger mb-4">
        {cards.map(([t, icon]) => (
          <Card key={t} hover className="p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3" style={{ background: 'linear-gradient(135deg,#1b7df5,#0a8b75)' }}><i className={`fa-solid ${icon}`} /></div>
            <div className="metric-value text-xl">{(Math.random() * 9000 + 120 | 0).toLocaleString('en-IN')}</div>
            <div className="text-[13px] font-semibold mt-1">{t}</div>
          </Card>
        ))}
      </div>
      <DataTable columns={columns} rows={leads} title="Recent Contacts & Leads" pageSize={8} />
    </>
  );
}

/* ---------- Lead Management ---------- */
export function Leads() {
  const columns = [
    { label: 'Lead', key: 'name', render: (r) => <div className="flex items-center gap-2"><Avatar name={r.name} size={30} /><div><div className="font-semibold">{r.name}</div><div className="text-muted text-xs font-mono">{r.id}</div></div></div> },
    { label: 'Source', key: 'source', render: (r) => <Badge variant="blue">{r.source}</Badge> },
    { label: 'Stage', key: 'stage', render: (r) => <Status value={r.stage} /> },
    { label: 'Score', key: 'score', sortValue: (r) => r.score, render: (r) => { const c = r.score > 70 ? '#16ad8f' : r.score > 40 ? '#f59e0b' : '#ef4444'; return <span className="metric-value text-[13px]" style={{ color: c }}>{r.score}</span>; } },
    { label: 'Value', key: 'value', sortValue: (r) => r.value, csv: (r) => r.value, render: (r) => inr(r.value) },
    { label: 'Owner', key: 'owner' }, { label: 'Created', key: 'created' },
  ];
  return (
    <>
      <PageHeader eyebrow="Growth · Acquisition" title="Lead Management" subtitle="Omni-channel lead capture, AI scoring, auto-assignment and pipeline automation." />
      <div className="grid-4 stagger mb-4">
        <StatCard icon="fa-filter" value="8,420" label="Active Leads" trend={12} c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-bolt" value="24%" label="Conversion Rate" trend={3} c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-phone-volume" value="15 min" label="Avg Callback" sub="missed-call" c1="#8b5cf6" c2="#6d28d9" />
        <StatCard icon="fa-star" value="68" label="Avg Lead Score" c1="#f59e0b" c2="#d97706" />
      </div>
      <div className="grid-2 mb-4">
        <Card className="p-5"><div className="section-title text-lg mb-3.5">Leads by Source</div>
          <Donut legend="bottom" height={240} data={[
            { label: 'Website', value: 24, color: '#1b7df5' }, { label: 'WhatsApp', value: 22, color: '#16ad8f' },
            { label: 'Referral', value: 18, color: '#8b5cf6' }, { label: 'Google Ads', value: 14, color: '#f59e0b' },
            { label: 'IVR', value: 12, color: '#0ea5e9' }, { label: 'Facebook', value: 10, color: '#ec4899' },
          ]} />
        </Card>
        <Card className="p-5"><div className="section-title text-lg mb-3.5">Lead Score Distribution</div>
          <Bars categories={['0-20', '21-40', '41-60', '61-80', '81-100']} legend={false} height={240} series={[{ name: 'Leads', data: [620, 1240, 2380, 2640, 1540], color: '#8b5cf6' }]} />
        </Card>
      </div>
      <DataTable columns={columns} rows={leads} title="All Leads" pageSize={8} />
    </>
  );
}
