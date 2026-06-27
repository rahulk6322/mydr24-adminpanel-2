import { PageHeader, StatCard, Card, SectionTitle, Progress, Status } from '../components/ui/Primitives';
import { AreaTrend } from '../components/charts/Charts';
import DataTable from '../components/ui/DataTable';
import { aiModels, compliance, months } from '../lib/data';
import { rnd } from '../lib/format';

/* ---------- Analytics Platform ---------- */
export function Analytics() {
  const cats = ['Executive', 'Clinical', 'Patient', 'Doctor', 'Caregiver', 'Emergency', 'Marketing', 'Finance', 'RPM', 'Operational', 'Predictive', 'Prescriptive'];
  return (
    <>
      <PageHeader eyebrow="Intelligence · Analytics" title="Analytics Platform"
        subtitle="40+ real-time dashboards · 1,000+ KPIs across a four-layer architecture (Descriptive → Diagnostic → Predictive → Prescriptive)." />
      <div className="grid-4 stagger mb-4">
        <StatCard icon="fa-chart-column" value="40+" label="Live Dashboards" c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-list-check" value="1,000+" label="Tracked KPIs" c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-layer-group" value="4" label="Analytics Layers" c1="#8b5cf6" c2="#6d28d9" />
        <StatCard icon="fa-bullseye" value="94%" label="Forecast Accuracy" c1="#f59e0b" c2="#d97706" />
      </div>
      <div className="grid-2 mb-4">
        <Card className="p-5"><SectionTitle title="Platform Growth" sub="DAU / MAU · 12 months" />
          <AreaTrend categories={months} series={[
            { name: 'MAU (10K)', data: months.map((_, i) => 38 + i * 5 + rnd(0, 4)), color: '#1b7df5', fill: true },
            { name: 'DAU (10K)', data: months.map((_, i) => 12 + i * 1.5 + rnd(0, 2)), color: '#16ad8f' },
          ]} height={260} />
        </Card>
        <Card className="p-5"><SectionTitle title="Engagement Funnel" sub="Stickiness" />
          {[['Registration', 100], ['KYC', 74], ['First Booking', 52], ['Consult Complete', 41], ['Subscription', 30]].map(([l, p]) => (
            <div className="mb-3" key={l}><div className="flex justify-between text-[13px] mb-1.5"><span>{l}</span><span className="text-muted">{p}%</span></div><Progress value={p} /></div>
          ))}
        </Card>
      </div>
      <Card className="p-5"><SectionTitle title="Dashboard Library" sub="Explore a domain" />
        <div className="grid-4 stagger">
          {cats.map((c) => (
            <div key={c} className="card-2 border border-line rounded-xl p-4 card-hover cursor-pointer">
              <i className="fa-solid fa-chart-pie text-lg mb-2 text-[#1b7df5]" />
              <div className="font-semibold text-[13.5px]">{c} Analytics</div>
              <div className="text-muted text-[11.5px] mt-0.5">{rnd(18, 84)} KPIs</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ---------- AI Model Performance ---------- */
export function AiModels() {
  return (
    <>
      <PageHeader eyebrow="Intelligence · MLOps" title="AI Model Performance"
        subtitle="9 production models with live inference · performance tracking and retraining cadence." />
      <div className="grid-4 stagger mb-4">
        <StatCard icon="fa-microchip" value="9" label="Models in Production" c1="#8b5cf6" c2="#6d28d9" />
        <StatCard icon="fa-bullseye" value="89%" label="Avg Performance" c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-bolt" value="<60s" label="Inference Latency" c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-arrows-rotate" value="Weekly" label="Fastest Retrain" c1="#f59e0b" c2="#d97706" />
      </div>
      <div className="grid-cards">
        {aiModels.map((m) => (
          <Card key={m.name} hover className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}><i className="fa-solid fa-brain" /></div>
              <Status value={m.status} />
            </div>
            <div className="font-semibold text-[14px] clamp-1">{m.name}</div>
            <div className="text-muted text-[11.5px] mb-3">{m.kpi}{m.sub ? ` · ${m.sub}` : ''}</div>
            <div className="flex items-end justify-between mb-2">
              <span className="metric-value text-2xl">{m.perf}{m.unit}</span>
              <span className="text-muted text-[11px]">retrain: {m.retrain}</span>
            </div>
            <Progress value={m.unit === '%' ? m.perf : 90} color={m.status === 'Healthy' ? '#16ad8f' : '#f59e0b'} />
          </Card>
        ))}
      </div>
    </>
  );
}

/* ---------- Compliance Center ---------- */
export function Compliance() {
  const columns = [
    { label: 'Framework', key: 'fw', render: (r) => <span className="font-semibold">{r.fw}</span> },
    { label: 'Region', key: 'region' },
    { label: 'Controls', key: 'controls', render: (r) => <span className="text-muted text-[12.5px]">{r.controls}</span> },
    { label: 'Score', key: 'score', sortValue: (r) => r.score, render: (r) => (
      <div className="flex items-center gap-2"><div className="progress w-16"><span style={{ width: `${r.score}%` }} /></div><span className="metric-value text-[12.5px]">{r.score}%</span></div>
    ) },
    { label: 'Status', key: 'status', render: (r) => <Status value={r.status} /> },
  ];
  return (
    <>
      <PageHeader eyebrow="Governance · Compliance" title="Compliance Center"
        subtitle="HIPAA, GDPR, ABDM/NDHM, DPDP Act 2023, NABH and ISO 27001 posture monitoring." />
      <div className="grid-4 stagger mb-4">
        <StatCard icon="fa-scale-balanced" value="6" label="Frameworks" c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-circle-check" value="95%" label="Avg Compliance" c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-clock-rotate-left" value="72h" label="Grievance SLA" sub="DPDP" c1="#8b5cf6" c2="#6d28d9" />
        <StatCard icon="fa-triangle-exclamation" value="1" label="Audit Due" sub="ISO 27001" c1="#f59e0b" c2="#d97706" />
      </div>
      <DataTable columns={columns} rows={compliance} title="Regulatory Compliance Matrix" pageSize={8} searchable={false} />
    </>
  );
}
