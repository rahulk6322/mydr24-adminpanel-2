import { PageTitle, StatCard, DataTable, Avatar, StatusBadge } from '../components/ui';
import { patients, inr, num } from '../data';

export default function Patients() {
  const columns = [
    { key: 'name', label: 'Patient', render: (r) => (
      <div className="flex items-center gap-3">
        <Avatar name={r.name} size={34} />
        <div><div className="font-semibold">{r.name}</div><div className="text-muted text-xs font-mono">{r.id} · {r.age}{r.gender[0]}</div></div>
      </div>
    ) },
    { key: 'condition', label: 'Condition' },
    { key: 'doctor', label: 'Doctor' },
    { key: 'plan', label: 'Plan', render: (r) => <StatusBadge value={r.plan} /> },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge value={r.status} /> },
    { key: 'bill', label: 'Bill', align: 'right', render: (r) => <span className="metric text-[13px]">{inr(r.bill)}</span> },
    { key: 'lastVisit', label: 'Last Visit', align: 'right' },
  ];
  return (
    <>
      <PageTitle eyebrow="Records" title="Patients" subtitle="Manage patient records, admissions and billing."
        actions={<button className="btn btn-primary"><i className="fa-solid fa-user-plus" /> Add Patient</button>} />
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4 mb-5">
        <StatCard icon="fa-hospital-user" label="Total Patients" value={num(18420)} trend={8} c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-bed-pulse" label="Admitted" value="312" trend={3} c1="#ef4444" c2="#b91c1c" />
        <StatCard icon="fa-door-open" label="Out-patients" value="1,204" trend={6} c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-heart-circle-check" label="Discharged (mo)" value="892" trend={4} c1="#8b5cf6" c2="#6d28d9" />
      </div>
      <DataTable columns={columns} rows={patients} title="All Patients" sub={`${patients.length} records`} />
    </>
  );
}
