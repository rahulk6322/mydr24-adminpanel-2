import { PageHeader, StatCard, Card, SectionTitle, Avatar, Status, Tile } from '../components/ui/Primitives';
import DataTable from '../components/ui/DataTable';
import MapView from '../components/MapView';
import { caregivers } from '../lib/data';

const STATUS_COLOR = { Available: '#16ad8f', 'En Route': '#f59e0b', 'On Visit': '#1b7df5' };

function Directory() {
  const columns = [
    { label: 'Caregiver', key: 'name', csv: (r) => r.name, render: (r) => (
      <div className="flex items-center gap-3"><Avatar name={r.name} size={34} /><div><div className="font-semibold">{r.name}</div><div className="text-muted text-xs font-mono">{r.id}</div></div></div>
    ) },
    { label: 'Skill', key: 'skill' },
    { label: 'City', key: 'city' },
    { label: 'Status', key: 'status', render: (r) => <Status value={r.status} /> },
    { label: 'Rating', key: 'rating', sortValue: (r) => +r.rating, render: (r) => <span className="badge badge-amber"><i className="fa-solid fa-star" />{r.rating}</span> },
    { label: 'On-Time', key: 'onTime', sortValue: (r) => r.onTime, render: (r) => `${r.onTime}%` },
    { label: 'Visits/mo', key: 'visitsMonth', sortValue: (r) => r.visitsMonth },
  ];
  return (
    <>
      <PageHeader eyebrow="Workforce · Caregivers" title="Caregiver Directory"
        subtitle="Recruitment, verification, scheduling, performance and AI burnout prediction." />
      <div className="grid-4 stagger mb-4">
        <StatCard icon="fa-user-nurse" value="2,180" label="Active Caregivers" trend={6} c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-clock" value="92%" label="On-Time Arrival" trend={2} c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-heart-crack" value="14" label="Burnout Risk" sub="AI-flagged" c1="#f59e0b" c2="#d97706" />
        <StatCard icon="fa-arrows-rotate" value="75%" label="6-Month Retention" trend={3} c1="#8b5cf6" c2="#6d28d9" />
      </div>
      <DataTable columns={columns} rows={caregivers} title="All Caregivers" pageSize={9} />
    </>
  );
}

function Live() {
  const active = caregivers.filter((c) => c.status !== 'Off Shift');
  const markers = active.map((c) => ({ lat: c.lat, lng: c.lng, color: STATUS_COLOR[c.status] || '#1b7df5', icon: 'fa-user-nurse', popup: `<b>${c.name}</b><br>${c.skill}<br>Status: ${c.status}` }));
  const count = (s) => caregivers.filter((c) => c.status === s).length;

  const columns = [
    { label: 'Caregiver', key: 'name', render: (r) => <div className="flex items-center gap-2"><Avatar name={r.name} size={30} /><span className="font-semibold">{r.name}</span></div> },
    { label: 'Skill', key: 'skill' },
    { label: 'Status', key: 'status', render: (r) => <Status value={r.status} /> },
    { label: 'Battery', key: 'battery', sortValue: (r) => r.battery, render: (r) => <span style={{ color: r.battery < 20 ? '#ef4444' : '#16ad8f' }}><i className="fa-solid fa-battery-half" /> {r.battery}%</span> },
    { label: 'Visits Today', key: 'visitsToday' },
  ];

  return (
    <>
      <PageHeader eyebrow="Workforce · Real-Time" title="Caregiver Live Geo-Tracking"
        subtitle="GPS plot of active caregivers · geofence visit verification · route deviation alerts." />
      <div className="grid-3 mb-4">
        <Card className="p-0 overflow-hidden col-span-2"><MapView center={[28.6139, 77.209]} zoom={11} markers={markers} height={460} /></Card>
        <div className="space-y-4">
          <Card className="p-5">
            <SectionTitle title="Status Legend" />
            {[['Available', '#16ad8f'], ['En Route', '#f59e0b'], ['On Visit', '#1b7df5']].map(([s, c]) => (
              <div key={s} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2.5"><span className="w-3 h-3 rounded-full" style={{ background: c }} /><span className="text-[13.5px]">{s}</span></div>
                <span className="metric-value text-[15px]">{count(s)}</span>
              </div>
            ))}
          </Card>
          <Card className="p-5">
            <SectionTitle title="Field Alerts" right={<span className="live-dot" />} />
            <div className="space-y-2">
              <Tile icon="fa-route" color="#f59e0b" title="Route deviation" text={`${caregivers[2].name} · >500m off-route`} />
              <Tile icon="fa-battery-quarter" color="#ef4444" title="Low battery" text={`${caregivers[5].name} · 12% · mid-shift`} />
              <Tile icon="fa-location-check" color="#16ad8f" title="Geofence check-in" text={`${caregivers[1].name} · arrived (<50m)`} />
            </div>
          </Card>
        </div>
      </div>
      <DataTable columns={columns} rows={active} title="Active Field Workforce" pageSize={7} />
    </>
  );
}

export default function Caregivers({ live = false }) {
  return live ? <Live /> : <Directory />;
}
