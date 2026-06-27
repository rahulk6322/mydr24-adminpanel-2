import { useState } from 'react';
import { PageHeader, StatCard, Card, SectionTitle, Badge, Status, Tile } from '../components/ui/Primitives';
import { Donut, AreaTrend, Bars } from '../components/charts/Charts';
import DataTable from '../components/ui/DataTable';
import MapView from '../components/MapView';
import { useToast } from '../context/ToastContext';
import { emergencies, hospitals, liveOps, zonesGeo, months } from '../lib/data';
import { rnd } from '../lib/format';

const PC = { P1: '#ef4444', P2: '#f59e0b', P3: '#1b7df5' };

/* ---------- Command center ---------- */
function Center() {
  const steps = [
    ['T+0s', 'Request received · AI triage <10s', 'fa-bolt', '#ef4444'],
    ['T+60s', 'Nearest ambulance dispatched', 'fa-truck-medical', '#f59e0b'],
    ['T+2m', 'ER pre-alerted with vitals & ETA', 'fa-hospital', '#1b7df5'],
    ['T+5m', 'Coordinator assigned · family notified', 'fa-headset', '#8b5cf6'],
    ['Arrival', 'FHIR R4 digital handover to ER', 'fa-right-left', '#16ad8f'],
  ];
  return (
    <>
      <PageHeader eyebrow="Emergency · Command" title="Emergency Command Center"
        subtitle="Live feed of all active emergencies with AI triage, dispatch and escalation controls · 99.99% uptime." />
      <div className="grid-4 stagger mb-4">
        <StatCard icon="fa-truck-medical" value="3.1 min" label="Dispatch Response" sub="target <5 min" trend={12} c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-route" value="8.2 min" label="Avg Ambulance ETA" sub="metro" trend={4} c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-hospital" value="847" label="Partner Beds" sub="live network" c1="#8b5cf6" c2="#6d28d9" />
        <StatCard icon="fa-gauge-high" value="91.4%" label="SLA Compliance" trend={2} c1="#f59e0b" c2="#d97706" />
      </div>
      <div className="grid-3 mb-4">
        <Card className="p-5 col-span-2">
          <SectionTitle title="Active Emergencies" sub="Colour-coded by priority" right={<span className="live-dot" />} />
          <div className="space-y-2.5">
            {emergencies.slice(0, 6).map((e) => (
              <div key={e.id} className="flex items-center gap-3 p-3.5 rounded-xl card-2 border border-line" style={{ borderLeft: `3px solid ${PC[e.priority]}` }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-none" style={{ background: PC[e.priority] }}><i className="fa-solid fa-truck-medical" /></div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-[13.5px] flex items-center gap-2">{e.type} · {e.zone} <Badge variant={e.priority === 'P1' ? 'red' : e.priority === 'P2' ? 'amber' : 'blue'}>{e.priority}</Badge></div>
                  <div className="text-muted text-xs font-mono mt-0.5">{e.id} · {e.ambulance} · triage {e.triageSec}s</div>
                </div>
                <div className="text-right flex-none"><div className="metric-value text-[13px]">{e.eta}</div><Status value={e.status} /></div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle title="Dispatch Workflow" sub="T+0 to resolution" />
          <div className="space-y-0">
            {steps.map((s, i) => (
              <div key={i} className="feed-item pb-4 last:pb-0">
                {i < steps.length - 1 && <span className="feed-line" />}
                <div className="text-[13px] font-semibold flex items-center gap-2"><i className={`fa-solid ${s[2]} text-xs`} style={{ color: s[3] }} />{s[1]}</div>
                <div className="text-muted text-[11px] font-mono mt-0.5">{s[0]}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid-3">
        <Card className="p-5"><SectionTitle title="Emergency Types" sub="MTD" />
          <Donut height={220} legend="bottom" data={[
            { label: 'Cardiac', value: 28, color: '#ef4444' }, { label: 'Trauma', value: 22, color: '#f59e0b' },
            { label: 'Respiratory', value: 18, color: '#1b7df5' }, { label: 'Obstetric', value: 14, color: '#8b5cf6' },
            { label: 'Paediatric', value: 10, color: '#16ad8f' }, { label: 'Stroke', value: 8, color: '#0ea5e9' },
          ]} />
        </Card>
        <Card className="p-5 col-span-2"><SectionTitle title="Response Time Trend" sub="Dispatch & ETA · minutes" />
          <AreaTrend categories={months} height={220} series={[
            { name: 'Dispatch', data: months.map(() => +(2.5 + Math.random() * 1.5).toFixed(1)), color: '#16ad8f', fill: true },
            { name: 'ETA', data: months.map(() => +(7 + Math.random() * 3).toFixed(1)), color: '#fb7185' },
          ]} />
        </Card>
      </div>
    </>
  );
}

/* ---------- Ambulance map ---------- */
function AmbulanceMap() {
  const markers = emergencies.map((e) => ({ lat: e.lat, lng: e.lng, color: PC[e.priority], icon: 'fa-truck-medical', popup: `<b>${e.ambulance}</b><br>${e.type} · ${e.priority}<br>${e.status} · ETA ${e.eta}` }));
  zonesGeo.slice(0, 5).forEach((z) => markers.push({ lat: z.lat + 0.02, lng: z.lng + 0.02, color: '#16ad8f', icon: 'fa-hospital', popup: `<b>Partner Hospital</b><br>${z.name}` }));
  const Mini = ({ color, value, label }) => (
    <Card className="p-4 text-center"><div className="metric-value text-2xl" style={{ color }}>{value}</div><div className="text-muted text-[11.5px] mt-1">{label}</div></Card>
  );
  return (
    <>
      <PageHeader eyebrow="Emergency · Real-Time" title="Live Ambulance Map" subtitle="All active ambulances plotted with status and priority · GPS updated every 5 seconds." />
      <div className="grid-3">
        <Card className="p-0 overflow-hidden col-span-2"><MapView center={[28.6139, 77.209]} zoom={10} markers={markers} height={520} /></Card>
        <div className="space-y-4">
          <div className="grid-2" style={{ gap: 12 }}>
            <Mini color="#ef4444" value={liveOps.emgBreak.crit} label="Critical" />
            <Mini color="#f59e0b" value={liveOps.emgBreak.high} label="High" />
            <Mini color="#1b7df5" value={liveOps.ambulancesReady} label="Ready" />
            <Mini color="#8b5cf6" value={liveOps.ambulancesDeployed} label="Deployed" />
          </div>
          <Card className="p-5">
            <SectionTitle title="Active Dispatches" right={<span className="live-dot" />} />
            <div className="space-y-2">
              {emergencies.slice(0, 6).map((e) => <Tile key={e.id} icon="fa-truck-medical" color={e.priority === 'P1' ? '#ef4444' : '#f59e0b'} title={`${e.ambulance} · ${e.type}`} text={`${e.zone} · ETA ${e.eta}`} right={<Status value={e.status} />} />)}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

/* ---------- Demand heatmap ---------- */
function Heatmap() {
  const circles = zonesGeo.map((z) => ({
    lat: z.lat, lng: z.lng, radius: 10 + z.util / 4,
    color: z.util > 85 ? '#ef4444' : z.util > 70 ? '#f59e0b' : z.util > 55 ? '#0ea5e9' : '#16ad8f',
    popup: `<b>${z.name}</b><br>Demand: ${z.demand}<br>Utilisation: ${z.util}%`,
  }));
  return (
    <>
      <PageHeader eyebrow="Operations · Geo-Intelligence" title="Live Demand Heatmap" subtitle="PIN-code level demand with resource overlays and AI pre-positioning alerts." />
      <div className="grid-3">
        <Card className="p-0 overflow-hidden col-span-2"><MapView center={[22.9734, 78.6569]} zoom={5} circles={circles} height={520} /></Card>
        <div className="space-y-4">
          <Card className="p-5"><SectionTitle title="Demand Intensity" />
            {[['Critical', '#ef4444'], ['Surge', '#fb7185'], ['High', '#f59e0b'], ['Moderate', '#0ea5e9'], ['Low', '#16ad8f']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-2.5 py-1.5"><span className="w-4 h-4 rounded" style={{ background: c }} /><span className="text-[13px]">{l}</span></div>
            ))}
          </Card>
          <Card className="p-5"><SectionTitle title="Pre-Positioning Alerts" right={<span className="live-dot" />} />
            <div className="space-y-2">
              <Tile icon="fa-fire" color="#ef4444" title="Delhi NCR · Surge" text="88% utilisation · pre-deploy 6 units" />
              <Tile icon="fa-cloud-bolt" color="#f59e0b" title="Weather risk · Mumbai" text="Heavy rain · reroute advisory" />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

/* ---------- AI triage ---------- */
function Triage() {
  const toast = useToast();
  const [result, setResult] = useState(null);
  return (
    <>
      <PageHeader eyebrow="Emergency · AI" title="AI Triage Engine" subtitle="ESI-aligned NLP scoring from symptoms + RPM vitals + history · severity P1–P5 in under 10 seconds." />
      <div className="grid-4 stagger mb-4">
        <StatCard icon="fa-stopwatch" value="7.2s" label="Avg Triage Time" sub="target <10s" c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-bullseye" value="89%" label="Triage Accuracy" trend={2} c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-arrows-rotate" value="6.4%" label="Reclassification" sub="target <8%" c1="#8b5cf6" c2="#6d28d9" />
        <StatCard icon="fa-list-ol" value="4,120" label="Triaged (MTD)" trend={9} c1="#f59e0b" c2="#d97706" />
      </div>
      <div className="grid-2">
        <Card className="p-5"><SectionTitle title="Severity Distribution" sub="P1–P5 breakdown" />
          <Bars categories={['P1', 'P2', 'P3', 'P4', 'P5']} legend={false} series={[{ name: 'Cases', data: [320, 680, 1240, 980, 900], color: '#1b7df5' }]} height={260} />
        </Card>
        <Card className="p-5"><SectionTitle title="Triage Simulator" sub="Enter symptoms for instant scoring" />
          <textarea className="textarea mb-3" rows={3} placeholder="e.g. 58yo male, crushing chest pain radiating to left arm, sweating, SpO2 91%" />
          <button className="btn btn-primary w-full" onClick={() => { setResult(true); toast({ title: 'Triage complete', text: 'P1 Critical · 7.1s · recommend immediate dispatch.', type: 'error' }); }}>
            <i className="fa-solid fa-bolt" /> Run AI Triage
          </button>
          {result && (
            <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgb(239 68 68 / .1)', border: '1px solid rgb(239 68 68 / .3)' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl" style={{ background: '#ef4444' }}>P1</div>
                <div><div className="font-semibold">Critical · Immediate dispatch</div><div className="text-muted text-xs">Suspected ACS · 96% confidence · scored in 7.1s</div></div>
              </div>
              <div className="mt-3 text-[13px] text-muted">Recommended: ALS ambulance + cardiac-capable hospital + ER pre-alert.</div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

/* ---------- Hospital beds ---------- */
function Beds() {
  const columns = [
    { label: 'Hospital', key: 'name', render: (r) => <div className="flex items-center gap-2"><i className="fa-solid fa-hospital text-[#16ad8f]" /><span className="font-semibold">{r.name}</span></div> },
    { label: 'General', key: 'general', sortValue: (r) => r.general },
    { label: 'ICU', key: 'icu', sortValue: (r) => r.icu },
    { label: 'NICU', key: 'nicu' }, { label: 'Ventilators', key: 'ventilators' },
    { label: 'Occupancy', key: 'occupancy', sortValue: (r) => r.occupancy, render: (r) => {
      const c = r.occupancy > 90 ? '#ef4444' : r.occupancy > 75 ? '#f59e0b' : '#16ad8f';
      return <div className="flex items-center gap-2"><div className="progress w-16"><span style={{ width: `${r.occupancy}%`, background: c }} /></div><span className="text-[12px]">{r.occupancy}%</span></div>;
    } },
  ];
  return (
    <>
      <PageHeader eyebrow="Emergency · Network" title="Hospital Bed Network" subtitle="Live general, ICU, NICU and ventilator availability across the partner hospital network." />
      <div className="grid-4 stagger mb-4">
        <StatCard icon="fa-bed" value="847" label="General Beds" c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-bed-pulse" value="92" label="ICU Available" c1="#ef4444" c2="#b91c1c" />
        <StatCard icon="fa-baby" value="34" label="NICU Available" c1="#8b5cf6" c2="#6d28d9" />
        <StatCard icon="fa-lungs" value="58" label="Ventilators Free" c1="#16ad8f" c2="#0a8b75" />
      </div>
      <DataTable columns={columns} rows={hospitals} title="Partner Hospital Capacity" pageSize={8} searchable={false} />
    </>
  );
}

export default function Emergency({ view = 'center' }) {
  if (view === 'map') return <AmbulanceMap />;
  if (view === 'heatmap') return <Heatmap />;
  if (view === 'triage') return <Triage />;
  if (view === 'beds') return <Beds />;
  return <Center />;
}
