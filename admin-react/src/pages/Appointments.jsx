import { useState } from 'react';
import { PageTitle, StatCard, DataTable, Avatar, StatusBadge, Badge } from '../components/ui';
import { appointments } from '../data';

const TABS = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

export default function Appointments() {
  const [tab, setTab] = useState('All');
  const rows = tab === 'All' ? appointments : appointments.filter((a) => a.status === tab);

  const columns = [
    { key: 'id', label: 'ID', render: (r) => <span className="font-mono text-[12.5px] font-semibold">{r.id}</span> },
    { key: 'patient', label: 'Patient', render: (r) => <div className="flex items-center gap-2.5"><Avatar name={r.patient} size={30} /><span className="font-semibold">{r.patient}</span></div> },
    { key: 'doctor', label: 'Doctor' },
    { key: 'dept', label: 'Department' },
    { key: 'type', label: 'Type', render: (r) => <Badge tone="blue">{r.type}</Badge> },
    { key: 'time', label: 'Time', render: (r) => <span className="font-mono text-[13px]">{r.time}</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge value={r.status} /> },
  ];

  return (
    <>
      <PageTitle eyebrow="Scheduling" title="Appointments" subtitle="Today's bookings across all departments."
        actions={<button className="btn btn-primary"><i className="fa-solid fa-calendar-plus" /> Book Appointment</button>} />
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4 mb-5">
        <StatCard icon="fa-calendar-day" label="Today" value="286" trend={5} c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-clock" label="Avg Wait" value="12 min" trend={-8} c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-circle-check" label="Confirmed" value="214" c1="#8b5cf6" c2="#6d28d9" />
        <StatCard icon="fa-calendar-xmark" label="No-shows" value="4.2%" trend={-1} c1="#f59e0b" c2="#d97706" />
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`btn !py-2 ${tab === t ? 'btn-primary' : 'btn-ghost'}`}>{t}</button>
        ))}
      </div>
      <DataTable columns={columns} rows={rows} title={`${tab} Appointments`} sub={`${rows.length} shown`} />
    </>
  );
}
