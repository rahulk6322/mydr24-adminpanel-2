import { PageTitle, Card, StatCard, SectionHeader, Avatar, StatusBadge } from '../components/ui';
import { RevenueArea, DeptDonut, VisitsBar } from '../components/Charts';
import { kpis, revenueSeries, appointmentsByDept, weeklyVisits, appointments, activity, inr, num } from '../data';

export default function Dashboard() {
  return (
    <>
      <PageTitle
        eyebrow="Overview"
        title="Hospital Dashboard"
        subtitle="Live snapshot of patients, appointments, revenue and department performance."
        actions={
          <>
            <button className="btn btn-ghost"><i className="fa-solid fa-download" /> Export</button>
            <button className="btn btn-primary"><i className="fa-solid fa-plus" /> New Patient</button>
          </>
        }
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mb-5">
        <StatCard icon="fa-hospital-user" label="Total Patients" value={num(kpis.patients)} trend={8} c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-calendar-check" label="Appointments Today" value={kpis.appointmentsToday} trend={5} c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-indian-rupee-sign" label="Revenue (Month)" value={inr(kpis.revenueMonth)} trend={12} c1="#8b5cf6" c2="#6d28d9" />
        <StatCard icon="fa-bed" label="Bed Occupancy" value={`${kpis.occupancy}%`} trend={-2} c1="#f59e0b" c2="#d97706" />
      </div>

      <div className="grid gap-4 grid-cols-1 xl:grid-cols-3 mb-5">
        <Card className="p-5 xl:col-span-2">
          <SectionHeader title="Revenue vs Expense" sub="Last 12 months · ₹ Crore" />
          <RevenueArea data={revenueSeries} />
        </Card>
        <Card className="p-5">
          <SectionHeader title="Appointments by Dept" sub="This month" />
          <DeptDonut data={appointmentsByDept} />
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 xl:grid-cols-3 mb-5">
        <Card className="p-5 xl:col-span-2">
          <SectionHeader title="Weekly Patient Visits" sub="Online vs walk-in" />
          <VisitsBar data={weeklyVisits} />
        </Card>
        <Card className="p-5">
          <SectionHeader title="Recent Activity" right={<span className="live-dot" />} />
          <div className="space-y-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-lg flex items-center justify-center flex-none" style={{ background: a.color + '22', color: a.color }}>
                  <i className={`fa-solid ${a.icon} text-xs`} />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium leading-snug">{a.text}</div>
                  <div className="text-muted text-[11px] mt-0.5">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 pt-5 pb-4"><SectionHeader title="Upcoming Appointments" sub="Today's schedule" /></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-line">
              {['Patient', 'Doctor', 'Department', 'Type', 'Time', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 text-[11px] uppercase tracking-wide font-bold text-muted text-left">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {appointments.slice(0, 6).map((a) => (
                <tr key={a.id} className="border-b border-line/60 hover:bg-surface-2">
                  <td className="px-4 py-3"><div className="flex items-center gap-2.5"><Avatar name={a.patient} size={30} /><span className="font-semibold">{a.patient}</span></div></td>
                  <td className="px-4 py-3 text-muted">{a.doctor}</td>
                  <td className="px-4 py-3">{a.dept}</td>
                  <td className="px-4 py-3">{a.type}</td>
                  <td className="px-4 py-3 font-mono text-[13px]">{a.time}</td>
                  <td className="px-4 py-3"><StatusBadge value={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
