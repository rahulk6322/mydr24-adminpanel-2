import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, Avatar, Status, Button } from '../components/ui/Primitives';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { useToast } from '../context/ToastContext';
import { patients, exec, cities } from '../lib/data';
import { inr, num } from '../lib/format';

function Score({ value, positiveGood = true }) {
  const color = positiveGood
    ? value >= 75 ? '#16ad8f' : value >= 50 ? '#f59e0b' : '#ef4444'
    : value <= 30 ? '#16ad8f' : value <= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div className="progress w-14"><span style={{ width: `${value}%`, background: color }} /></div>
      <span className="metric-value text-[12.5px]" style={{ color }}>{value}</span>
    </div>
  );
}

export default function Patients() {
  const navigate = useNavigate();
  const toast = useToast();
  const [showNew, setShowNew] = useState(false);

  const columns = [
    { label: 'Patient', key: 'name', csv: (r) => r.name, render: (r) => (
      <div className="flex items-center gap-3">
        <Avatar name={r.name} size={34} />
        <div><div className="font-semibold">{r.name}</div><div className="text-muted text-xs font-mono">{r.id} · {r.age}{r.gender[0]}</div></div>
      </div>
    ) },
    { label: 'ABHA', key: 'abha', render: (r) => <span className="font-mono text-xs">{r.abha}</span> },
    { label: 'Condition', key: 'condition' },
    { label: 'Risk', key: 'risk', render: (r) => <Status value={r.risk} /> },
    { label: 'Plan', key: 'plan', render: (r) => <Status value={r.plan} /> },
    { label: 'Health', key: 'healthScore', sortValue: (r) => r.healthScore, render: (r) => <Score value={r.healthScore} /> },
    { label: 'Churn', key: 'churn', sortValue: (r) => r.churn, render: (r) => <Score value={r.churn} positiveGood={false} /> },
    { label: 'LTV', key: 'ltv', sortValue: (r) => r.ltv, csv: (r) => r.ltv, render: (r) => <span className="metric-value text-[13px]">{inr(r.ltv)}</span> },
    { label: '', render: (r) => <Button size="sm" variant="soft" onClick={() => navigate(`/patients/${r.id}`)}>360°</Button> },
  ];

  return (
    <>
      <PageHeader eyebrow="Clinical · Patient Management" title="Patient Directory"
        subtitle={`${num(exec.activePatients)} active patients · FHIR R4 · ABHA-linked · DPDP compliant.`}
        actions={[{ label: 'New Patient', icon: 'fa-user-plus', variant: 'primary', onClick: () => setShowNew(true) }]} />

      <div className="grid-4 stagger mb-4">
        <StatCard icon="fa-users" value={num(exec.activePatients)} label="Active Patients" trend={12} c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-heart-pulse" value={num(exec.rpmActive)} label="RPM Monitored" trend={9} c1="#ef4444" c2="#b91c1c" />
        <StatCard icon="fa-triangle-exclamation" value="1,840" label="High-Risk Tier" sub="auto-flagged" c1="#f59e0b" c2="#d97706" />
        <StatCard icon="fa-indian-rupee-sign" value="₹2,840" label="Avg Patient LTV" trend={6} c1="#16ad8f" c2="#0a8b75" />
      </div>

      <DataTable columns={columns} rows={patients} title="All Patients" subtitle="Search, sort, export, or open the full 360° record" pageSize={9} />

      {showNew && (
        <Modal title="Register New Patient" subtitle="Identity · KYC · ABHA" icon="fa-user-plus" onClose={() => setShowNew(false)}
          footer={<>
            <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button variant="primary" icon="fa-check" onClick={() => { setShowNew(false); toast({ title: 'Patient created', text: 'Identity verified · ABHA linked.', type: 'success' }); }}>Verify & Create</Button>
          </>}>
          <div className="grid-2" style={{ gap: 14 }}>
            <div><label className="field-label">Full Name</label><input className="input" placeholder="Patient name" /></div>
            <div><label className="field-label">Age</label><input className="input" placeholder="Age" /></div>
            <div><label className="field-label">Gender</label><select className="select"><option>Male</option><option>Female</option><option>Other</option></select></div>
            <div><label className="field-label">ABHA / Aadhaar</label><input className="input" placeholder="14-digit ABHA" /></div>
            <div><label className="field-label">City</label><select className="select">{cities.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div><label className="field-label">Plan</label><select className="select"><option>Silver</option><option>Gold</option><option>Platinum</option><option>PMJAY</option></select></div>
          </div>
        </Modal>
      )}
    </>
  );
}
