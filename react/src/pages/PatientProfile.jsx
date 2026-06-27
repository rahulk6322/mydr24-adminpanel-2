import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, Card, SectionTitle, Avatar, Status, Tile, Button } from '../components/ui/Primitives';
import { AreaTrend } from '../components/charts/Charts';
import { patients } from '../lib/data';
import { inr, rnd, pick } from '../lib/format';

function KVRow({ k, v }) {
  return <div className="flex justify-between py-1.5 text-[13px]"><span className="text-muted">{k}</span><span className="font-semibold font-mono">{v}</span></div>;
}
function MiniScore({ label, value, color }) {
  return (
    <div className="p-3 rounded-xl card-2 border border-line text-center">
      <div className="metric-value text-2xl" style={{ color }}>{value}</div>
      <div className="text-muted text-[11px] mt-1">{label}</div>
    </div>
  );
}
function Vital({ label, v, icon, color }) {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg card-2 border border-line">
      <i className={`fa-solid ${icon}`} style={{ color }} />
      <div><div className="font-semibold text-[13px]">{v}</div><div className="text-muted text-[10.5px]">{label}</div></div>
    </div>
  );
}

const TIMELINE = [
  { icon: 'fa-video', color: '#1b7df5', t: 'Video consultation · Dr. Sharma (Cardiology)', d: '2 days ago', x: 'BP well controlled. Continue current regimen.' },
  { icon: 'fa-vial', color: '#f59e0b', t: 'Lab report uploaded · Lipid Profile', d: '5 days ago', x: 'LDL 112 mg/dL · slightly elevated.' },
  { icon: 'fa-prescription', color: '#8b5cf6', t: 'Prescription issued', d: '5 days ago', x: 'Atorvastatin 10mg added.' },
  { icon: 'fa-house-medical', color: '#16ad8f', t: 'Home nursing visit completed', d: '8 days ago', x: 'Vitals recorded · wound dressing changed.' },
  { icon: 'fa-truck-medical', color: '#ef4444', t: 'Emergency · chest pain (resolved)', d: '22 days ago', x: 'ECG normal · discharged after observation.' },
];

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const p = patients.find((x) => x.id === id) || patients[0];

  return (
    <>
      <PageHeader eyebrow="Clinical · 360° Profile" title="360° Patient Profile"
        subtitle="Longitudinal FHIR R4 record · vitals, history, AI scores, care plan and billing."
        actions={[
          { label: 'Back', icon: 'fa-arrow-left', variant: 'ghost', onClick: () => navigate('/patients') },
          { label: 'Start Consult', icon: 'fa-video', variant: 'primary', onClick: () => {} },
        ]} />

      <div className="grid-3 mb-4">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <Avatar name={p.name} size={64} />
            <div>
              <div className="section-title text-lg">{p.name}</div>
              <div className="text-muted text-[13px]">{p.age} yrs · {p.gender} · {p.city}</div>
              <div className="mt-2 flex gap-2"><Status value={p.plan} /><Status value={`${p.risk}`} /></div>
            </div>
          </div>
          <div className="divider my-4" />
          <KVRow k="Patient ID" v={p.id} />
          <KVRow k="ABHA" v={p.abha} />
          <KVRow k="Blood Group" v={pick(['O+', 'A+', 'B+', 'AB+'])} />
          <KVRow k="Primary Condition" v={p.condition} />
          <KVRow k="Last Visit" v={p.lastVisit} />
        </Card>

        <Card className="p-5">
          <SectionTitle title="AI Health Scores" sub="Updated daily" />
          <div className="grid grid-cols-2 gap-3">
            <MiniScore label="Health Score" value={p.healthScore} color="#16ad8f" />
            <MiniScore label="Churn Risk" value={p.churn} color="#ef4444" />
            <MiniScore label="Emergency Score" value={p.emgScore} color="#f59e0b" />
            <MiniScore label="Engagement" value={rnd(40, 95)} color="#1b7df5" />
          </div>
          <div className="divider my-3" />
          <div className="flex items-center justify-between"><span className="text-muted text-[13px]">Patient Lifetime Value</span><span className="metric-value gradient-text">{inr(p.ltv)}</span></div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Latest Vitals" sub="RPM stream" />
          <AreaTrend categories={['', '', '', '', '', '', '']} series={[{ name: 'HR', data: [76, 80, 78, 82, 77, 79, 78], color: '#16ad8f', fill: true }]} legend={false} height={130} />
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Vital label="BP" v="128/82" icon="fa-heart-pulse" color="#ef4444" />
            <Vital label="SpO2" v="97%" icon="fa-lungs" color="#1b7df5" />
            <Vital label="HR" v="78 bpm" icon="fa-wave-square" color="#16ad8f" />
            <Vital label="Glucose" v="104" icon="fa-droplet" color="#f59e0b" />
          </div>
        </Card>
      </div>

      <div className="grid-3">
        <Card className="p-5 col-span-2">
          <SectionTitle title="Medical Timeline" sub="Consultations · diagnoses · prescriptions" />
          <div className="space-y-0">
            {TIMELINE.map((e, i) => (
              <div key={i} className="feed-item pb-4 last:pb-0">
                {i < TIMELINE.length - 1 && <span className="feed-line" />}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[13.5px] font-semibold flex items-center gap-2"><i className={`fa-solid ${e.icon} text-xs`} style={{ color: e.color }} />{e.t}</div>
                    <div className="text-muted text-xs mt-0.5">{e.x}</div>
                  </div>
                  <div className="text-muted text-[11px] whitespace-nowrap">{e.d}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle title="Care Plan & Meds" sub="Active" />
          <div className="space-y-2">
            <Tile icon="fa-pills" color="#8b5cf6" title="Metformin 500mg" text="Twice daily · with meals" />
            <Tile icon="fa-pills" color="#1b7df5" title="Telmisartan 40mg" text="Once daily · morning" />
            <Tile icon="fa-calendar-check" color="#16ad8f" title="Physiotherapy" text="3x weekly · home visit" />
            <Tile icon="fa-vial" color="#f59e0b" title="HbA1c Test" text="Due in 14 days" />
          </div>
        </Card>
      </div>
    </>
  );
}
