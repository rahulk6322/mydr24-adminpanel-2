import { PageHeader, StatCard, Card, SectionTitle, Progress, Tile, Status } from '../../components/ui/Primitives';
import { AreaTrend, Bars, Donut } from '../../components/charts/Charts';
import { months, revenueSeries, serviceMix, zonesGeo, aiModels } from '../../lib/data';
import { inr } from '../../lib/format';

const r = (a) => a[Math.floor(Math.random() * a.length)];

function BarList({ rows }) {
  return rows.map(([label, pct, color], i) => (
    <div className="mb-3" key={i}>
      <div className="flex justify-between text-[13px] mb-1.5"><span>{label}</span><span className="metric-value">{pct}%</span></div>
      <Progress value={pct} color={color} />
    </div>
  ));
}

const CONFIGS = {
  'dash-ceo': {
    eyebrow: 'Leadership · CEO & Founder', title: 'CEO Command Dashboard',
    subtitle: 'North-star metrics, growth, valuation drivers and strategic risk.',
    stats: [
      { icon: 'fa-indian-rupee-sign', value: '₹46.08 Cr', label: 'Annual Recurring Revenue', trend: 22, c1: '#16ad8f', c2: '#0a8b75' },
      { icon: 'fa-rocket', value: '11.4x', label: 'LTV : CAC Ratio', sub: 'target >10x', trend: 9, c1: '#8b5cf6', c2: '#6d28d9' },
      { icon: 'fa-fire-flame-curved', value: '18 mo', label: 'Cash Runway', trend: -3, positiveGood: false, c1: '#f59e0b', c2: '#d97706' },
      { icon: 'fa-users-viewfinder', value: '1.28 M', label: 'Lives Touched', trend: 14, c1: '#1b7df5', c2: '#1465e1' },
    ],
    chart: { type: 'area', title: 'Growth Engine', sub: 'Revenue vs Patients', series: [
      { name: 'Revenue (₹M)', data: revenueSeries, color: '#16ad8f', fill: true },
      { name: 'Patients (10K)', data: revenueSeries.map((_, i) => 60 + i * 6), color: '#1b7df5' },
    ] },
    panelA: { title: 'Strategic OKRs · Q2', rows: [['Reach ₹50Cr ARR', 92], ['Expand to 25 cities', 80], ['LTV:CAC > 12x', 95], ['NPS > 60', 88], ['ISO 27001 certified', 70]] },
    panelB: { title: 'Strategic Risk Register', tiles: [['Caregiver supply in metros', 'Medium'], ['DPDP enforcement', 'Low'], ['Competitive pressure', 'Medium'], ['Tier-1 concentration', 'Medium']] },
  },
  'dash-coo': {
    eyebrow: 'Leadership · COO', title: 'Operations Command',
    subtitle: 'Field operations, fulfilment, SLAs and workforce across all service lines.',
    stats: [
      { icon: 'fa-truck-fast', value: '3.1 min', label: 'Avg Dispatch Time', trend: 12, c1: '#16ad8f', c2: '#0a8b75' },
      { icon: 'fa-clock', value: '91.4%', label: 'On-Time Fulfilment', trend: 2, c1: '#1b7df5', c2: '#1465e1' },
      { icon: 'fa-user-nurse', value: '248', label: 'Caregivers Active', sub: '71 en-route', trend: 5, c1: '#8b5cf6', c2: '#6d28d9' },
      { icon: 'fa-route', value: '+28%', label: 'Route Efficiency', trend: 4, c1: '#f59e0b', c2: '#d97706' },
    ],
    chart: { type: 'bar', stacked: true, title: 'Service Volume by Line', sub: 'Daily fulfilment', series: [
      { name: 'Consults', data: months.map(() => r([3000, 4200, 4800, 3600])), color: '#1b7df5' },
      { name: 'Home Visits', data: months.map(() => r([1200, 1600, 1900])), color: '#16ad8f' },
      { name: 'Emergency', data: months.map(() => r([220, 380, 460])), color: '#fb7185' },
    ] },
    panelA: { title: 'Zone Performance', rows: zonesGeo.slice(0, 6).map((z) => [z.name, z.util, z.util > 80 ? '#ef4444' : undefined]) },
    panelB: { title: 'SLA Breakdown', rows: [['Emergency Dispatch', 95], ['ER Pre-Alert', 98], ['Caregiver On-Time', 92], ['Consult Response', 89], ['Sample TAT', 87]] },
  },
  'dash-cfo': {
    eyebrow: 'Leadership · CFO', title: 'Finance Command',
    subtitle: 'Revenue, margins, cash position and forecast accuracy for the board.',
    stats: [
      { icon: 'fa-sack-dollar', value: '₹3.84 Cr', label: 'MRR', trend: 20, c1: '#16ad8f', c2: '#0a8b75' },
      { icon: 'fa-chart-pie', value: '57.2%', label: 'Gross Margin', trend: 3, c1: '#1b7df5', c2: '#1465e1' },
      { icon: 'fa-percent', value: '23.4%', label: 'EBITDA Margin', trend: 6, c1: '#8b5cf6', c2: '#6d28d9' },
      { icon: 'fa-bullseye', value: '94%', label: 'Forecast Accuracy', sub: '30-day', trend: 1, c1: '#f59e0b', c2: '#d97706' },
    ],
    chart: { type: 'area', title: 'Revenue vs Expense vs EBITDA', sub: '₹M · 12 months', series: [
      { name: 'Revenue', data: revenueSeries, color: '#16ad8f', fill: true },
      { name: 'Expense', data: revenueSeries.map((v) => +(v * 0.77).toFixed(1)), color: '#fb7185' },
      { name: 'EBITDA', data: revenueSeries.map((v) => +(v * 0.23).toFixed(1)), color: '#8b5cf6' },
    ] },
    panelA: { title: 'Margin by Service', rows: [['Quick Consult', 64], ['RPM / Chronic', 61], ['Home Care', 55], ['Emergency', 48], ['Diagnostics', 58]] },
    panelB: { title: 'Cash Position', rows: [['Cash in Bank', 72], ['Capital Deployed', 64], ['Collections', 95], ['Leakage Control', 99]] },
  },
  'dash-cmo': {
    eyebrow: 'Leadership · Medical Director', title: 'Clinical Governance',
    subtitle: 'Clinical quality, triage accuracy, prescription audit and patient outcomes.',
    stats: [
      { icon: 'fa-award', value: '88', label: 'Clinical Quality Score', trend: 4, c1: '#16ad8f', c2: '#0a8b75' },
      { icon: 'fa-wave-square', value: '89%', label: 'Triage Accuracy', trend: 2, c1: '#1b7df5', c2: '#1465e1' },
      { icon: 'fa-prescription', value: '92', label: 'Prescription Quality', trend: 3, c1: '#8b5cf6', c2: '#6d28d9' },
      { icon: 'fa-star', value: '4.6/5', label: 'Patient CSAT', sub: 'NPS 57', trend: 1, c1: '#f59e0b', c2: '#d97706' },
    ],
    chart: { type: 'area', title: 'Clinical Quality Trend', sub: 'Composite score · 12 months', series: [
      { name: 'Quality Score', data: months.map((_, i) => 78 + i + r([0, 1, 2, 3])), color: '#16ad8f', fill: true },
    ] },
    panelA: { title: 'Outcomes', rows: [['Consult Completion', 91], ['Follow-up Conversion', 37], ['Hospitalisation Avoided', 32], ['Deterioration Precision', 87]] },
    panelB: { title: 'Specialty Demand', rows: [['Gen Medicine', 92], ['Cardiology', 64], ['Paediatrics', 58], ['Dermatology', 47], ['Gynaecology', 41]] },
  },
  'dash-cto': {
    eyebrow: 'Leadership · CTO', title: 'Technology & Reliability',
    subtitle: 'Platform uptime, latency, AI model health and security posture.',
    stats: [
      { icon: 'fa-server', value: '99.97%', label: 'Platform Uptime', trend: 0.1, c1: '#16ad8f', c2: '#0a8b75' },
      { icon: 'fa-bolt', value: '182 ms', label: 'API P99 Latency', trend: -8, positiveGood: false, c1: '#1b7df5', c2: '#1465e1' },
      { icon: 'fa-microchip', value: '9', label: 'AI Models Live', sub: 'avg 89%', trend: 2, c1: '#8b5cf6', c2: '#6d28d9' },
      { icon: 'fa-shield-halved', value: '0', label: 'P1 Incidents', sub: '90 days', c1: '#f59e0b', c2: '#d97706' },
    ],
    chart: { type: 'area', title: 'Latency Trend', sub: 'P50 / P99 ms', series: [
      { name: 'P50', data: months.map(() => r([60, 72, 84, 90])), color: '#16ad8f', fill: true },
      { name: 'P99', data: months.map(() => r([150, 178, 195, 210])), color: '#fb7185' },
    ] },
    panelA: { title: 'AI Model Health', rows: aiModels.slice(0, 5).map((m) => [m.name, m.unit === '%' ? m.perf : 90, m.status === 'Healthy' ? '#16ad8f' : '#f59e0b']) },
    panelB: { title: 'Service Reliability', rows: [['API Gateway', 99], ['Consult Service', 99], ['Dispatch Engine', 99], ['RPM Ingest', 99], ['Payments', 99]] },
  },
  'dash-growth': {
    eyebrow: 'Leadership · CMO / Growth', title: 'Growth & Marketing',
    subtitle: 'Acquisition, channel ROI, campaign performance and retention.',
    stats: [
      { icon: 'fa-chart-line', value: '4.7x', label: 'Blended ROAS', trend: 8, c1: '#16ad8f', c2: '#0a8b75' },
      { icon: 'fa-indian-rupee-sign', value: '₹612', label: 'CAC', trend: -6, positiveGood: false, c1: '#1b7df5', c2: '#1465e1' },
      { icon: 'fa-arrow-rotate-left', value: '112%', label: 'Net Revenue Retention', trend: 3, c1: '#8b5cf6', c2: '#6d28d9' },
      { icon: 'fa-thumbs-up', value: '57', label: 'NPS Score', trend: 4, c1: '#f59e0b', c2: '#d97706' },
    ],
    chart: { type: 'bar', stacked: true, title: 'Acquisition by Channel', sub: 'New patients · 12 months', series: [
      { name: 'Paid', data: months.map(() => r([2000, 3000, 4000])), color: '#1b7df5' },
      { name: 'Organic', data: months.map(() => r([1500, 2200, 3000])), color: '#16ad8f' },
      { name: 'Referral', data: months.map(() => r([800, 1200, 1800])), color: '#8b5cf6' },
    ] },
    panelA: { title: 'Channel ROI (ROAS)', rows: [['Referral', 93, '#16ad8f'], ['WhatsApp', 72], ['Email', 52], ['Google Ads', 43], ['IVR', 28]] },
    panelB: { title: 'Funnel Performance', rows: [['Visitors', 100], ['Registered', 42], ['KYC Complete', 31], ['First Booking', 22], ['Subscribed', 14]] },
  },
};

export default function Leadership({ id }) {
  const cfg = CONFIGS[id] || CONFIGS['dash-ceo'];
  return (
    <>
      <PageHeader eyebrow={cfg.eyebrow} title={cfg.title} subtitle={cfg.subtitle} />
      <div className="grid-4 stagger mb-4">
        {cfg.stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>
      <div className="grid-3 mb-4">
        <Card className="p-5 col-span-2">
          <SectionTitle title={cfg.chart.title} sub={cfg.chart.sub} />
          {cfg.chart.type === 'bar'
            ? <Bars categories={months} series={cfg.chart.series} stacked={cfg.chart.stacked} />
            : <AreaTrend categories={months} series={cfg.chart.series} />}
        </Card>
        <Card className="p-5">
          <SectionTitle title={cfg.panelA.title} />
          <BarList rows={cfg.panelA.rows} />
        </Card>
      </div>
      <Card className="p-5">
        <SectionTitle title={cfg.panelB.title} />
        {cfg.panelB.tiles
          ? <div className="grid-2">{cfg.panelB.tiles.map((t, i) => <Tile key={i} icon="fa-flag" color="#f59e0b" title={t[0]} text="AI-monitored" right={<Status value={t[1]} />} />)}</div>
          : <BarList rows={cfg.panelB.rows} />}
      </Card>
    </>
  );
}
